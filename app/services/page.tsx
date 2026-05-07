import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Solutions
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Outcome-based digital growth for businesses that want fewer headaches and more sales.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="bg-white space-y-6 rounded-3xl border border-gray-200 p-8 shadow-sm">
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

        <div className="bg-white space-y-6 rounded-3xl border border-gray-200 p-8 shadow-sm">
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

        <div className="bg-white space-y-6 rounded-3xl border border-gray-200 p-8 shadow-sm">
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
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FA8F27] hover:bg-orange-600 md:text-lg"
          >
            Book A Strategy Call
          </Link>
        </div>
      </div>
    </div>
  );
}
