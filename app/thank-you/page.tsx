import Link from 'next/link';

export default function ThankYouPage() {
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
          <Link href="/" className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
            Back to Homepage
          </Link>
          <Link href="/book-free-audit" className="inline-flex items-center justify-center rounded-full bg-[#FA8F27] px-8 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">
            Book another audit
          </Link>
        </div>
      </div>
    </div>
  );
}
