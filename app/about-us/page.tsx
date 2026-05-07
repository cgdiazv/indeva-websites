export default function AboutUsPage() {
  return (
    <main className="bg-gray-50 min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="p-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
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
              className="w-full max-w-4xl rounded-3xl shadow-xl"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-10 shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Core Values
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          </div>

          <div className="mt-12 space-y-12 text-gray-700">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">1. Built For Longevity</h3>
              <p className="mt-3 text-base leading-8 text-gray-600">
                We don’t believe in temporary fixes or disposable design. Our philosophy is rooted in “Future-Proofing”, combining robust software engineering with timeless aesthetics to create digital assets that grow alongside your organization.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">2. Lean Thinking, Continuous Improvement</h3>
              <p className="mt-3 text-base leading-8 text-gray-600">
                With a foundation in Lean methodology and process management, we bring industrial-grade precision to the creative world. We are committed to a culture of “Kaizen,” constantly refining our workflows to deliver maximum value with zero waste.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">3. Avant-Garde Innovation</h3>
              <p className="mt-3 text-base leading-8 text-gray-600">
                We balance bold, forward-thinking design with strict technical standards. By merging “avant-garde” creativity with WCAG accessibility, we ensure your digital presence is not only visually stunning but inclusive and high-performing for every user.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">4. Strategic Partnership</h3>
              <p className="mt-3 text-base leading-8 text-gray-600">
                We are more than a service provider; we are your digital allies. We prioritize understanding your unique goals and challenges before we ever write a line of code, empowering you with the confidence and control to manage your digital future.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">5. Data-Driven Integrity</h3>
              <p className="mt-3 text-base leading-8 text-gray-600">
                We replace guesswork with insight. Every strategy we deploy is backed by measurable data, ensuring that our marketing efforts and design choices are rooted in reality and designed to deliver tangible results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
