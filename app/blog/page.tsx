'use client';

import { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from './blogposts';

export default function BlogArchivePage() {
  const [activeCategory, setActiveCategory] = useState('All insights');

  const categories = [
    'All insights',
    'Engineering',
    'Automation',
    'SEO & AI',
    'Performance'
  ];

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featuredPost = sortedPosts[0];
  const remainingPosts = sortedPosts.slice(1);

  const filteredPosts = remainingPosts.filter((post) => {
    if (activeCategory === 'All insights') return true;
    if (activeCategory === 'SEO & AI') {
      return (
        post.title.toLowerCase().includes('seo') ||
        post.title.toLowerCase().includes('geo') ||
        post.title.toLowerCase().includes('ai')
      );
    }
    if (activeCategory === 'Engineering') {
      return (
        post.title.toLowerCase().includes('architecture') ||
        post.title.toLowerCase().includes('cms') ||
        post.title.toLowerCase().includes('web')
      );
    }
    if (activeCategory === 'Performance') {
      return (
        post.title.toLowerCase().includes('vitals') ||
        post.title.toLowerCase().includes('speed') ||
        post.title.toLowerCase().includes('slow')
      );
    }
    if (activeCategory === 'Automation') {
      return (
        post.title.toLowerCase().includes('contractor') ||
        post.title.toLowerCase().includes('sales') ||
        post.title.toLowerCase().includes('leads')
      );
    }
    return true;
  });

  return (
    <div className="bg-white text-slate-900 selection:bg-[#F06A1A] selection:text-white">
      {/* Header matching Figma */}
      <section className="py-20 lg:py-28 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs sm:text-sm font-mono tracking-wider text-slate-500 uppercase">
            Blog &amp; insights / The thinking behind the build
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
            Perspective for what&apos;s next.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Practical ideas at the intersection of engineering, design and better business systems. Written to help you make the next decision with confidence.
          </p>
        </div>
      </section>

      {/* Featured Story Region (matching Figma) */}
      {featuredPost && (
        <section className="py-12 lg:py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="block bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left content column */}
                <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="inline-block">
                      <span className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-orange-50 text-[#F06A1A] border border-orange-200/60">
                        Featured / Engineering &amp; AI
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#F06A1A] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-8 flex items-center justify-between border-t border-slate-100 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        IE
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-slate-900">{featuredPost.author}</span>
                        <span className="text-slate-400">
                          {new Date(featuredPost.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          · 6 min read
                        </span>
                      </div>
                    </div>

                    <span className="text-[#F06A1A] font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read the insight</span>
                      <span>↗</span>
                    </span>
                  </div>
                </div>

                {/* Right image column */}
                <div className="lg:col-span-5 bg-slate-900 overflow-hidden relative min-h-[300px] lg:min-h-full">
                  <img
                    src={featuredPost.image || '/hero_bg.jpg'}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Recent Insights Section */}
      <section className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                Recent insights
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Ideas worth building on
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#F06A1A] text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="h-52 bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.image || '/hero_bg.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 sm:p-7 space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                      Engineering insight
                    </span>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#F06A1A] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#F06A1A] hover:text-[#dc580b] transition-colors"
                  >
                    <span>Read insight</span>
                    <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial conclusion / Audit Invitation (matching Figma) */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-slate-100">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                Turn the insight into a next step.
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Bring us your biggest digital bottleneck. We&apos;ll help you find a practical place to start.
              </p>
            </div>

            <Link
              href="/book-free-audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-md transition-all active:scale-[0.98] flex-shrink-0"
            >
              <span>Get Your Free Growth Audit</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}