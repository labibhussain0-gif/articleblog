import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { groq, urlFor } from '../lib/sanity';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => query.length > 2 ? groq.searchArticles(query) : Promise.resolve([]),
    enabled: query.length > 2,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="Search articles, topics, authors..."
            className="w-full pl-12 pr-12 py-4 text-lg rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => { setQuery(''); setSearchParams({}); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6">
          {query.length > 2 ? (
            <p className="text-slate-600 dark:text-slate-300">
              {isLoading ? 'Searching...' : `${results.length} results for `}
              <span className="font-semibold text-slate-900 dark:text-white">"{query}"</span>
            </p>
          ) : query.length > 0 ? (
            <p className="text-slate-500 italic">Type at least 3 characters to search...</p>
          ) : (
            <p className="text-slate-500">Discover stories from across the world.</p>
          )}
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          )}

          {!isLoading && results.map((article: any) => {
            const imgUrl = article.coverImage ? urlFor(article.coverImage).url() : `https://picsum.photos/600/400?random=${article._id}`;
            return (
              <article key={article._id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/article/${article.slug?.current}`} className="flex flex-col sm:flex-row gap-6 p-6">
                  <img src={imgUrl} alt={article.title} className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {article.category && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                          {article.category.name}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">{format(new Date(article.publishedAt || Date.now()), 'MMM d, yyyy')}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
                      {article.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>By {article.author?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{article.readingTime || 5} min read</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* No Results State */}
        {!isLoading && query.length > 2 && results.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
            <p className="text-slate-500">Try different keywords or check your spelling</p>
          </div>
        )}
      </div>
    </div>
  );
}
