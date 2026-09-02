import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebaseAdmin';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-10-28' as any,
});

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  // 1. Security Check
  try {
    if (!sig) throw new Error('Missing stripe-signature header');
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. Handle successful INITIAL subscription sign-up & One-time checkouts
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      let productNames = 'Subscription Plan';
      let totalItems = 1;

      // Safely fetch line items if they exist
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        if (lineItems && lineItems.data.length > 0) {
          productNames = lineItems.data.map(item => item.description).join(', ');
          totalItems = lineItems.data.reduce((acc, item) => acc + (item.quantity || 0), 0);
        }
      } catch (lineError) {
        console.log('ℹ️ Could not pull standard line items, using mode default.');
      }

      // Retrieve the formatted, sequential invoice number from Stripe
      let orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      if (session.invoice) {
        try {
          const invoiceDetails = await stripe.invoices.retrieve(session.invoice as string);
          if (invoiceDetails.number) {
            orderNumber = invoiceDetails.number; // Captures formatted string like "INV-0001"
          }
        } catch (invoiceError) {
          console.error('❌ Could not retrieve invoice details, using internal reference fallback:', invoiceError);
          orderNumber = session.invoice.toString();
        }
      } else if (session.id) {
        orderNumber = session.id.replace('cs_live_', 'CH_');
      }

      const customerName = session.customer_details?.name || 'Unknown Customer';
      const customerEmail = session.customer_details?.email;
      const netSales = (session.amount_total || 0) / 100;

      let couponApplied = '-';
      const totalDetails = session.total_details as any;
      if (totalDetails?.breakdown?.discounts?.length > 0) {
        couponApplied = totalDetails.breakdown.discounts[0]?.discount?.coupon?.id || '-';
      }

      const isHostingRenewal = session.metadata?.type === 'hosting_renewal';
      const attribution = isHostingRenewal 
        ? 'Hosting Renewal' 
        : (session.metadata?.utm_source || 'Direct');

      const salePayload = {
        date: new Date().toISOString(),
        order_number: orderNumber,
        status: session.payment_status === 'paid' ? 'Completed' : 'Pending',
        customer: String(customerName),
        customer_type: session.customer ? 'Registered' : 'Guest',
        products: String(productNames),
        items_sold: Number(totalItems) || 1,
        coupons: String(couponApplied),
        net_sales: Number(netSales) || 0,
        attribution: String(attribution)
      };

      // Save to Firestore sales collection
      await db.collection('sales').add(salePayload);
      console.log(`Base synced: ✅ Sale successfully logged to Firebase for order #${orderNumber}`);

      // If this was a Hosting Renewal, auto-advance the client's hosting renewal date in Firestore
      if (isHostingRenewal && session.metadata?.hosting_id) {
        try {
          const hostingRef = db.collection('hosting_accounts').doc(session.metadata.hosting_id);
          const hostingDoc = await hostingRef.get();
          if (hostingDoc.exists) {
            const hostingData = hostingDoc.data();
            const currentRenewal = new Date(hostingData?.renewalDate || new Date());
            let nextRenewal = new Date(currentRenewal);
            nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);

            const today = new Date();
            if (nextRenewal < today) {
              nextRenewal = new Date(today);
              nextRenewal.setFullYear(today.getFullYear() + 1);
            }

            const nextRenewalStr = nextRenewal.toISOString().split('T')[0];

            await hostingRef.update({
              renewalDate: nextRenewalStr,
              status: 'active',
              lastPaidOrderNumber: orderNumber,
              updatedAt: new Date().toISOString(),
            });
            console.log(`Hosting auto-renewed: ✅ Hosting account #${session.metadata.hosting_id} (${hostingData?.domain}) renewed until ${nextRenewalStr}`);
          }
        } catch (hostingRenewalErr) {
          console.error('❌ Error auto-advancing hosting renewal in Firestore:', hostingRenewalErr);
        }
      }

      // Send Custom HTML Email via Resend if email exists
      const resend = getResendClient();
      if (customerEmail && resend) {
        await resend.emails.send({
          from: 'Indeva Websites <web@indevasa.com>',
          to: customerEmail,
          subject: `Your Receipt for Order #${orderNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #fa8f27; text-align: center;">Thank You for Your Purchase!</h2>
              <p>Hi ${customerName},</p>
              <p>We've successfully processed your payment. Here are your order details:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;">Order Number</td>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: right;">#${orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;">Product</td>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: right;">${productNames}</td>
                </tr>
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;">Total Amount</td>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: right; font-weight: bold; color: #10B981;">$${netSales.toFixed(2)} USD</td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #6B7280; text-align: center; margin-top: 30px;">
                If you have any questions about this invoice, reply directly to this email.
              </p>
            </div>
          `,
        });
        console.log(`✉️ Receipt email sent successfully to ${customerEmail}`);
      }

    } catch (dbError) {
      console.error('❌ Error processing or saving data:', dbError);
      return NextResponse.json({ error: 'Database insertion failed' }, { status: 500 });
    }
  }

  // 3. Handle ALL successful invoice payments (Initial, Manual, and Monthly cycles)
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;

    try {
      const orderNumber = invoice.number || invoice.id;
      const customerName = invoice.customer_name || invoice.customer_email || 'Subscription Customer';
      const customerEmail = invoice.customer_email;
      const netSales = (invoice.amount_paid || 0) / 100;
      
      // Dynamically label the attribution type based on the invoice context reason
      const isRenewal = invoice.billing_reason === 'subscription_cycle';
      const attributionType = isRenewal ? 'Subscription Renewal' : (invoice.billing_reason || 'Manual Invoice');

      // Map line items from the invoice object
      let productNames = 'Service Plan Purchase';
      let totalItems = 0;
      if (invoice.lines?.data?.length > 0) {
        productNames = invoice.lines.data.map(line => line.description).join(', ');
        totalItems = invoice.lines.data.reduce((acc, line) => acc + (line.quantity || 0), 0);
      }

      const salePayload = {
        date: new Date().toISOString(),
        order_number: orderNumber,
        status: 'Completed',
        customer: String(customerName),
        customer_type: 'Registered',
        products: String(productNames),
        items_sold: Number(totalItems) || 1,
        coupons: '-',
        net_sales: Number(netSales) || 0,
        attribution: attributionType
      };

      // Save record seamlessly to Firestore
      await db.collection('sales').add(salePayload);
      console.log(`Invoice synced: ✅ Payment captured for invoice #${orderNumber}`);

      // Email customer invoice receipt statement via Resend
      const resend = getResendClient();
      if (customerEmail && resend) {
        await resend.emails.send({
          from: 'Indeva Websites <web@indevasa.com>',
          to: customerEmail,
          subject: isRenewal 
            ? `Your Subscription Renewal Invoice #${orderNumber}`
            : `Your Receipt for Invoice #${orderNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #4F46E5; text-align: center;">Payment Processed Successfully</h2>
              <p>Hi ${customerName},</p>
              <p>We've successfully processed your invoice payment. Here are your transaction parameters:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;">Invoice Number</td>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: right;">#${orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;">Product / Service Plan</td>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: right;">${productNames}</td>
                </tr>
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;">Amount Processed</td>
                  <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: right; font-weight: bold; color: #10B981;">$${netSales.toFixed(2)} USD</td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #6B7280; text-align: center; margin-top: 30px;">
                Thank you for your business. If you have any questions, reply directly to this email.
              </p>
            </div>
          `,
        });
        console.log(`✉️ Invoice statement sent to ${customerEmail}`);
      }

    } catch (cycleError) {
      console.error('❌ Error processing automated invoice event webhook:', cycleError);
      return NextResponse.json({ error: 'Invoice webhook insertion failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}