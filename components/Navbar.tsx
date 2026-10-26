'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ArrowRight } from '@/components/icons/ArrowIcons';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide marketing navbar on admin dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/book-free-audit' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white md:bg-white/95 md:backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo matching Figma design */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#FA8F27] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
              <img
                src="/logo-indeva.png"
                alt="Indeva Websites"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#F06A1A] transition-colors">
                indeva
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-0.5">
                Websites
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-[#F06A1A] font-semibold bg-orange-50/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/book-free-audit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
            >
              <span>Book Free Audit</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDrawer} 
              className="p-2 rounded-lg text-slate-700 hover:text-[#F06A1A] hover:bg-slate-100 focus:outline-none transition-colors" 
              aria-label="Open mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile Sliding Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FA8F27] flex items-center justify-center flex-shrink-0">
              <img
                src="/logo-indeva.png"
                alt="Indeva Websites"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-slate-900">indeva</span>
              <span className="text-[9px] font-medium tracking-wider text-slate-400 uppercase">Websites</span>
            </div>
          </div>
          <button 
            onClick={closeDrawer} 
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100" 
            aria-label="Close mobile menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation Links */}
        <div className="flex flex-col px-4 py-6 space-y-1.5 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={closeDrawer} 
                className={`group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive 
                    ? 'text-[#F06A1A] bg-orange-50 font-semibold' 
                    : 'text-slate-700 hover:text-[#F06A1A] hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F06A1A] transition-colors" />
              </Link>
            );
          })}
        </div>

        {/* Mobile CTA at bottom of drawer */}
        <div className="p-5 border-t border-gray-100 bg-slate-50">
          <Link
            href="/book-free-audit"
            onClick={closeDrawer}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-sm text-center"
          >
            <span>Book Free Audit</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-center text-slate-400 mt-2.5">
            15-min discovery · Zero pressure
          </p>
        </div>
      </div>
    </header>
  );
}