import Stripe from 'stripe';
import type { HostingAccount } from './hostingUtils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-28' as any,
});

/**
 * Creates a dynamic Stripe Checkout Session specifically for a client's hosting renewal,
 * supporting their custom rate, custom domain, and attaching metadata for automatic webhook renewal.
 */
export async function createHostingRenewalCheckoutSession(
  account: HostingAccount,
  baseUrl: string = 'https://indevasa.com'
) {
  try {
    const origin = baseUrl.replace(/\/$/, '');
    const amountInCents = Math.max(Math.round(Number(account.amount || 86) * 100), 50); // Minimum 50 cents for Stripe

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${account.planName || 'Webhosting Annual Subscription'} (${account.domain})`,
              description: `Annual web hosting renewal for ${account.domain}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: account.customerEmail && account.customerEmail.includes('@') ? account.customerEmail : undefined,
      metadata: {
        type: 'hosting_renewal',
        hosting_id: account.id,
        domain: account.domain,
        customer_name: account.customerName,
        customer_email: account.customerEmail || '',
        plan_name: account.planName,
        renewal_amount: String(account.amount),
      },
      invoice_creation: {
        enabled: true,
      },
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&renewal=true`,
      cancel_url: `${origin}`,
    });

    return {
      success: true,
      url: session.url,
      sessionId: session.id,
    };
  } catch (error: any) {
    console.error('Error creating Stripe renewal checkout session:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate Stripe checkout session.',
    };
  }
}
