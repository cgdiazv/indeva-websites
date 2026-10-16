'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hide footer on admin dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0B1220] text-white border-t border-slate-800/80 mt-auto selection:bg-[#F06A1A] selection:text-white">
      {/* Newsletter / Engineering notes section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
              Notes from the engineering floor
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mt-2">
              A better signal. Less noise.
            </h3>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Ideas on lean systems, thoughtful design and sustainable digital growth.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Thank you. You are on the dispatch list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your work email"
                    className="w-full bg-[#121B2C] border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F06A1A] focus:ring-1 focus:ring-[#F06A1A] pr-12 transition-all"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-2 p-2 rounded-lg bg-[#F06A1A] text-white hover:bg-[#dc580b] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Occasional insights. Unsubscribe anytime. Privacy respected.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main links and brand representation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Mobile phone teaser card preview from Figma */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="w-full max-w-[280px] bg-gradient-to-b from-slate-900 to-black p-4 rounded-[28px] border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-3">
                <span>3:16</span>
                <span className="flex items-center gap-1">
                  <span>●●●</span>
                </span>
              </div>
              <div className="space-y-1 mb-4">
                <span className="text-xs font-bold text-slate-300">indeva.</span>
                <h4 className="text-xl font-extrabold text-white leading-tight">
                  Built for what&apos;s next.
                </h4>
              </div>
              <div className="aspect-[4/3] rounded-xl bg-slate-800/80 border border-slate-700/60 overflow-hidden relative mb-4">
                <img
                  src="/enterprise_platform_minimal.jpg"
                  alt="Enterprise Platform preview"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <Link
                href="/book-free-audit"
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-[#F06A1A] hover:bg-[#dc580b] text-white text-xs font-semibold transition-colors"
              >
                <span>Let&apos;s build better</span>
                <span>↗</span>
              </Link>
              <p className="text-[10px] text-slate-400 text-center mt-2.5">
                Engineering clarity. Designing possibility.
              </p>
            </div>
          </div>

          {/* Indeva brand identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FA8F27] flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo-indeva.png"
                  alt="Indeva Websites"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-white tracking-tight">indeva</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Websites</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
              Precision engineering. Human ambition.
            </p>

            <div className="pt-2">
              <a
                href="https://indevasa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-[#F06A1A] transition-colors"
              >
                <span>indevasa.com</span>
                <span className="text-xs">↗</span>
              </a>
            </div>

            <div className="pt-3 text-xs text-slate-500 space-y-1">
              <p>12828 Willow Centre Dr Ste D, Houston, TX 77066</p>
              <p>(209) 286-6546 · web@indevasa.com</p>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Explore
            </h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/about-us" className="hover:text-[#F06A1A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#F06A1A] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-[#F06A1A] transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#F06A1A] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/book-free-audit" className="hover:text-[#F06A1A] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              The details
            </h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/book-free-audit" className="hover:text-[#F06A1A] transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/book-free-audit" className="hover:text-[#F06A1A] transition-colors">
                  Terms of use
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-pointer hover:text-slate-400">
                  Cookie preferences
                </span>
              </li>
              <li className="pt-4 text-xs text-slate-500">
                © {new Date().getFullYear()} Indeva Websites
              </li>
            </ul>
          </div>
        </div>

        {/* Large Architectural Statement at footer base */}
        <div className="mt-16 pt-12 border-t border-slate-800/60 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
              Less friction. More forward.
            </h2>
            <Link
              href="/book-free-audit"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-slate-400 hover:text-[#F06A1A] transition-colors pt-2"
            >
              <span>Engineered to keep improving.</span>
              <span>↗</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
            <span>Serverless Edge</span>
            <span>·</span>
            <span>Sub-second Vitals</span>
            <span>·</span>
            <span>WCAG Accessible</span>
          </div>
        </div>
      </div>
    </footer>
  );
}