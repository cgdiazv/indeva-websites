import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebaseAdmin';
import { recordStripeSale } from '@/lib/stripeSale';
import { isHostingCheckoutInvoice } from '@/lib/stripeInvoiceOrigin';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-10-28' as NonNullable<ConstructorParameters<typeof Stripe>[1]>['apiVersion'],
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
    if (!endpointSecret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown signature verification error';
    console.error(`❌ Webhook signature verification failed:`, message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
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
          productNames = lineItems.data.map(item => item.description).filter(Boolean).join(', ');
          totalItems = lineItems.data.reduce((acc, item) => acc + (item.quantity || 0), 0);
        }
      } catch (lineError) {
        console.error('ℹ️ Could not pull standard line items, using mode default:', lineError);
      }

      const invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice?.id;
      const stripeReference = invoiceId || session.id;
      const customerName = session.customer_details?.name || 'Unknown Customer';
      const customerEmail = session.customer_details?.email;
      const netSales = (session.amount_total || 0) / 100;
      const discount = session.total_details?.breakdown?.discounts?.[0]?.discount;
      const coupon = discount && 'coupon' in discount ? discount.coupon : undefined;
      const couponApplied = typeof coupon === 'object' && coupon && 'id' in coupon
        ? String(coupon.id) : '-';
      const isHostingRenewal = session.metadata?.type === 'hosting_renewal';
      if (isHostingRenewal && !session.metadata?.hosting_id) {
        throw new Error(`Hosting renewal session ${session.id} has no hosting account ID`);
      }

      const salePayload = {
        date: new Date().toISOString(),
        status: session.payment_status === 'paid' ? 'Completed' : 'Pending',
        customer: String(customerName),
        customer_type: session.customer ? 'Registered' : 'Guest',
        products: String(productNames || 'Subscription Plan'),
        items_sold: Number(totalItems) || 1,
        coupons: String(couponApplied),
        net_sales: Number(netSales) || 0,
        attribution: isHostingRenewal ? 'Hosting Renewal' : (session.metadata?.utm_source || 'Direct'),
        stripe_reference: stripeReference,
      };
      const { orderNumber, created } = await recordStripeSale(
        db,
        [session.id, ...(invoiceId ? [invoiceId] : [])],
        salePayload,
        isHostingRenewal && session.payment_status === 'paid' ? session.metadata?.hosting_id : undefined
      );

      if (!created) {
        console.log(`ℹ️ Sale already recorded for session ${session.id} (ref: ${stripeReference}), skipping duplicate sale insertion.`);
      } else {
        console.log(`Base synced: ✅ Sale successfully logged to Firebase for order #${orderNumber}`);

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
      }

    } catch (dbError) {
      console.error('❌ Error processing or saving data:', dbError);
      return NextResponse.json({ error: 'Database insertion failed' }, { status: 500 });
    }
  }

  // 3. Handle ALL successful invoice payments (invoice.payment_succeeded and invoice.paid)
  if (event.type === 'invoice.payment_succeeded' || event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;

    try {
      if (await isHostingCheckoutInvoice(stripe, invoice)) {
        console.log(`ℹ️ Invoice ${invoice.id} belongs to a hosting checkout; the checkout records the sale.`);
        return NextResponse.json({ received: true, message: 'Hosting checkout invoice' });
      }

      const stripeReference = invoice.number || invoice.id || '-';
      const customerName = invoice.customer_name || invoice.customer_email || 'Subscription Customer';
      const customerEmail = invoice.customer_email;
      const netSales = (invoice.amount_paid || 0) / 100;
      
      // Dynamically label the attribution type based on the invoice context reason
      const isRenewal = invoice.billing_reason === 'subscription_cycle';
      const attributionType = isRenewal 
        ? 'Subscription Renewal' 
        : (invoice.billing_reason === 'manual' ? 'Manual Invoice' : (invoice.billing_reason || 'Manual Invoice'));

      // Map line items from the invoice object
      let productNames = 'Service Plan Purchase';
      let totalItems = 0;
      if (invoice.lines?.data?.length > 0) {
        const descriptions = invoice.lines.data.map(line => line.description).filter(Boolean);
        if (descriptions.length > 0) {
          productNames = descriptions.join(', ');
        }
        totalItems = invoice.lines.data.reduce((acc, line) => acc + (line.quantity || 0), 0);
      }

      const paymentDate = invoice.status_transitions?.paid_at 
        ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        : (invoice.created ? new Date(invoice.created * 1000).toISOString() : new Date().toISOString());

      const salePayload = {
        date: paymentDate,
        status: 'Completed',
        customer: String(customerName),
        customer_type: 'Registered',
        products: String(productNames),
        items_sold: Number(totalItems) || 1,
        coupons: '-',
        net_sales: Number(netSales) || 0,
        attribution: attributionType,
        stripe_reference: String(stripeReference),
      };

      const { orderNumber, created } = await recordStripeSale(
        db, [invoice.id, ...(invoice.number ? [invoice.number] : [])], salePayload
      );
      if (!created) {
        console.log(`ℹ️ Sale already exists for invoice ${invoice.id} (${invoice.number}), skipping duplicate.`);
        return NextResponse.json({ received: true, message: 'Already processed' });
      }
      console.log(`Invoice synced: ✅ Payment captured for invoice #${orderNumber} (${stripeReference})`);

      // Email customer invoice receipt statement via Resend
      const resend = getResendClient();
      if (customerEmail && resend) {
        await resend.emails.send({
          from: 'Indeva Websites <web@indevasa.com>',
          to: customerEmail,
          subject: isRenewal 
            ? `Your Subscription Renewal Order #${orderNumber}`
            : `Your Receipt for Order #${orderNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #4F46E5; text-align: center;">Payment Processed Successfully</h2>
              <p>Hi ${customerName},</p>
              <p>We've successfully processed your payment. Here are your transaction details:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;">Order Number</td>
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