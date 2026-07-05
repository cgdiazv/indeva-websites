import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Engineered for Impact. Built for Scale.
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            We don't sell generic templates or count pages. We build high-yield digital infrastructure tailored to your business metrics.
          </p>
        </div>

        {/* Services Core Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          
          {/* Solution 1 - The B2B Lead Engine */}
          <div className="bg-white space-y-6 rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col justify-between hover:border-[#FA8F27]/50 transition-all duration-300">
            <div>
              <div className="flex justify-center mb-4">
                <img src="/lead_machine.webp" alt="The B2B Lead Engine" className="h-20 w-24 object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">The B2B Lead Engine</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Engineered for mid-sized service, logistics, and manufacturing firms ready to scale sales operations.</p>
              
              <ul className="mt-6 space-y-4 text-gray-600 border-t border-gray-100 pt-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>Infrastructure Overhaul:</strong> Complete migration from slow, vulnerable legacy monoliths to serverless architecture.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>Sub-Second Loading Times:</strong> Fine-tuned Core Web Vitals designed to plug traffic leaks and maximize marketing spend ROI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>Lean Conversion Funnels:</strong> Precision lead-capture mechanics built to turn cold technical prospects into high-value clients.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>Decoupled Form Security:</strong> Hardened endpoints ensuring internal submission funnels are completely immune to data interception.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/book-free-audit"
                className="block text-center w-full py-3 font-semibold text-[#FA8F27] border border-[#FA8F27] rounded-xl hover:bg-orange-50 transition-colors"
              >
                Analyze Project Fit
              </Link>
            </div>
          </div>

          {/* Solution 2 - Enterprise Custom Platform (Premium Focus) */}
          <div className="bg-white space-y-6 rounded-3xl border-2 border-[#FA8F27] p-8 shadow-md flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#FA8F27] text-white px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
              High Performance
            </span>
            
            <div>
              <div className="flex justify-center mb-4 mt-2">
                <img src="/authority_builder.webp" alt="Enterprise Custom Platform" className="h-20 w-24 object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Enterprise Custom Platform</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Tailored solutions for businesses requiring complex catalogs, headless e-commerce, or advanced system integrations.</p>
              
              <ul className="mt-6 space-y-4 text-gray-600 border-t border-gray-100 pt-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>Headless & Decoupled Architecture:</strong> Complete backend detachment for maximum UI control, military-grade isolation, and flawless UX.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>ERP, CRM & API Integrations:</strong> Dynamic, fast synchronization pipelines built for automated inventory, bookings, or internal operations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>Cloud-Native Scalability:</strong> Elastic global distribution structure ready to process intense traffic spikes without ever breaking or dropping sessions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FA8F27] font-bold">✓</span>
                  <span><strong>Advanced Interactive Components:</strong> Tailored pricing engines, proprietary logic flows, and premium customized client portals.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/book-free-audit"
                className="block text-center w-full py-3 font-semibold text-white bg-[#FA8F27] rounded-xl hover:bg-orange-600 shadow-md shadow-orange-500/10 transition-colors"
              >
                Request Custom Scope
              </Link>
            </div>
          </div>

        </div>

        {/* Main Bottom Call To Action */}
        <div className="mt-24 flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Stop settling for standard, bloated templates.</h3>
          <p className="text-gray-600 text-sm mb-6">Every digital deployment we run is custom-scoped using Lean principles to root out waste and enforce performance metrics.</p>
          <Link
            href="/book-free-audit"
            className="px-10 py-4 font-semibold text-white bg-gray-950 hover:bg-gray-800 rounded-xl text-lg shadow-lg shadow-gray-950/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Book My Free Growth Audit
          </Link>
        </div>

      </div>
    </div>
  );
}