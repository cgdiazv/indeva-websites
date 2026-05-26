import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-28' as any,
});

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

  // 2. Handle successful payment
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

      // Extract metadata fallback cleanly
      const customerName = session.customer_details?.name || 'Unknown Customer';
      const netSales = (session.amount_total || 0) / 100;

      // Extract coupon codes if applied safely
      let couponApplied = '-';
      const totalDetails = session.total_details as any;
      if (totalDetails?.breakdown?.discounts?.length > 0) {
        couponApplied = totalDetails.breakdown.discounts[0]?.discount?.coupon?.id || '-';
      }

      // Gather traffic attribution markers safely
      const attribution = session.metadata?.utm_source || 'Direct';

      // 3. Map values safely to your 10 Dashboard Columns (Guaranteed no undefined values)
      const salePayload = {
        date: new Date().toISOString(),
        order_number: session.invoice?.toString() || Math.floor(100000 + Math.random() * 900000).toString(),
        status: session.payment_status === 'paid' ? 'Completed' : 'Pending',
        customer: String(customerName),
        customer_type: session.customer ? 'Registered' : 'Guest',
        products: String(productNames),
        items_sold: Number(totalItems) || 1,
        coupons: String(couponApplied),
        net_sales: Number(netSales) || 0,
        attribution: String(attribution)
      };

      // 4. Save seamlessly to Firestore
      await db.collection('sales').add(salePayload);
      console.log(`✅ Sale successfully logged to Firebase for order #${salePayload.order_number}`);

    } catch (dbError) {
      console.error('❌ Error processing or saving checkout data to Firebase:', dbError);
      return NextResponse.json({ error: 'Database insertion failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}