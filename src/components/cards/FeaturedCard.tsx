import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface FeaturedCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: { name: string };
    author: { name: string; avatarUrl?: string };
    publishedAt: string;
    readTime: number;
    imageUrl?: string;
  };
}

export default function FeaturedCard({ article }: FeaturedCardProps) {
  return (
    <article className="group relative">
      <Link to={`/article/${article.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl">
          <img
            src={article.imageUrl || 'https://picsum.photos/1200/600'}
            alt={article.title}
            width={1200}
            height={504}
            fetchPriority="high"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
            {/* Category Tag */}
            <span className="inline-block w-fit px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase bg-red-600 text-white rounded-full">
              {article.category?.name || 'Featured'}
            </span>

            {/* Headline */}
            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-amber-400 transition-colors"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="hidden md:block text-lg text-slate-200 mb-6 max-w-3xl line-clamp-2">
              {article.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="flex items-center gap-4">
              <img
                src={article.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.name)}&background=random`}
                alt={article.author.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium">{article.author.name}</span>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
