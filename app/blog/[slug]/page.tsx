import { blogPosts } from '../blogposts';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>; // En Next.js 15/16 params es una Promise
}

export default async function BlogPostPage({ params }: Props) {
  // 1. Desestructurar el slug esperando a la promesa
  const { slug } = await params;

  // 2. Buscar el post que coincida con el slug de la URL
  const post = blogPosts.find((p) => p.slug === slug);

  // 3. Si el post no existe, mandar un 404 limpio de Next.js
  if (!post) {
    notFound();
  }

  // Extraer el contenido HTML a renderizar
  const htmlContent = post.content || post.content || '';

  // 4. Renderizar el contenido del post
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <article className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Por {post.author} • {post.date}
        </p>
        
        {/* Renderizado de HTML dinámico sin escapar etiquetas */}
        <div 
          className="prose lg:prose-xl text-gray-700 content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
      </article>
    </main>
  );
}