import { blogPosts } from './blogposts';
import Link from 'next/link';

export default function BlogArchivePage() {
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight">
            Our Blog
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#FA8F27]"></div>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            News, updates and technical knowledge about the industrial sector and sustainability.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <article 
              key={post.slug} 
              className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              {post.image && (
                <Link href={`/blog/${post.slug}`} className="aspect-[16/9] overflow-hidden block">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                  />
                </Link>
              )}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-EN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                </div>
                <Link href={`/blog/${post.slug}`} className="block flex-1">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#FA8F27] transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-gray-600 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {post.author}
                  </span>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-[#FA8F27] font-bold text-sm hover:text-[#e07d1f] flex items-center transition-colors duration-200"
                  >
                    Read more <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}