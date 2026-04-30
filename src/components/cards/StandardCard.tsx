import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface StandardCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    category: { name: string };
    author: { name: string; avatarUrl?: string };
    publishedAt: string;
    readTime: number;
    imageUrl?: string;
  };
}

export default function StandardCard({ article }: StandardCardProps) {
  return (
    <article className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link to={`/article/${article.slug}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden shrink-0">
          <img
            src={article.imageUrl || 'https://picsum.photos/600/400'}
            alt={article.title}
            width={600}
            height={375}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Category Pill */}
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-full">
            {article.category?.name || 'News'}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3
            className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 font-heading"
          >
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
              {article.excerpt}
            </p>
          )}

          {/* Author & Meta */}
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex items-center gap-2">
              <img
                src={article.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.name)}&background=random`}
                alt={article.author.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {article.author.name}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(article.publishedAt), 'MMM d')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}m
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
