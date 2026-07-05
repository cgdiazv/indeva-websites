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
              className="w-full max-w-4xl"
            />
          </div>
        </div>
      </section>

      {/* Our Solutions Section */}
<section className="w-full bg-white py-24">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
      Engineered for Impact. Built for Scale.
    </h2>
    <div className="mx-auto mt-4 mb-6 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
    <p className="mx-auto max-w-2xl text-lg text-gray-600">
      We don't sell generic templates or count pages. We build high-yield digital infrastructure tailored to your business metrics.
    </p>

    <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto text-left">
      
      {/* Solution 1 - Corporate/Lead Gen */}
      <div className="space-y-6 rounded-3xl border border-gray-200 p-8 hover:border-[#FA8F27] transition-all bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-center mb-6">
            <img src="/lead_machine.webp" alt="The B2B Lead Engine" className="h-20 w-24 object-contain" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">The B2B Lead Engine</h3>
          <p className="text-sm text-gray-500 text-center mb-6">Best for mid-sized service, logistics, and manufacturing firms.</p>
          <ul className="space-y-3 text-gray-600 list-disc list-inside border-t border-gray-100 pt-6">
            <li><strong>Complete Infrastructure Overhaul:</strong> Migration from vulnerable legacy platforms to next-generation serverless architecture.</li>
            <li><strong>Sub-Second Loading Speed:</strong> Optimized Core Web Vitals to maximize ad spend ROI and organic Google ranking.</li>
            <li><strong>Lean Funnel Engineering:</strong> Custom lead capture flows designed to turn passive corporate traffic into qualified inquiries.</li>
            <li><strong>Bulletproof Security:</strong> Disconnected frontend execution ensuring zero public database exposure.</li>
          </ul>
        </div>
        <div className="pt-6">
          <a href="/book-free-audit" className="block text-center w-full py-3 font-semibold text-white bg-[#FA8F27] rounded-xl hover:bg-orange-600 transition-colors">
            Analyze My Project
          </a>
        </div>
      </div>

      {/* Solution 2 - E-commerce/Advanced */}
      <div className="space-y-6 rounded-3xl border-2 border-[#FA8F27] p-8 bg-white shadow-md flex flex-col justify-between relative">
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#FA8F27] text-white px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
          High Performance
        </span>
        <div>
          <div className="flex justify-center mb-6 mt-2">
            <img src="/authority_builder.webp" alt="Headless Commerce & Platforms" className="h-20 w-24 object-contain" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Enterprise Custom Platform</h3>
          <p className="text-sm text-gray-500 text-center mb-6">Best for complex catalogs, headless e-commerce, or custom workflows.</p>
          <ul className="space-y-3 text-gray-600 list-disc list-inside border-t border-gray-100 pt-6">
            <li><strong>Decoupled Architecture:</strong> Complete separation of your inventory database from the user experience for maximum speed.</li>
            <li><strong>Infinite Scalability:</strong> Cloud-native hosting infrastructure built to handle massive traffic spikes without slowdowns.</li>
            <li><strong>ERP & API Integrations:</strong> Seamless dynamic sync with your internal inventory, CRM, or order management software.</li>
            <li><strong>Advanced UI/UX Components:</strong> Tailored interactive product filters, fast checkouts, and custom dashboard engineering.</li>
          </ul>
        </div>
        <div className="pt-6">
          <a href="/book-free-audit" className="block text-center w-full py-3 font-semibold text-white bg-gray-950 rounded-xl hover:bg-gray-800 transition-colors">
            Request Custom Scope
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
    </>
  )
}