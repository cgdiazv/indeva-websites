export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
          Digital Excellence with <span className="text-blue-600">Indeva Websites</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Delivering precision-engineered web design, high-performance hosting, and scalable reseller services since 2009.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a href="/services" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg">
            Our Services
          </a>
          <a href="/contact" className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-lg">
            Get in Touch
          </a>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Feature 1 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Web Design</h3>
          <p className="text-gray-600">Custom, responsive interfaces built for optimal performance and user experience.</p>
        </div>
        {/* Feature 2 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Web Hosting</h3>
          <p className="text-gray-600">Secure, high-uptime server environments tailored to keep your operations running smoothly.</p>
        </div>
        {/* Feature 3 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Reseller Services</h3>
          <p className="text-gray-600">Scalable backend solutions to help you manage and grow your own client portfolio efficiently.</p>
        </div>
      </div>
    </div>
  )
}