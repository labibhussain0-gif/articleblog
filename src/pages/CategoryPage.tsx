import { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const mockArticles = [
  // Politics
  { id: '1', title: 'Senate Passes Landmark Climate Legislation', slug: 'senate-passes-landmark-climate-legislation', excerpt: 'In a historic bipartisan vote, the Senate approved sweeping climate measures.', category: { name: 'Politics', slug: 'politics', color: '#dc2626' }, author: { name: 'Sarah Chen', avatarUrl: 'https://i.pravatar.cc/100?img=1' }, publishedAt: '2026-03-25T08:00:00Z', readTime: 8, imageUrl: 'https://picsum.photos/600/400?random=1' },
  { id: '2', title: 'Election Reform Bills Gain Bipartisan Support', slug: 'election-reform-bills', excerpt: 'Rare collaboration emerges as lawmakers seek to address voting access concerns.', category: { name: 'Politics', slug: 'politics', color: '#dc2626' }, author: { name: 'Robert Hayes', avatarUrl: 'https://i.pravatar.cc/100?img=2' }, publishedAt: '2026-03-24T14:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=2' },
  { id: '3', title: 'International Trade Agreements Face Scrutiny', slug: 'international-trade-agreements', excerpt: 'New tariffs spark diplomatic tensions among allied nations.', category: { name: 'Politics', slug: 'politics', color: '#dc2626' }, author: { name: 'Jennifer Cole', avatarUrl: 'https://i.pravatar.cc/100?img=3' }, publishedAt: '2026-03-23T16:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=3' },
  { id: '4', title: 'Defense Budget Debates Heat Up in Capitol', slug: 'defense-budget-debates', excerpt: 'Lawmakers grapple with modernizing military capabilities.', category: { name: 'Politics', slug: 'politics', color: '#dc2626' }, author: { name: 'Michael Torres', avatarUrl: 'https://i.pravatar.cc/100?img=4' }, publishedAt: '2026-03-22T11:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=4' },
  { id: '5', title: 'Immigration Policy Reaches Crossroads', slug: 'immigration-policy-crossroads', excerpt: 'Bipartisan bill aims to overhaul the immigration system.', category: { name: 'Politics', slug: 'politics', color: '#dc2626' }, author: { name: 'Lisa Martinez', avatarUrl: 'https://i.pravatar.cc/100?img=5' }, publishedAt: '2026-03-21T09:00:00Z', readTime: 7, imageUrl: 'https://picsum.photos/600/400?random=5' },
  { id: '6', title: 'Healthcare Reform Takes Center Stage', slug: 'healthcare-reform-center-stage', excerpt: 'Proposals aim to expand coverage while reducing costs.', category: { name: 'Politics', slug: 'politics', color: '#dc2626' }, author: { name: 'David Kim', avatarUrl: 'https://i.pravatar.cc/100?img=6' }, publishedAt: '2026-03-20T15:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=6' },
  // Economy
  { id: '7', title: 'Tech IPO Market Shows Signs of Revival', slug: 'tech-ipo-market-revival', excerpt: 'After a prolonged downturn, investors eye promising public offerings.', category: { name: 'Economy', slug: 'economy', color: '#059669' }, author: { name: 'Sandra Liu', avatarUrl: 'https://i.pravatar.cc/100?img=8' }, publishedAt: '2026-03-25T05:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=13' },
  { id: '8', title: 'Global Supply Chains Adapt to New Realities', slug: 'global-supply-chains', excerpt: 'Companies prioritize resilience over efficiency in post-pandemic era.', category: { name: 'Economy', slug: 'economy', color: '#059669' }, author: { name: 'Thomas Wright', avatarUrl: 'https://i.pravatar.cc/100?img=9' }, publishedAt: '2026-03-24T11:00:00Z', readTime: 7, imageUrl: 'https://picsum.photos/600/400?random=14' },
  { id: '9', title: 'Housing Market Stabilizes After Volatile Year', slug: 'housing-market-stabilizes', excerpt: 'Buyers and sellers find new equilibrium in residential real estate.', category: { name: 'Economy', slug: 'economy', color: '#059669' }, author: { name: 'Amanda Foster', avatarUrl: 'https://i.pravatar.cc/100?img=10' }, publishedAt: '2026-03-23T16:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=15' },
  { id: '10', title: 'Federal Reserve Signals Potential Rate Cuts', slug: 'fed-signals-rate-cuts', excerpt: 'Markets rally as Fed chair hints at policy shift in response to cooling inflation.', category: { name: 'Economy', slug: 'economy', color: '#059669' }, author: { name: 'Maria Rodriguez', avatarUrl: 'https://i.pravatar.cc/100?img=17' }, publishedAt: '2026-03-22T14:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=22' },
  { id: '11', title: 'Central Bank Digital Currencies Gain Momentum', slug: 'cbdc-gain-momentum', excerpt: 'Nations accelerate plans for state-backed digital payment systems.', category: { name: 'Economy', slug: 'economy', color: '#059669' }, author: { name: 'David Kim', avatarUrl: 'https://i.pravatar.cc/100?img=18' }, publishedAt: '2026-03-21T10:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=23' },
  { id: '12', title: 'Small Business Confidence Index Rises', slug: 'small-business-confidence', excerpt: 'Optimism returns as access to capital improves and consumer spending holds.', category: { name: 'Economy', slug: 'economy', color: '#059669' }, author: { name: 'Emily Watson', avatarUrl: 'https://i.pravatar.cc/100?img=19' }, publishedAt: '2026-03-20T08:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=24' },
  // Culture
  { id: '13', title: 'Streaming Wars Intensify With New Content Deals', slug: 'streaming-wars-intensify', excerpt: 'Major platforms battle for exclusive programming rights.', category: { name: 'Culture', slug: 'culture', color: '#7c3aed' }, author: { name: 'Nathan Brooks', avatarUrl: 'https://i.pravatar.cc/100?img=11' }, publishedAt: '2026-03-25T09:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=16' },
  { id: '14', title: 'Museums Embrace Digital Art in Post-Pandemic Era', slug: 'museums-digital-art', excerpt: 'Traditional institutions find balance between physical and virtual experiences.', category: { name: 'Culture', slug: 'culture', color: '#7c3aed' }, author: { name: 'Olivia Martinez', avatarUrl: 'https://i.pravatar.cc/100?img=12' }, publishedAt: '2026-03-24T14:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=17' },
  { id: '15', title: 'Chefs Redefine Farm-to-Table Dining', slug: 'chefs-farm-to-table', excerpt: 'Innovative restaurants push sustainability to new heights.', category: { name: 'Culture', slug: 'culture', color: '#7c3aed' }, author: { name: 'Daniel Green', avatarUrl: 'https://i.pravatar.cc/100?img=13' }, publishedAt: '2026-03-23T17:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=18' },
  { id: '16', title: 'The Hidden Costs of Fast Fashion', slug: 'hidden-costs-fast-fashion', excerpt: 'Industry insiders reveal the environmental toll of disposable clothing trends.', category: { name: 'Culture', slug: 'culture', color: '#7c3aed' }, author: { name: 'Alex Turner', avatarUrl: 'https://i.pravatar.cc/100?img=20' }, publishedAt: '2026-03-22T12:00:00Z', readTime: 7, imageUrl: 'https://picsum.photos/600/400?random=25' },
  { id: '17', title: 'Award Season Frontrunners: A Deep Dive', slug: 'award-season-frontrunners', excerpt: 'Industry insiders weigh in on the films generating the most buzz.', category: { name: 'Culture', slug: 'culture', color: '#7c3aed' }, author: { name: 'Emily Watson', avatarUrl: 'https://i.pravatar.cc/100?img=4' }, publishedAt: '2026-03-21T15:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=26' },
  { id: '18', title: 'Plant-Based Proteins Rise in Global Cuisine', slug: 'plant-based-proteins', excerpt: 'From lab-grown meat to ancient grains, the food revolution accelerates.', category: { name: 'Culture', slug: 'culture', color: '#7c3aed' }, author: { name: 'Marco Bellini', avatarUrl: 'https://i.pravatar.cc/100?img=21' }, publishedAt: '2026-03-20T09:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=27' },
  // Tech
  { id: '19', title: 'Quantum Computing Reaches New Milestone', slug: 'quantum-computing-milestone', excerpt: 'Breakthrough promises to revolutionize cryptography and drug discovery.', category: { name: 'Tech', slug: 'tech', color: '#2563eb' }, author: { name: 'Rachel Ng', avatarUrl: 'https://i.pravatar.cc/100?img=14' }, publishedAt: '2026-03-25T04:00:00Z', readTime: 8, imageUrl: 'https://picsum.photos/600/400?random=19' },
  { id: '20', title: 'Cybersecurity Experts Warn of Sophisticated Threats', slug: 'cybersecurity-new-threats', excerpt: 'Nation-state hackers deploy advanced techniques targeting critical infrastructure.', category: { name: 'Tech', slug: 'tech', color: '#2563eb' }, author: { name: 'Kevin Zhang', avatarUrl: 'https://i.pravatar.cc/100?img=15' }, publishedAt: '2026-03-24T20:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=20' },
  { id: '21', title: 'Remote Collaboration Tools Evolve', slug: 'remote-tools-evolve', excerpt: 'Next-generation platforms promise to transform distributed teams.', category: { name: 'Tech', slug: 'tech', color: '#2563eb' }, author: { name: 'Sophie Anderson', avatarUrl: 'https://i.pravatar.cc/100?img=16' }, publishedAt: '2026-03-23T15:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=21' },
  { id: '22', title: 'Silicon Valley Titans Shape AI Legislation', slug: 'silicon-valley-ai-legislation', excerpt: 'Major tech companies deploy lobbying armies as Congress prepares sweeping regulations.', category: { name: 'Tech', slug: 'tech', color: '#2563eb' }, author: { name: 'James Chen', avatarUrl: 'https://i.pravatar.cc/100?img=22' }, publishedAt: '2026-03-22T06:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=28' },
  { id: '23', title: 'Electric Vehicle Sales Surge in Developing Markets', slug: 'ev-sales-surge', excerpt: 'Affordable EV models drive adoption across Southeast Asia and Africa.', category: { name: 'Tech', slug: 'tech', color: '#2563eb' }, author: { name: 'Priya Sharma', avatarUrl: 'https://i.pravatar.cc/100?img=23' }, publishedAt: '2026-03-21T13:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=29' },
  { id: '24', title: 'Space Tourism Industry Faces Regulatory Crossroads', slug: 'space-tourism-regulation', excerpt: 'Lawmakers debate safety standards as commercial flights multiply.', category: { name: 'Tech', slug: 'tech', color: '#2563eb' }, author: { name: 'Lisa Park', avatarUrl: 'https://i.pravatar.cc/100?img=24' }, publishedAt: '2026-03-20T16:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=30' },
];

const categoryMeta: Record<string, { name: string; description: string; color: string }> = {
  politics: { name: 'Politics', description: 'Political news and analysis from Washington and around the world.', color: '#dc2626' },
  economy: { name: 'Economy', description: 'Economic trends, market analysis, and business news.', color: '#059669' },
  culture: { name: 'Culture', description: 'Arts, entertainment, and society coverage.', color: '#7c3aed' },
  tech: { name: 'Technology', description: 'Technology and innovation news.', color: '#2563eb' },
};

const ARTICLES_PER_PAGE = 12;

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  // Derive slug from param or from URL path (e.g., /category/politics → 'politics')
  const slug = categorySlug || location.pathname.split('/').pop() || 'politics';
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const meta = categoryMeta[slug] || categoryMeta.politics;
  const filteredArticles = mockArticles.filter((article) => article.category.slug === slug);
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
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
          <select className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm">
            <option>Sort by: Latest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Most Read</option>
          </select>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => (
            <article key={article.id} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <Link to={`/article/${article.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-white text-slate-900 rounded-full">
                    {article.category.name}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {article.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <img src={article.author.avatarUrl} alt={article.author.name} className="w-6 h-6 rounded-full" />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(article.publishedAt), 'MMM d')}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}m</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium ${
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
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
