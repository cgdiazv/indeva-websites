import { projects } from '@/data/portfolio';

export default function PortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take a look at some of the professional websites we have designed and built to help businesses grow their digital presence.
        </p>
      </div>
      
      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            key={project.slug}
            className="group cursor-pointer"
          >
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              
              {/* Thumbnail Image */}
              <div className="h-56 bg-gray-100 w-full overflow-hidden relative border-b border-gray-100">
                <img 
                  src={project.thumbnail} 
                  alt={`${project.title} Website Design`} 
                  className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Project Title & Tags */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#FA8F27] transition-colors duration-300">
                  {project.title}
                </h2>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </a>
        ))}
      </div>
    </div>
  );
}