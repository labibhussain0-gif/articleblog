import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { Heart, MessageSquare, Share2, Bookmark } from 'lucide-react';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const res = await api.get(`/articles/${slug}`);
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center py-12">Loading article...</div>;
  if (!article) return <div className="text-center py-12">Article not found</div>;

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-6 font-serif">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <img src={article.author.avatarUrl || `https://ui-avatars.com/api/?name=${article.author.name}`} alt="" className="w-8 h-8 rounded-full" />
            <Link to={`/profile/${article.author.username}`} className="font-medium text-gray-900 dark:text-gray-300 hover:underline">
              {article.author.name}
            </Link>
          </div>
          <span>&middot;</span>
          <time dateTime={article.publishedAt}>
            {article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : 'Draft'}
          </time>
          <span>&middot;</span>
          <span>{article.readingTime || 5} min read</span>
        </div>
      </header>

      {article.coverImage && (
        <img src={article.coverImage} alt={article.title} className="w-full h-auto rounded-2xl mb-10 object-cover aspect-[21/9]" />
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200">
        {/* In a real app, we'd use react-markdown or dangerouslySetInnerHTML for rich text */}
        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
      </div>

      <hr className="my-10 border-gray-200 dark:border-gray-800" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button aria-label={`${article.likes?.length || 0} Likes`} className="flex items-center gap-2 text-gray-500 hover:text-red-500 focus-visible:ring-2 focus-visible:outline-none transition-colors">
            <Heart className="w-6 h-6" />
            <span>{article.likes?.length || 0}</span>
          </button>
          <button aria-label={`${article.comments?.length || 0} Comments`} className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 focus-visible:ring-2 focus-visible:outline-none transition-colors">
            <MessageSquare className="w-6 h-6" />
            <span>{article.comments?.length || 0}</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="Share" className="text-gray-500 hover:text-gray-900 dark:hover:text-white focus-visible:ring-2 focus-visible:outline-none transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
          <button aria-label="Bookmark" className="text-gray-500 hover:text-indigo-500 focus-visible:ring-2 focus-visible:outline-none transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
      </div>
    </article>
  );
}
