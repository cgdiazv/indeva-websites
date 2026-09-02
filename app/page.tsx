export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-100 text-slate-900 py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none"
          style={{ backgroundImage: "url('/hero_bg.jpg')" }}
        />
        {/* Soft edge fade overlay for seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-50/90 pointer-events-none" />

        {/* Subtle Background Glow Elements */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[25rem] bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-100/50 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FA8F27]/10 border border-[#FA8F27]/30 text-xs font-bold text-[#FA8F27] mb-8 shadow-2xs">
            Enterprise Web Development Agency
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-6xl md:text-7xl leading-[1.15]">
            Stop Losing Customers to a <span className="text-[#FA8F27]">Slow, Outdated Website.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            We build high-performance digital sales engines that turn silent visitors into high-value leads. Precision-engineered for Houston businesses that are ready to scale.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/book-free-audit"
              className="px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-[#FA8F27] hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 md:text-lg"
            >
              Get My Free Growth Audit
            </a>
          </div>
        </div>
      </div>

      {/* Problem Agitation Section */}
      <section className="w-full bg-white py-24 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16 tracking-tight">
            Is Your Website An Asset Or A Liability?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#FA8F27]/50 transition-all duration-300 group">
              <div className="w-full h-52 overflow-hidden bg-slate-50">
                <img
                  src="/invisible_seo_minimal.jpg"
                  alt="Invisible Website Concept"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col items-center text-center flex-1 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#FA8F27] mb-3">Invisible</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    You're on page 4 of Google while your competitors take your leads.
                  </p>
                </div>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#FA8F27]/50 transition-all duration-300 group">
              <div className="w-full h-52 overflow-hidden bg-slate-50">
                <img
                  src="/leaky_funnel_minimal.jpg"
                  alt="Leaky Funnel Concept"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col items-center text-center flex-1 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#FA8F27] mb-3">Leaky</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    You get traffic, but your "Contact Us" form is a ghost town.
                  </p>
                </div>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#FA8F27]/50 transition-all duration-300 group">
              <div className="w-full h-52 overflow-hidden bg-slate-50">
                <img
                  src="/slow_speed_minimal.jpg"
                  alt="Slow Website Concept"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col items-center text-center flex-1 justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#FA8F27] mb-3">Slow</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    40% of users leave if a site takes over 3 seconds to load. You're paying for clicks you're losing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="w-full bg-slate-50 py-24 border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Built with Industrial Precision, Designed for Explosive Growth
          </h2>
          <div className="mx-auto mb-8 h-1.5 w-24 rounded-full bg-[#FA8F27]" />
          <p className="mx-auto max-w-3xl text-lg text-slate-600 leading-relaxed font-normal">
            With 25 years of experience and a foundation in <strong>Lean/Kaizen principles</strong>, we don’t just ‘design’, we optimize. We eliminate digital waste to ensure every pixel on your site serves one purpose: <strong>Generating Revenue.</strong>
          </p>
          <div className="mt-14 flex justify-center">
            <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl bg-white max-w-5xl w-full">
              <img
                src="/step_method_minimal.jpg"
                alt="3 Step Method"
                className="w-full h-auto object-cover block mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Solutions Section */}
      <section className="w-full bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Impact. Built for Scale.
          </h2>
          <div className="mx-auto mt-4 mb-6 h-1.5 w-24 rounded-full bg-[#FA8F27]" />
          <p className="mx-auto max-w-2xl text-lg text-slate-600 font-normal">
            We don't sell generic templates or count pages. We build high-yield digital infrastructure tailored to your business metrics.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto text-left">
            {/* Solution 1 - Corporate/Lead Gen */}
            <div className="rounded-3xl border border-slate-200/90 hover:border-[#FA8F27] transition-all bg-white shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden group">
              <div>
                <div className="w-full h-56 overflow-hidden bg-slate-50">
                  <img
                    src="/lead_engine_minimal.jpg"
                    alt="The B2B Lead Engine"
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">The B2B Lead Engine</h3>
                  <p className="text-sm text-slate-500 text-center mb-6">Best for mid-sized service, logistics, and manufacturing firms.</p>
                  <ul className="space-y-3 text-slate-600 list-disc list-inside border-t border-slate-100 pt-6 text-sm leading-relaxed">
                    <li><strong>Complete Infrastructure Overhaul:</strong> Migration from vulnerable legacy platforms to next-generation serverless architecture.</li>
                    <li><strong>Sub-Second Loading Speed:</strong> Optimized Core Web Vitals to maximize ad spend ROI and organic Google ranking.</li>
                    <li><strong>Lean Funnel Engineering:</strong> Custom lead capture flows designed to turn passive corporate traffic into qualified inquiries.</li>
                    <li><strong>Bulletproof Security:</strong> Disconnected frontend execution ensuring zero public database exposure.</li>
                  </ul>
                </div>
              </div>
              <div className="px-8 pb-8">
                <a
                  href="/book-free-audit"
                  className="block text-center w-full py-3.5 font-semibold text-white bg-[#FA8F27] hover:bg-orange-600 rounded-xl transition-all shadow-md"
                >
                  Analyze My Project
                </a>
              </div>
            </div>

            {/* Solution 2 - E-commerce/Advanced */}
            <div className="rounded-3xl border-2 border-[#FA8F27] bg-white shadow-md hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
              <span className="absolute top-4 right-4 z-10 bg-[#FA8F27] text-white px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                High Performance
              </span>
              <div>
                <div className="w-full h-56 overflow-hidden bg-slate-50">
                  <img
                    src="/enterprise_platform_minimal.jpg"
                    alt="Headless Commerce & Platforms"
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Enterprise Custom Platform</h3>
                  <p className="text-sm text-slate-500 text-center mb-6">Best for complex catalogs, headless e-commerce, or custom workflows.</p>
                  <ul className="space-y-3 text-slate-600 list-disc list-inside border-t border-slate-100 pt-6 text-sm leading-relaxed">
                    <li><strong>Decoupled Architecture:</strong> Complete separation of your inventory database from the user experience for maximum speed.</li>
                    <li><strong>Infinite Scalability:</strong> Cloud-native hosting infrastructure built to handle massive traffic spikes without slowdowns.</li>
                    <li><strong>ERP & API Integrations:</strong> Seamless dynamic sync with your internal inventory, CRM, or order management software.</li>
                    <li><strong>Advanced UI/UX Components:</strong> Tailored interactive product filters, fast checkouts, and custom dashboard engineering.</li>
                  </ul>
                </div>
              </div>
              <div className="px-8 pb-8">
                <a
                  href="/book-free-audit"
                  className="block text-center w-full py-3.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md"
                >
                  Request Custom Scope
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}