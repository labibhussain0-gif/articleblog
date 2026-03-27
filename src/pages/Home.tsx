import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await api.get('/articles');
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center py-12">Loading articles...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Latest Articles</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Discover stories, thinking, and expertise from writers on any topic.</p>
      </div>

      <div className="space-y-8">
        {data?.articles?.map((article: any) => (
          <article key={article.id} className="group relative flex flex-col items-start justify-between bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={article.publishedAt} className="text-gray-500 dark:text-gray-400">
                {format(new Date(article.publishedAt), 'MMM d, yyyy')}
              </time>
              <span className="relative z-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100">
                {article.category?.name || 'Uncategorized'}
              </span>
            </div>
            <div className="group relative">
              <h3 className="mt-3 text-xl font-semibold leading-6 text-gray-900 dark:text-gray-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <Link to={`/article/${article.slug}`}>
                  <span className="absolute inset-0" />
                  {article.title}
                </Link>
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {article.excerpt}
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
              <img src={article.author.avatarUrl || `https://ui-avatars.com/api/?name=${article.author.name}`} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
              <div className="text-sm leading-6">
                <p className="font-semibold text-gray-900 dark:text-gray-50">
                  <Link to={`/profile/${article.author.username}`}>
                    <span className="absolute inset-0" />
                    {article.author.name}
                  </Link>
                </p>
                <p className="text-gray-600 dark:text-gray-400">@{article.author.username}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
