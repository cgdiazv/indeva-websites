export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
            Stop Losing Customers to a <span className="text-[#FA8F27]">Slow, Outdated Website.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            We build high-performance digital sales engines that turn silent visitors into high-value leads. Precision-engineered for Houston businesses that are ready to scale.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="/book-free-audit" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FA8F27] hover:bg-orange-600 md:text-lg">
              Get My Free Growth Audit
            </a>
          </div>
        </div>
      </div>

      {/* Problem Agitation Section */}
      <section className="w-full bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Is Your Website An Asset Or A Liability?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Problem 1 */}
            <div className="flex flex-col items-center">
              <img src="/invisible.webp" alt="Invisible Website Concept" className="h-40 object-contain mb-6" />
              <h3 className="text-2xl font-bold text-[#FA8F27] mb-4">Invisible</h3>
              <p className="text-gray-600">You're on page 4 of Google while your competitors take your leads.</p>
            </div>

            {/* Problem 2 */}
            <div className="flex flex-col items-center">
              <img src="/leaky.webp" alt="Leaky Funnel Concept" className="h-40 object-contain mb-6" />
              <h3 className="text-2xl font-bold text-[#FA8F27] mb-4">Leaky</h3>
              <p className="text-gray-600">You get traffic, but your "Contact Us" form is a ghost town.</p>
            </div>

            {/* Problem 3 */}
            <div className="flex flex-col items-center">
              <img src="/slow.webp" alt="Slow Website Concept" className="h-40 object-contain mb-6" />
              <h3 className="text-2xl font-bold text-[#FA8F27] mb-4">Slow</h3>
              <p className="text-gray-600">40% of users leave if a site takes over 3 seconds to load. You're paying for clicks you're losing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="w-full bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built with Industrial Precision, Designed for Explosive Growth
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            With 25 years of experience and a foundation in <strong>Lean/Kaizen principles</strong>, we don’t just ‘design’, we optimize. We eliminate digital waste to ensure every pixel on your site serves one purpose: <strong>Generating Revenue.</strong>
          </p>
          <div className="mt-12 flex justify-center">
            <img
              src="/3-step-method.webp"
              alt="3 Step Method"
              className="w-full max-w-4xl rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Our Solutions Section */}
      <section className="w-full bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Solutions
          </h2>
          <div className="mx-auto mt-4 mb-6 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Outcome-based digital growth for businesses that want fewer headaches and more sales.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            <div className="space-y-6 rounded-3xl border border-gray-200 p-8">
              <div className="flex justify-center">
                <img src="/authority_builder.webp" alt="The Authority Builder" className="h-24 w-24 object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">The Authority Builder</h3>
              <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
                <li>Professional 5-page sites.</li>
                <li>Ideal for firms that want to present a strong professional image.</li>
                <li>Establishes credibility and trust.</li>
                <li>SEO-ready structure.</li>
              </ul>
            </div>

            <div className="space-y-6 rounded-3xl border border-gray-200 p-8">
              <div className="flex justify-center">
                <img src="/lead_machine.webp" alt="The Lead Machine" className="h-24 w-24 object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">The Lead Machine</h3>
              <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
                <li>High-conversion landing pages.</li>
                <li>SEO for service businesses.</li>
                <li>Direct form submissions and calls.</li>
                <li>Maximum ROI and lead generation.</li>
              </ul>
            </div>

            <div className="space-y-6 rounded-3xl border border-gray-200 p-8">
              <div className="flex justify-center">
                <img src="/growth_partner.webp" alt="The Growth Partner" className="h-24 w-24 object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">The Growth Partner</h3>
              <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
                <li>Monthly optimization and AB testing.</li>
                <li>Security and malware protection.</li>
                <li>Performance monitoring.</li>
                <li>Predictable growth and scaling.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}