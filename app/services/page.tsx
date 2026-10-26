import Link from 'next/link';
import { ArrowUpRight } from '@/components/icons/ArrowIcons';

export const metadata = {
  title: 'Services | Indeva Websites',
  description: 'Better systems. Fewer limits. Custom Web Engineering, Headless CMS, Business Automations, Cloud Infrastructure, and Technical SEO.',
};

export default function ServicesPage() {
  return (
    <div className="bg-white text-slate-900 selection:bg-[#F06A1A] selection:text-white">
      {/* Header Section */}
      <section className="py-20 lg:py-28 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs sm:text-sm font-mono tracking-wider text-slate-500 uppercase">
            Services / Your digital operating system
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
            Better systems. Fewer limits.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From the first interaction to the work behind it, we engineer the entire journey. Four connected disciplines. One dependable foundation for growth.
          </p>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Bento Card 01: Custom Web Engineering & Headless CMS */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    01 / Engineering capability
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center font-mono font-bold text-sm">
                    &lt;/&gt;
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Custom Web Engineering &amp; Headless CMS
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  A frontend built around your customer, not a template. Modern edge pre-rendering turns complex content into effortless, accessible experiences.
                </p>

                {/* Code preview window mockup */}
                <div className="rounded-2xl bg-[#0C1322] text-slate-300 p-5 font-mono text-xs shadow-inner border border-slate-800">
                  <div className="flex items-center gap-1.5 pb-4 border-b border-slate-800 text-[11px] text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-slate-400">app/page.tsx</span>
                  </div>
                  <pre className="pt-4 leading-relaxed overflow-x-auto text-slate-300">
                    <code>
                      <span className="text-purple-400">const</span> content = <span className="text-purple-400">await</span> cms.<span className="text-blue-400">fetch</span>()<br /><br />
                      <span className="text-purple-400">return</span> &lt;<span className="text-amber-400">Experience</span> data=&#123;content&#125; /&gt;<br />
                      <span className="text-slate-500">// Decoupled. Deployable. Yours.</span>
                    </code>
                  </pre>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-8">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Modern Frontend</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Headless CMS</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Accessible UI</span>
              </div>
            </div>

            {/* Bento Card 02: End-to-End Business Automation */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    02 / Engineering capability
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  End-to-End Business Automation
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Connect the moments between interest and revenue. Stripe payments trigger CRM updates, Resend invoicing and automated scheduling, without the copy-paste.
                </p>

                {/* Workflow pipeline graphic */}
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200/80">
                  <span className="text-xs font-mono text-slate-500 block mb-4">
                    From transaction to next step
                  </span>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div className="w-7 h-7 mx-auto mb-1.5 rounded-md bg-orange-50 text-[#F06A1A] flex items-center justify-center text-sm font-bold">
                        💳
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">Payment</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div className="w-7 h-7 mx-auto mb-1.5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                        📁
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">CRM</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div className="w-7 h-7 mx-auto mb-1.5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                        ✉️
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">Invoice</span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-600 font-medium text-center mt-4 flex items-center justify-center gap-1.5">
                    <span>✓</span>
                    <span>Contact synced · Invoice delivered · Calendar ready</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-8">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Stripe</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">CRM</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Resend</span>
              </div>
            </div>

            {/* Bento Card 03: High-Speed Cloud Infrastructure & Managed Hosting */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    03 / Engineering capability
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  High-Speed Cloud Infrastructure &amp; Managed Hosting
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  A serverless backbone designed for demand. Edge delivery, continuous deployment and proactive monitoring keep your platform ready for the next opportunity.
                </p>

                {/* Cloud metrics monitor box */}
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200/80 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500">Deployment pipeline</span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 font-semibold">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500">Edge network</span>
                    <span className="text-slate-800 font-semibold">Distributed</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-slate-500">Functions</span>
                    <span className="text-slate-800 font-semibold">On demand</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Deployments</span>
                    <span className="text-slate-800 font-semibold">Version controlled</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-8">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Serverless</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Edge delivery</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Managed hosting</span>
              </div>
            </div>

            {/* Bento Card 04: Technical SEO & Web Vitals Optimization */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    04 / Engineering capability
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F06A1A] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Technical SEO &amp; Web Vitals Optimization
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Be easier to find and faster to use. We target sub-second load times with lean assets, semantic architecture and measurable Core Web Vitals improvements.
                </p>

                {/* Web vitals target display */}
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200/80">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-3xl font-black text-slate-950 block">&lt;1s</span>
                      <span className="text-xs text-slate-500 font-mono">Load target</span>
                    </div>
                    <div>
                      <span className="text-3xl font-black text-slate-950 block">≤0.1</span>
                      <span className="text-xs text-slate-500 font-mono">CLS target</span>
                    </div>
                    <div>
                      <span className="text-3xl font-black text-slate-950 block">≤200</span>
                      <span className="text-xs text-slate-500 font-mono">INP · ms</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-[#F06A1A] h-full w-[94%]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-8">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Technical SEO</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Core Web Vitals</span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">Structured data</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison Matrix: Monolithic vs Indeva Modern Architecture */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Make the foundation work harder
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 mt-2">
              Legacy Monolithic Systems vs. Indeva Modern Architecture
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
              Not more technology for its own sake. The right separation of concerns, with practical benefits at every layer.
            </p>
          </div>

          {/* Matrix Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-md">
            <div className="grid grid-cols-12 bg-[#0C1322] text-white p-4 sm:p-6 text-xs sm:text-sm font-semibold">
              <div className="col-span-3 text-slate-400">The difference</div>
              <div className="col-span-4 sm:col-span-4 text-slate-300">Legacy monolithic systems</div>
              <div className="col-span-5 sm:col-span-5 text-[#F06A1A] font-bold">Indeva modern architecture</div>
            </div>

            <div className="divide-y divide-slate-100 bg-white text-xs sm:text-sm">
              <div className="grid grid-cols-12 p-4 sm:p-6 items-center">
                <div className="col-span-3 font-bold text-slate-900">Speed</div>
                <div className="col-span-4 sm:col-span-4 text-slate-500 pr-2">Heavy runtime rendering and bundled themes</div>
                <div className="col-span-5 sm:col-span-5 text-slate-900 font-medium">Pre-rendered pages and edge caching</div>
              </div>

              <div className="grid grid-cols-12 p-4 sm:p-6 items-center">
                <div className="col-span-3 font-bold text-slate-900">Security</div>
                <div className="col-span-4 sm:col-span-4 text-slate-500 pr-2">Shared attack surface across themes and plugins</div>
                <div className="col-span-5 sm:col-span-5 text-slate-900 font-medium">Isolated services and a smaller public surface</div>
              </div>

              <div className="grid grid-cols-12 p-4 sm:p-6 items-center">
                <div className="col-span-3 font-bold text-slate-900">Plugins</div>
                <div className="col-span-4 sm:col-span-4 text-slate-500 pr-2">Stacked dependencies and recurring patch cycles</div>
                <div className="col-span-5 sm:col-span-5 text-slate-900 font-medium">Purpose-built integrations through stable APIs</div>
              </div>

              <div className="grid grid-cols-12 p-4 sm:p-6 items-center">
                <div className="col-span-3 font-bold text-slate-900">Elasticity</div>
                <div className="col-span-4 sm:col-span-4 text-slate-500 pr-2">Capacity tied to a fixed server or plan</div>
                <div className="col-span-5 sm:col-span-5 text-slate-900 font-medium">Serverless capacity that scales with demand</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            Architecture is contextual. We validate the trade-offs against your content, team and growth goals before recommending a stack.
          </p>
        </div>
      </section>

      {/* Delivery Process Roadmap */}
      <section className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              From clarity to continuous improvement
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 mt-2">
              A deliberate process. No black box.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#F06A1A] uppercase tracking-wider block mb-4">
                  01 / Discover
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Discover</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Map your funnel, content and operational friction. Agree on the outcomes worth measuring.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#F06A1A] uppercase tracking-wider block mb-4">
                  02 / Engineer
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Engineer</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Prototype the experience. Build the architecture. Connect your tools with maintainable APIs.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#F06A1A] uppercase tracking-wider block mb-4">
                  03 / Validate
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Validate</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Test accessibility, performance and real journeys before a controlled launch.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#F06A1A] uppercase tracking-wider block mb-4">
                  04 / Improve
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Improve</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Monitor the signals. Remove the next bottleneck. Apply Kaizen to every release.
                </p>
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
                One conversation. A clearer direction.
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Your next stage of growth starts here.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
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
      </section>
    </div>
  );
}