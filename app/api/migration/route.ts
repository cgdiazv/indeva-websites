import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any, // Matches your active Stripe workspace version
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔄 Initiating historical data migration sequence...');
    let totalImported = 0;
    let hasMore = true;
    let startingAfterId: string | undefined = undefined;

    // 1. Loop through your Stripe history using pagination
    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
        limit: 100, // Maximum allowed per API request
        status: 'complete',
        starting_after: startingAfterId,
      });

      if (response.data.length === 0) {
        break;
      }

      console.log(`📦 Fetched a batch of ${response.data.length} historical checkout records...`);

      // 2. Process each historical checkout item matching your dashboard columns
      for (const session of response.data) {
        let productNames = 'Subscription Plan';
        let totalItems = 1;

        // Try parsing line items for each session safely
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          if (lineItems && lineItems.data.length > 0) {
            productNames = lineItems.data.map(item => item.description).join(', ');
            totalItems = lineItems.data.reduce((acc, item) => acc + (item.quantity || 0), 0);
          }
        } catch (e) {
          // If line items aren't fetchable (expired), fallback gracefully
        }

        // Fetch formatted invoice receipt numbers if available
        let orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
        if (session.invoice) {
          try {
            const invoiceDetails = await stripe.invoices.retrieve(session.invoice as string);
            if (invoiceDetails.number) orderNumber = invoiceDetails.number;
          } catch (invErr) {
            orderNumber = session.invoice.toString();
          }
        } else if (session.id) {
          orderNumber = session.id.replace('cs_live_', 'CH_');
        }

        const customerName = session.customer_details?.name || 'Unknown Customer';
        const netSales = (session.amount_total || 0) / 100;
        const attribution = session.metadata?.utm_source || 'Direct';

        // Check if coupons were used
        let couponApplied = '-';
        const totalDetails = session.total_details as any;
        if (totalDetails?.breakdown?.discounts?.length > 0) {
          couponApplied = totalDetails.breakdown.discounts[0]?.discount?.coupon?.id || '-';
        }

        const salePayload = {
          date: new Date(session.created * 1000).toISOString(), // Converts Stripe UNIX timestamp to ISO
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

        // 3. Save into your existing Firestore 'sales' collection
        await db.collection('sales').add(salePayload);
        totalImported++;
      }

      // Handle pagination tracking markers
      const lastElement = response.data[response.data.length - 1];
      startingAfterId = lastElement.id;
      hasMore = response.has_more;
    }

    console.log(`🏁 Success! Backfilled ${totalImported} old records into Firestore.`);
    return NextResponse.json({ success: true, message: `Successfully imported ${totalImported} transactions.` });

  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}