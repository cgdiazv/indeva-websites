import Link from 'next/link';
import { ArrowUpRight } from '@/components/icons/ArrowIcons';

export default function Home() {
  return (
    <div className="bg-white text-slate-900 selection:bg-[#F06A1A] selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & Action */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-block">
                <span className="text-xs sm:text-sm font-mono tracking-wider text-slate-500 uppercase">
                  Digital craftsmanship. Engineering discipline.
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
                Turn Your Website Into Your Best 24/7 Salesperson
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Beautiful is the starting line. We engineer high-converting websites, lean automations and headless cloud systems that keep your business moving.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/book-free-audit"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
                >
                  <span>Book 15-Min Audit</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-xs"
                >
                  <span>View Work</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-normal">
                No slow legacy builders. No plugin dependency. Just room to grow.
              </p>
            </div>

            {/* Right Column: Live Performance Diagnostic Card (matching Figma) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-[#0C1322] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-800 relative overflow-hidden group">
                {/* Background glow */}
                <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#F06A1A]/15 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                  <div className="text-xs font-mono text-slate-400">
                    <span>indeva / production</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700/60">
                    Preview
                  </span>
                </div>

                {/* Score section */}
                <div className="py-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block mb-1">
                      Performance score
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-extrabold tracking-tight text-white">99</span>
                      <span className="text-lg text-slate-500 font-mono">/ 100</span>
                    </div>
                  </div>

                  {/* Circular indicator with lightning */}
                  <div className="w-16 h-16 rounded-full border-2 border-[#F06A1A] bg-[#F06A1A]/10 flex items-center justify-center text-[#F06A1A] shadow-inner">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                </div>

                {/* Response time sparkline */}
                <div className="space-y-2 pb-6 border-b border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Response time · last 24h</span>
                    <span className="text-amber-400 font-semibold">128 ms</span>
                  </div>
                  <div className="h-14 w-full pt-1">
                    <svg viewBox="0 0 300 50" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F06A1A" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#F06A1A" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,38 L18,42 L36,35 L54,40 L72,32 L90,36 L108,27 L126,31 L144,21 L162,26 L180,18 L198,22 L216,14 L234,17 L252,10 L270,14 L288,8 L300,6 L300,50 L0,50 Z"
                        fill="url(#sparklineGrad)"
                      />
                      <path
                        d="M0,38 L18,42 L36,35 L54,40 L72,32 L90,36 L108,27 L126,31 L144,21 L162,26 L180,18 L198,22 L216,14 L234,17 L252,10 L270,14 L288,8 L300,6"
                        fill="none"
                        stroke="#F06A1A"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      />
                    </svg>
                  </div>
                </div>

                {/* Metrics 3-box grid */}
                <div className="grid grid-cols-3 gap-2.5 py-6">
                  <div className="bg-[#121B2C] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-lg font-bold text-white block">0.7s</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Load time</span>
                  </div>
                  <div className="bg-[#121B2C] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-lg font-bold text-white block">0.02</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Layout shift</span>
                  </div>
                  <div className="bg-[#121B2C] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-lg font-bold text-emerald-400 block">100</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">SEO score</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 text-center">
                  Illustrative platform metrics · not a client result
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Feature Pill Strip */}
      <section className="bg-slate-50 border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-[#F06A1A] font-bold text-base">+</span>
              <span>Decoupled architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#F06A1A] font-bold text-base">+</span>
              <span>Lean operations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#F06A1A] font-bold text-base">+</span>
              <span>Accessible experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#F06A1A] font-bold text-base">+</span>
              <span>Measurable growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: What We Stand For */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                01 / What we stand for
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 mt-2">
                Five principles. One higher standard.
              </h2>
            </div>
            <p className="text-slate-500 text-sm sm:text-base max-w-md">
              How we think is as important as what we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-[#F06A1A]">01</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Built For Longevity</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A durable foundation, not another rebuild. Decoupled systems evolve with your business, without locking you into a platform.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-[#F06A1A]">02</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lean Thinking & Kaizen</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Remove waste. Make room for progress. We simplify workflows and continuously improve what matters.
                </p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-[#F06A1A]">03</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Avant-Garde Innovation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Forward-looking interfaces, built for everyone. Accessible, WCAG-compliant experiences make innovation useful.
                </p>
              </div>
            </div>

            {/* Card 04 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-[#F06A1A]">04</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Strategic Partnership</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  An engineering ally, not a handoff. We connect your commercial goals to thoughtful digital decisions.
                </p>
              </div>
            </div>

            {/* Card 05 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-[#F06A1A]">05</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Data-Driven Integrity</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  No vanity metrics. Clear baselines, honest reporting and measurable conversion signals guide every improvement.
                </p>
              </div>
            </div>

            {/* Dark Approach Callout Card (matching Figma) */}
            <div className="p-8 rounded-3xl bg-[#0C1322] text-white flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-4">
                  The Indeva approach
                </span>
                <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
                  Build intentionally. Improve continuously.
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Industrial-grade thinking. Human-centered outcomes.
                </p>
              </div>

              <div className="pt-8">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F06A1A] hover:text-[#dc580b] transition-colors"
                >
                  <span>Explore our services</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: A Better Foundation */}
      <section className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                02 / A better foundation
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                Your business evolves. Your website should too.
              </h2>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Indeva exists to close the gap between business ambition and digital capability. We pair the discipline of Lean and Kaizen with the craft of a digital-product studio.
              </p>

              <p className="text-slate-600 text-base leading-relaxed">
                Monolithic builders tie your content, interface and infrastructure together. We separate those layers, so you can change one without rebuilding everything.
              </p>

              <p className="text-slate-600 text-base leading-relaxed">
                The result: a resilient platform, less operational waste and a partnership focused on the next improvement.
              </p>

              <div className="pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
                >
                  <span>Meet your modern architecture</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Architectural Stack Card (matching Figma) */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-orange-50 text-[#F06A1A] border border-orange-200/50">
                    Modern architecture
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                    Decoupled
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Layer 1: Experience Layer */}
                  <Link
                    href="/services"
                    className="block p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-[#F06A1A]/60 bg-white hover:bg-orange-50/20 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-base group-hover:text-[#F06A1A] transition-colors">
                        Experience layer
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F06A1A] transition-colors" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-mono">
                      Modern frontend · Fast, accessible interfaces
                    </p>
                  </Link>

                  {/* Layer 2: Content & Operations */}
                  <Link
                    href="/services"
                    className="block p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-[#F06A1A]/60 bg-white hover:bg-orange-50/20 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-base group-hover:text-[#F06A1A] transition-colors">
                        Content & operations
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F06A1A] transition-colors" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-mono">
                      Headless CMS · CRM · Payments
                    </p>
                  </Link>

                  {/* Layer 3: Cloud Foundation */}
                  <Link
                    href="/services"
                    className="block p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-[#F06A1A]/60 bg-white hover:bg-orange-50/20 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-base group-hover:text-[#F06A1A] transition-colors">
                        Cloud foundation
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F06A1A] transition-colors" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-mono">
                      Serverless functions · Edge delivery
                    </p>
                  </Link>
                </div>

                <p className="text-xs text-slate-400 text-center mt-6">
                  Independent layers. One connected growth engine.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Growth Audit Invitation Card (matching Figma) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0C1322] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F06A1A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  One conversation. A clearer direction.
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  Your next stage of growth starts here.
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed pt-2">
                  Find the friction in your website, workflows and infrastructure. Leave with a practical next step, not a sales pitch.
                </p>
              </div>

              <div className="flex flex-col sm:items-start lg:items-end gap-3 flex-shrink-0">
                <Link
                  href="/book-free-audit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-lg transition-all active:scale-[0.98]"
                >
                  <span>Book 15-Min Audit</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
                <span className="text-xs text-slate-400 font-mono">
                  Free. Focused. Zero pressure.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}