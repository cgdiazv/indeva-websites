'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[#FA8F27]">
              Indeva Websites
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/about-us" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">About Us</Link>
            <Link href="/services" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Services</Link>
            <Link href="/portfolio" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Portfolio</Link>
            <Link href="/book-free-audit" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Contact</Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#FA8F27] px-3 py-2 rounded-md font-medium">Blog</Link>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDrawer} 
              className="text-gray-700 hover:text-[#FA8F27] focus:outline-none" 
              aria-label="Open mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dark Overlay (Click to close) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile Sliding Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <span className="text-xl font-bold text-[#FA8F27]">Menu</span>
          <button 
            onClick={closeDrawer} 
            className="text-gray-700 hover:text-[#FA8F27] focus:outline-none p-1" 
            aria-label="Close mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Links */}
        <div className="flex flex-col px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/about-us" onClick={closeDrawer} className="block text-gray-700 hover:text-[#FA8F27] hover:bg-orange-50 px-3 py-3 rounded-md text-lg font-medium transition-colors">About Us</Link>
          <Link href="/services" onClick={closeDrawer} className="block text-gray-700 hover:text-[#FA8F27] hover:bg-orange-50 px-3 py-3 rounded-md text-lg font-medium transition-colors">Services</Link>
          <Link href="/portfolio" onClick={closeDrawer} className="block text-gray-700 hover:text-[#FA8F27] hover:bg-orange-50 px-3 py-3 rounded-md text-lg font-medium transition-colors">Portfolio</Link>
          <Link href="/book-free-audit" onClick={closeDrawer} className="block text-gray-700 hover:text-[#FA8F27] hover:bg-orange-50 px-3 py-3 rounded-md text-lg font-medium transition-colors">Contact</Link>
          <Link href="/blog" onClick={closeDrawer} className="block text-gray-700 hover:text-[#FA8F27] hover:bg-orange-50 px-3 py-3 rounded-md text-lg font-medium transition-colors">Blog</Link>
        </div>
      </div>
    </nav>
  )
}