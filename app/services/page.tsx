import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Our Solutions
        </h1>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Outcome-based digital growth for businesses that want fewer headaches and more sales.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="space-y-6 rounded-3xl border border-gray-200 p-8 shadow-sm">
          <div className="flex justify-center">
            <img src="/authority_builder.webp" alt="The Authority Builder" className="h-24 w-24 object-contain" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center">The Authority Builder</h2>
          <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
            <li>Professional 5-page sites.</li>
            <li>Ideal for firms that want to present a strong professional image.</li>
            <li>Establishes credibility and trust.</li>
            <li>SEO-ready structure.</li>
          </ul>
        </div>

        <div className="space-y-6 rounded-3xl border border-gray-200 p-8 shadow-sm">
          <div className="flex justify-center">
            <img src="/lead_machine.webp" alt="The Lead Machine" className="h-24 w-24 object-contain" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center">The Lead Machine</h2>
          <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
            <li>High-conversion landing pages.</li>
            <li>SEO for service businesses.</li>
            <li>Direct form submissions and calls.</li>
            <li>Maximum ROI and lead generation.</li>
          </ul>
        </div>

        <div className="space-y-6 rounded-3xl border border-gray-200 p-8 shadow-sm">
          <div className="flex justify-center">
            <img src="/growth_partner.webp" alt="The Growth Partner" className="h-24 w-24 object-contain" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center">The Growth Partner</h2>
          <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
            <li>Monthly optimization and AB testing.</li>
            <li>Security and malware protection.</li>
            <li>Performance monitoring.</li>
            <li>Predictable growth and scaling.</li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/book-free-audit"
          className="inline-flex items-center justify-center rounded-full bg-[#FA8F27] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_50px_-20px_rgba(250,143,39,0.8)] transition hover:bg-orange-600"
        >
          Book A Strategy Call
        </Link>
      </div>
    </div>
  );
}
