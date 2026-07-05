export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="p-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight">
              Built with Industrial Precision, Designed for Explosive Growth
            </h1>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
              With 25 years of experience and a foundation in <strong>Lean/Kaizen principles</strong>, we don’t just ‘design’, we optimize. We eliminate digital waste to ensure every pixel on your site serves one purpose: <strong>Generating Revenue.</strong>
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <img
              src="/3-step-method.webp"
              alt="3 Step Method"
              className="w-full max-w-4xl"
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
  {/* Section Header */}
  <div className="text-center max-w-3xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
      Our Core Values
    </h2>
    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#FA8F27]"></div>
    <p className="mt-4 text-lg text-gray-650">
      The engineering principles and strategic thinking that drive every line of code we write.
    </p>
    
  </div>

  {/* Values Grid Container */}
  <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
    
    {/* Value 1 */}
    <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 flex flex-col justify-between">
      <div>
        <div className="text-4xl font-black text-gray-200 group-hover:text-orange-100 transition-colors duration-300">
          01
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#FA8F27] transition-colors duration-300">
          Built For Longevity
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We don’t believe in temporary fixes or disposable design. Our philosophy is rooted in “Future-Proofing”, combining robust software engineering with timeless aesthetics to create digital assets that grow alongside your organization.
        </p>
      </div>
    </div>

    {/* Value 2 */}
    <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 flex flex-col justify-between">
      <div>
        <div className="text-4xl font-black text-gray-200 group-hover:text-orange-100 transition-colors duration-300">
          02
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#FA8F27] transition-colors duration-300">
          Lean Thinking & Kaizen
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          With a foundation in Lean methodology and process management, we bring industrial-grade precision to the creative world. We are committed to a culture of constant refinement to deliver maximum value with zero waste.
        </p>
      </div>
    </div>

    {/* Value 3 */}
    <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 flex flex-col justify-between">
      <div>
        <div className="text-4xl font-black text-gray-200 group-hover:text-orange-100 transition-colors duration-300">
          03
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#FA8F27] transition-colors duration-300">
          Avant-Garde Innovation
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We balance bold, forward-thinking design with strict technical standards. By merging creative layouts with WCAG accessibility, we ensure your digital presence is inclusive and high-performing.
        </p>
      </div>
    </div>

    {/* Value 4 */}
    <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 flex flex-col justify-between">
      <div>
        <div className="text-4xl font-black text-gray-200 group-hover:text-orange-100 transition-colors duration-300">
          04
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#FA8F27] transition-colors duration-300">
          Strategic Partnership
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We are more than a service provider; we are your digital allies. We prioritize understanding your unique goals and operational challenges before we ever write a single line of code, empowering you with confidence.
        </p>
      </div>
    </div>

    {/* Value 5 */}
    <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
      <div>
        <div className="text-4xl font-black text-gray-200 group-hover:text-orange-100 transition-colors duration-300">
          05
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#FA8F27] transition-colors duration-300">
          Data-Driven Integrity
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We replace guesswork with insight. Every strategy we deploy is backed by measurable data metrics, ensuring that our technical architecture and marketing infrastructure choices are rooted in real-world results.
        </p>
      </div>
    </div>

  </div>
</div>
      </div>
    </main>
  )
}
