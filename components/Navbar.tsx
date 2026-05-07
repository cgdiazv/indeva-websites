import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[#FA8F27]">
              Indeva Websites
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Home</Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Services</Link>
            <Link href="/hosting" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Hosting</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}