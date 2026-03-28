import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { format } from 'date-fns';

const mockResults = [
  { id: '1', title: 'Senate Passes Landmark Climate Legislation', slug: 'senate-passes-landmark-climate-legislation', excerpt: 'In a historic bipartisan vote, the Senate approved sweeping climate measures.', category: { name: 'Politics' }, author: { name: 'Sarah Chen' }, publishedAt: '2026-03-25T08:00:00Z', readTime: 8, imageUrl: 'https://picsum.photos/600/400?random=1' },
  { id: '2', title: 'Federal Reserve Signals Potential Rate Cuts', slug: 'fed-signals-potential-rate-cuts', excerpt: 'Fed Chair Powell indicated the central bank may begin cutting interest rates.', category: { name: 'Economy' }, author: { name: 'Maria Rodriguez' }, publishedAt: '2026-03-24T15:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=2' },
  { id: '3', title: 'OpenAI Unveils Next-Generation Reasoning Model', slug: 'openai-unveils-next-generation-reasoning-model', excerpt: 'The new model demonstrates unprecedented capabilities in complex problem-solving.', category: { name: 'Tech' }, author: { name: 'James Chen' }, publishedAt: '2026-03-23T10:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=3' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results] = useState(mockResults);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, topics, authors..."
            aria-label="Search articles, topics, authors"
            className="w-full pl-12 pr-12 py-4 text-lg rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Clear search"
            >
              <X className="w-5 h-5 text-slate-400" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-300">
            {results.length} results for <span className="font-semibold text-slate-900 dark:text-white">"climate"</span>
          </p>
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          {results.map((article) => (
            <article key={article.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/article/${article.slug}`} className="flex gap-6 p-6">
                <img src={article.imageUrl} alt={article.title} className="w-32 h-24 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                      {article.category.name}
                    </span>
                    <span className="text-xs text-slate-500">{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    {article.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span>By {article.author.name}</span>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* No Results State */}
        {results.length === 0 && (
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
