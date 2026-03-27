import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface CompactCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    category: { name: string };
    author: { name: string };
    publishedAt: string;
    readTime: number;
    imageUrl?: string;
  };
}

export default function CompactCard({ article }: CompactCardProps) {
  return (
    <article className="group flex gap-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
      <Link to={`/article/${article.slug}`} className="flex-shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg">
          <img
            src={article.imageUrl || 'https://picsum.photos/200/200'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-col justify-center min-w-0">
        <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">
          {article.category?.name || 'News'}
        </span>
        <Link to={`/article/${article.slug}`}>
          <h4
            className="font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {article.title}
          </h4>
        </Link>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{article.author.name}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}m
          </span>
        </div>
      </div>
    </article>
  );
}
