import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '../blogposts';
import { ArrowLeft, ArrowUpRight } from '@/components/icons/ArrowIcons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found | Indeva Websites' };

  return {
    title: `${post.title} | Indeva Insights`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related posts (excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="bg-white text-slate-900 selection:bg-[#F06A1A] selection:text-white">
      {/* Top Breadcrumb & Article Header */}
      <section className="pt-12 pb-10 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-[#F06A1A] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all insights</span>
          </Link>

          <div className="space-y-4">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-orange-50 text-[#F06A1A] border border-orange-200/60 inline-block">
              Engineering &amp; Strategy
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed pt-2">
              {post.excerpt}
            </p>

            {/* Author and Date Meta Row */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                IE
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-slate-900 block">{post.author}</span>
                <span className="text-slate-400 font-mono">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  · 7 min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Header Illustration/Photo */}
      {post.image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 py-8">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[11px] text-slate-400 font-mono text-center mt-2.5">
            Architecture and systems study · Indeva Editorial
          </p>
        </div>
      )}

      {/* Main Reading Layout: Sticky Sidebar TOC + Article Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Sticky Sidebar (matching Figma Article · Desktop) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8 order-2 lg:order-1">
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  In this insight
                </span>
                <ul className="space-y-2.5 text-xs font-medium text-slate-600">
                  <li className="hover:text-[#F06A1A] cursor-pointer transition-colors">
                    01 Architectural Foundations
                  </li>
                  <li className="hover:text-[#F06A1A] cursor-pointer transition-colors">
                    02 Eliminating Monolithic Friction
                  </li>
                  <li className="hover:text-[#F06A1A] cursor-pointer transition-colors">
                    03 Decoupled Workflows
                  </li>
                  <li className="hover:text-[#F06A1A] cursor-pointer transition-colors">
                    04 Measuring What Improves
                  </li>
                  <li className="hover:text-[#F06A1A] cursor-pointer transition-colors">
                    05 Practical Execution
                  </li>
                </ul>
              </div>

              <div className="px-2 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  Share this perspective
                </span>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      `https://indevawebsites.com/blog/${post.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#F06A1A] transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <span>·</span>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard?.writeText(window.location.href);
                      }
                    }}
                    className="hover:text-[#F06A1A] transition-colors"
                  >
                    Copy link
                  </button>
                </div>
              </div>

              {/* Callout box in sidebar */}
              <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200/60 text-xs text-slate-700 space-y-2">
                <span className="font-bold text-[#F06A1A] block">Free Growth Audit</span>
                <p className="leading-relaxed">
                  Want to know where your platform stands against these standards? Book a 15-minute diagnostic.
                </p>
                <Link
                  href="/book-free-audit"
                  className="inline-flex items-center gap-1 font-semibold text-[#F06A1A] hover:underline pt-1"
                >
                  <span>Book 15-Min Audit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>

            {/* Right Reading Body Column */}
            <article className="lg:col-span-8 order-1 lg:order-2">
              {/* Short Version Summary Box (matching Figma) */}
              <div className="bg-slate-50 border-l-4 border-[#F06A1A] p-6 rounded-r-2xl mb-10 space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  The short version
                </span>
                <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                  Decouple the experience, content and business logic. Keep the connections explicit. Improve one part without destabilizing the whole.
                </p>
              </div>

              {/* Dynamic HTML Content from blogposts.ts */}
              <div
                className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900 prose-a:text-[#F06A1A] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* In-Article Audit Card (matching Figma) */}
              <div className="mt-12 p-8 rounded-3xl bg-[#0C1322] text-white shadow-xl space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  Next Step
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Not sure where your system is holding you back?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  We&apos;ll help you identify the next useful improvement in a focused, zero-pressure conversation.
                </p>
                <div className="pt-2">
                  <Link
                    href="/book-free-audit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#F06A1A] hover:bg-[#dc580b] shadow-md transition-all active:scale-[0.98]"
                  >
                    <span>Get Your Free Growth Audit</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Author Sign-off */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Published by {post.author}</span>
                <span>Indeva Engineering Floor</span>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* Related Insights Grid (matching Figma "Keep the thinking moving.") */}
      {relatedPosts.length > 0 && (
        <section className="py-20 lg:py-28 bg-slate-50/60 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 mb-12">
              Keep the thinking moving.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.slug}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                      Engineering perspective
                    </span>
                    <Link href={`/blog/${rPost.slug}`} className="block">
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#F06A1A] transition-colors line-clamp-2">
                        {rPost.title}
                      </h3>
                    </Link>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {rPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">
                      {new Date(rPost.date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <Link
                      href={`/blog/${rPost.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#F06A1A] hover:text-[#dc580b] transition-colors"
                    >
                      <span>Read insight</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}