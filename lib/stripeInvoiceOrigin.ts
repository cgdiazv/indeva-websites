import type Stripe from 'stripe';

export async function isHostingCheckoutInvoice(stripe: Stripe, invoice: Stripe.Invoice): Promise<boolean> {
  if (invoice.metadata?.type === 'hosting_renewal_checkout') return true;
  if (invoice.billing_reason !== 'manual') return false;

  for await (const payment of stripe.invoicePayments.list({ invoice: invoice.id, status: 'paid', limit: 100 })) {
    const intent = payment.payment.payment_intent;
    if (!intent) continue;
    const paymentIntentId = typeof intent === 'string' ? intent : intent.id;
    for await (const session of stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 100 })) {
      if (session.metadata?.type === 'hosting_renewal') return true;
    }
  }
  return false;
}
