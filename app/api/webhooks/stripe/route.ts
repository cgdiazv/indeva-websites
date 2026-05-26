import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebaseAdmin';

// Initialize Stripe with your private Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-28' as any, // Forces the type checker to accept the version override
});

// Grab your Webhook Secret from the Stripe Dashboard to verify requests
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  console.log("🚀 Webhook hit! Type received:", JSON.parse(body)?.type); 
  console.log("🔑 Signature exists:", !!sig, "Secret configured:", !!endpointSecret);

  let event: Stripe.Event;

  // 1. Security Check: Verify the request genuinely came from Stripe
  try {
    if (!sig) throw new Error('Missing stripe-signature header');
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. Handle the specific successful payment event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Fetch line items to get the products and quantities sold
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      const productNames = lineItems.data.map(item => item.description).join(', ');
      const totalItems = lineItems.data.reduce((acc, item) => acc + (item.quantity || 0), 0);

      // Extract details or fall back to metadata options
      const customerName = session.customer_details?.name || 'Unknown Customer';
      const customerEmail = session.customer_details?.email || '';
      
      // Calculate net sales (Stripe sends amounts in cents, so we divide by 100)
      const netSales = (session.amount_total || 0) / 100;

      // Extract coupon codes if applied
      // Extract coupon codes if applied safely
      const totalDetails = session.total_details;
      const breakdown = (totalDetails as any)?.breakdown;
      const discountObj = breakdown?.discounts?.[0];
      const couponApplied = (discountObj as any)?.discount?.coupon?.id || '-';

      // Gather traffic attribution markers from your checkout session metadata metadata
      const attribution = session.metadata?.utm_source || 'Direct';

      // 3. Map values to your 10 Dashboard Columns safely
      const salePayload = {
        date: new Date().toISOString(),                       // Column 1: Date
        order_number: session.invoice?.toString() || Math.floor(100000 + Math.random() * 900000).toString(), // Column 2: Order #
        status: session.payment_status === 'paid' ? 'Completed' : 'Pending', // Column 3: Status
        customer: session.customer_details?.name || 'Unknown Customer',       // Column 4: Customer
        customer_type: session.customer ? 'Registered' : 'Guest', // Column 5: Customer Type
        products: productNames || 'Subscription Plan',         // Column 6: Product(s)
        items_sold: Number(totalItems) || 1,                  // Column 7: Items Sold
        coupons: String(couponApplied),                        // Column 8: Coupon(s)
        net_sales: Number(netSales) || 0,                     // Column 9: Net Sales
        attribution: String(attribution)                      // Column 10: Attribution
      };

      // 4. Save seamlessly to Firestore
      await db.collection('sales').add(salePayload);
      console.log(`✅ Sale successfully logged to Firebase for order #${salePayload.order_number}`);

    } catch (dbError) {
      console.error('❌ Error processing or saving checkout data to Firebase:', dbError);
      return NextResponse.json({ error: 'Database insertion failed' }, { status: 500 });
    }
  }

  // Return a 200 response to Stripe to let them know we received the event safely
  return NextResponse.json({ received: true }, { status: 200 });
}