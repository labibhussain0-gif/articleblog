import React, { useState, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../components/SEOHead';
import { Clock, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, startOfDay, subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { groq, urlFor } from '../lib/sanity';

const ARTICLES_PER_PAGE = 12;

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  // Derive slug from param or from URL path (e.g., /category/politics → 'politics')
  const slug = categorySlug || location.pathname.split('/').pop() || 'politics';
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week'>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => groq.getCategoryBySlug(slug),
  });

  const { data: articles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ['categoryArticles', slug],
    queryFn: () => groq.getArticlesByCategory(slug),
  });

  const filteredArticles = useMemo(() => {
    const todayStart = startOfDay(new Date());

    return articles
      .filter((article: any) => {
        if (activeFilter === 'all') return true;
        const published = new Date(article.publishedAt || Date.now());
        if (activeFilter === 'today') return published >= subDays(todayStart, 1);
        if (activeFilter === 'week') return published >= subDays(todayStart, 7);
        return true;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      });
  }, [articles, activeFilter, sortOrder]);

  if (loadingCategory || loadingArticles) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  // Use Sanity category or a fallback
  const meta = {
    name: category?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
    description: category?.description || `Explore our latest articles in ${slug}.`,
    color: category?.color || '#dc2626',
  };

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

  const categoryUrl = `https://articleblogwebsite.web.app/category/${slug}`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SEOHead
        title={`${meta.name} News & Analysis`}
        description={meta.description}
        url={categoryUrl}
        image="https://articleblogwebsite.web.app/apple-touch-icon.png"
        type="website"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${meta.name} News`,
            "url": categoryUrl,
            "description": meta.description,
            "publisher": {
              "@type": "Organization",
              "name": "The Daily Pulse",
              "url": "https://articleblogwebsite.web.app"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://articleblogwebsite.web.app/" },
              { "@type": "ListItem", "position": 2, "name": meta.name, "item": categoryUrl }
            ]
          }
        ])}</script>
      </Helmet>
      {/* Category Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <span
              className="inline-block px-4 py-1 text-sm font-semibold rounded-full text-white mb-4"
              style={{ backgroundColor: meta.color }}
            >
              {meta.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-heading">
              {meta.name}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {meta.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            {(['all', 'today', 'week'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'today' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm"
          >
            <option value="latest">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
          </select>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article: any) => {
            const imgUrl = article.coverImage ? urlFor(article.coverImage).url() : `https://picsum.photos/600/400?random=${article._id}`;
            const avatarUrl = article.author?.avatar ? urlFor(article.author.avatar).url() : `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.name || 'U')}&background=random`;
            return (
              <article key={article._id} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <Link to={`/article/${article.slug?.current}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={imgUrl} alt={article.title} width={600} height={375} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {article.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-white text-slate-900 rounded-full">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 font-heading">
                      {article.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <img src={avatarUrl} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                        <span>{article.author?.name || 'Unknown Author'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(article.publishedAt || Date.now()), 'MMM d')}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime || 5}m</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 focus-visible:ring-2"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`w-10 h-10 rounded-lg text-sm font-medium focus-visible:ring-2 ${
                  currentPage === page
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 focus-visible:ring-2"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
