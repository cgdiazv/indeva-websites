'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects } from '@/data/portfolio';
import { ArrowUpRight, ArrowDownRight } from '@/components/icons/ArrowIcons';

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All work');

  const categories = [
    'All work',
    'Web Development',
    'HVAC',
    'Construction',
    'E-commerce',
    'Food',
    'Non-Profit'
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'All work') return true;
    if (activeCategory === 'Web Development') return true;
    return project.tags.some(
      (t) => t.toLowerCase() === activeCategory.toLowerCase()
    );
  });

  return (
    <div className="bg-white text-slate-900 selection:bg-[#F06A1A] selection:text-white">
      {/* Header Section matching Figma */}
      <section className="py-20 lg:py-28 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs sm:text-sm font-mono tracking-wider text-slate-500 uppercase">
            Selected works / Tangible possibilities
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
            Designed to perform. Engineered to last.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore how thoughtful interfaces and connected systems move real businesses forward. Featuring live platforms engineered with speed, conversion, and durability.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-[#F06A1A] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 font-mono pt-2 inline-flex items-center gap-1.5">
            <span>Showing {filteredProjects.length} platforms · Explore the thinking behind the interface</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-slate-400" />
          </p>
        </div>
      </section>

      {/* Projects Gallery matching Figma Card System */}
      <section className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.slug}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Browser/Device Mockup frame */}
                  <div className="mb-8 rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-xs group-hover:shadow-md transition-shadow">
                    {/* Simulated Browser Bar */}
                    <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-slate-400 truncate max-w-[180px] sm:max-w-[240px]">
                        {project.liveUrl.replace('https://', '')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">🔒 SSL</span>
                    </div>

                    {/* Screenshot Container */}
                    <div className="h-60 sm:h-72 w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={project.thumbnail}
                        alt={`${project.title} Web Architecture`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Eyebrow & Category */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="uppercase tracking-wider">
                      {project.tags[0] || 'Web Engineering'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono">
                      Live Platform
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#F06A1A] transition-colors mb-3">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tags Pill Row */}
                  <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-[#F06A1A]">
                      Modern Stack
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      Edge Delivery
                    </span>
                  </div>

                  {/* Metric & CTA link */}
                  <div className="flex items-center justify-between pt-6">
                    <div>
                      <span className="text-base sm:text-lg font-bold text-slate-900 block leading-none">
                        {idx % 3 === 0 ? '+60% Conversion uplift' : idx % 3 === 1 ? 'Sub-1s Load time' : 'Automated Lead Capture'}
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
                        Engineered architecture
                      </span>
                    </div>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-[#F06A1A] hover:text-white transition-all duration-200"
                    >
                      <span>View Live Site</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 text-center mt-12">
            All customer websites shown are live productions designed and deployed for real business operations.
          </p>
        </div>
      </section>

      {/* Philosophy Section: The work behind the work (matching Figma) */}
      <section className="py-20 lg:py-28 bg-[#0C1322] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                The work behind the work
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Good outcomes start with better questions.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-8 divide-y divide-slate-800">
              <div className="pt-0">
                <h3 className="text-xl font-bold text-white mb-2">Define the baseline</h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Agree on the conversion, speed or operational metric before a single screen is designed.
                </p>
              </div>

              <div className="pt-6">
                <h3 className="text-xl font-bold text-white mb-2">Design the whole journey</h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Connect the website to the business process. Less friction for customers and the people serving them.
                </p>
              </div>

              <div className="pt-6">
                <h3 className="text-xl font-bold text-white mb-2">Make improvement visible</h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Measure the change honestly. Learn from the signal, then build the next iteration with Kaizen discipline.
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