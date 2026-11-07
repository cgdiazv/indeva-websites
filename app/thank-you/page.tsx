import Link from 'next/link';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build');

type SearchParams = {
  renewal?: string | string[];
  session_id?: string | string[];
};

async function getRenewalStatus(sessionId: SearchParams['session_id']) {
  if (typeof sessionId !== 'string' || !/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) {
    return 'unavailable';
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.type !== 'hosting_renewal') return 'unavailable';
    return session.payment_status === 'paid' ? 'paid' : 'pending';
  } catch (error) {
    console.error('Unable to verify hosting renewal checkout session:', error);
    return 'unavailable';
  }
}

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  if (params.renewal === 'true') {
    const status = await getRenewalStatus(params.session_id);
    return (
      <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {status === 'paid' ? 'Thank You for Your Payment!' : 'Payment Confirmation Unavailable'}
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          {status === 'paid' ? (
            <p className="mt-8 text-gray-600 text-base sm:text-lg">
              Your hosting renewal payment has been received. Thank you for continuing to trust Indeva Websites.
            </p>
          ) : (
            <p className="mt-8 text-gray-600 text-base sm:text-lg">
              {status === 'pending'
                ? 'Your payment has not yet been confirmed.'
                : 'We could not verify your payment at this time.'}{' '}
              Please contact us if you need help confirming your hosting renewal. Do not pay again until it has been checked.
            </p>
          )}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
              Back to Homepage
            </Link>
            {status !== 'paid' && (
              <a href="mailto:web@indevasa.com" className="inline-flex items-center justify-center rounded-xl bg-[#FA8F27] px-8 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">
                Contact Us
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Success! Your Strategy Call Is Being Prepared.
        </h1>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
        <p className="mt-8 text-gray-600 text-base sm:text-lg">
          Thank you for reaching out. At Indevasa, we don’t just ‘build websites’, we engineer sales engines.
        </p>
        <p className="mt-4 text-gray-600 text-base sm:text-lg">
          We have received your details and are currently conducting a preliminary audit of your digital presence. Because we value <strong>precision and efficiency</strong>, we want to ensure our upcoming conversation is focused entirely on your ROI and growth.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
            Back to Homepage
          </Link>
          <Link href="/book-free-audit" className="inline-flex items-center justify-center rounded-xl bg-[#FA8F27] px-8 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">
            Book another audit
          </Link>
        </div>
      </div>
    </div>
  );
}
