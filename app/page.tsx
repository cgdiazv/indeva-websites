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
    </>
  )
}