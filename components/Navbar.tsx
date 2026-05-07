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
            <Link href="/about-us" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">About Us</Link>
            <Link href="/services" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Services</Link>
            <Link href="/portfolio" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Portfolio</Link>
            <Link href="/#contacto" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Contact</Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Blog</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}