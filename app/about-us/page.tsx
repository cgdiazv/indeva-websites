import Link from 'next/link';

export const metadata = {
  title: 'About Us | Indeva Websites',
  description: 'Precision engineering, Lean thinking, and Kaizen discipline applied to modern web platforms.',
};

export default function AboutUsPage() {
  return (
    <div className="bg-white text-slate-900 selection:bg-[#F06A1A] selection:text-white">
      {/* Hero / Philosophy Introduction */}
      <section className="py-20 lg:py-28 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs sm:text-sm font-mono tracking-wider text-slate-500 uppercase">
            01 / Company Philosophy
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Built with Industrial Precision. Engineered for Continuous Growth.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            With 25 years of cross-disciplinary experience and a foundation in <strong>Lean and Kaizen principles</strong>, we eliminate digital waste to ensure every layer of your platform serves one purpose: <strong>Sustainable Business Velocity.</strong>
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/book-free-audit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-sm transition-all"
            >
              <span>Book Free Audit</span>
              <span>↗</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs"
            >
              <span>Explore Architecture</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Foundations
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 mt-2">
                Five principles. One higher standard.
              </h2>
            </div>
            <p className="text-slate-500 text-sm sm:text-base max-w-md">
              The engineering principles and strategic thinking that drive every line of code we write.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <span className="text-4xl font-extrabold text-[#F06A1A] block mb-6">01</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Built For Longevity</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A durable foundation, not another rebuild. Decoupled systems evolve with your business, without locking you into a platform or disposable themes.
              </p>
            </div>

            {/* 02 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <span className="text-4xl font-extrabold text-[#F06A1A] block mb-6">02</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lean Thinking & Kaizen</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Remove waste. Make room for progress. We simplify workflows and continuously improve what matters, eliminating operational bottlenecks.
              </p>
            </div>

            {/* 03 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <span className="text-4xl font-extrabold text-[#F06A1A] block mb-6">03</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Avant-Garde Innovation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Forward-looking interfaces, built for everyone. Accessible, WCAG-compliant experiences make modern web innovation truly valuable.
              </p>
            </div>

            {/* 04 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <span className="text-4xl font-extrabold text-[#F06A1A] block mb-6">04</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Strategic Partnership</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                An engineering ally, not a passive handoff. We connect your commercial ambitions to thoughtful, high-conversion technical decisions.
              </p>
            </div>

            {/* 05 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <span className="text-4xl font-extrabold text-[#F06A1A] block mb-6">05</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Data-Driven Integrity</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No vanity metrics. Clear baselines, honest reporting and measurable conversion signals guide every architectural iteration.
              </p>
            </div>

            {/* Dark callout card */}
            <div className="p-8 rounded-3xl bg-[#0C1322] text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-4">
                  The Indeva approach
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Build intentionally. Improve continuously.
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Industrial-grade thinking. Human-centered outcomes.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/book-free-audit"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F06A1A] hover:text-[#dc580b] transition-colors"
                >
                  <span>Start a conversation</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0C1322] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Ready for what&apos;s next?
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Let&apos;s build a digital platform that lasts.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Connect with our engineering team for a 15-minute diagnostic session with zero obligation.
              </p>
            </div>

            <Link
              href="/book-free-audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-lg transition-all active:scale-[0.98] flex-shrink-0"
            >
              <span>Book 15-Min Audit</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
