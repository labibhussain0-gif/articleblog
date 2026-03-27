import { useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturedCard from '../components/cards/FeaturedCard';
import StandardCard from '../components/cards/StandardCard';
import CompactCard from '../components/cards/CompactCard';
import { ArrowRight, Mail } from 'lucide-react';
import AdBanner from '../components/ads/AdBanner';

const featuredArticle = {
  id: '1',
  slug: 'breaking-global-summit-2026',
  title: 'World Leaders Convene for Historic Climate Summit in Geneva',
  excerpt: 'Heads of state from 195 nations gather to finalize binding emissions targets, marking a pivotal moment in the fight against climate change.',
  category: { name: 'Politics' },
  author: { name: 'Sarah Mitchell', avatarUrl: 'https://i.pravatar.cc/100?img=1' },
  publishedAt: '2026-03-25T08:00:00Z',
  readTime: 8,
  imageUrl: 'https://picsum.photos/1200/600?random=1',
};

const latestArticles = [
  {
    id: '2',
    slug: 'tech-giants-ai-regulation',
    title: 'Silicon Valley Titans Scramble to Shape AI Legislation',
    excerpt: 'Major tech companies deploy lobbying armies as Congress prepares sweeping artificial intelligence regulations.',
    category: { name: 'Tech' },
    author: { name: 'James Chen', avatarUrl: 'https://i.pravatar.cc/100?img=2' },
    publishedAt: '2026-03-25T06:30:00Z',
    readTime: 6,
    imageUrl: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: '3',
    slug: 'fed-interest-rates',
    title: 'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
    excerpt: 'Markets rally as Fed chair hints at policy shift in response to cooling inflation data.',
    category: { name: 'Economy' },
    author: { name: 'Maria Rodriguez', avatarUrl: 'https://i.pravatar.cc/100?img=3' },
    publishedAt: '2026-03-24T15:00:00Z',
    readTime: 5,
    imageUrl: 'https://picsum.photos/600/400?random=3',
  },
  {
    id: '4',
    slug: 'oscars-nominations-preview',
    title: "Award Season Frontrunners: A Deep Dive Into This Year's Contenders",
    excerpt: 'Industry insiders weigh in on the films and performances generating the most buzz.',
    category: { name: 'Culture' },
    author: { name: 'Emily Watson', avatarUrl: 'https://i.pravatar.cc/100?img=4' },
    publishedAt: '2026-03-24T12:00:00Z',
    readTime: 7,
    imageUrl: 'https://picsum.photos/600/400?random=4',
  },
];

const noteworthyReads = [
  { id: '5', slug: 'article-5', title: 'The Hidden Costs of Fast Fashion', category: { name: 'Culture' }, author: { name: 'Alex Turner' }, publishedAt: '2026-03-24T10:00:00Z', readTime: 4 },
  { id: '6', slug: 'article-6', title: 'Electric Vehicle Sales Surge in Developing Markets', category: { name: 'Tech' }, author: { name: 'Priya Sharma' }, publishedAt: '2026-03-23T14:00:00Z', readTime: 5 },
  { id: '7', slug: 'article-7', title: 'Central Bank Digital Currencies Gain Momentum', category: { name: 'Economy' }, author: { name: 'David Kim' }, publishedAt: '2026-03-23T09:00:00Z', readTime: 6 },
  { id: '8', slug: 'article-8', title: 'Space Tourism Industry Faces Regulatory Crossroads', category: { name: 'Tech' }, author: { name: 'Lisa Park' }, publishedAt: '2026-03-22T16:00:00Z', readTime: 5 },
  { id: '9', slug: 'article-9', title: 'The Rise of Plant-Based Proteins in Global Cuisine', category: { name: 'Culture' }, author: { name: 'Marco Bellini' }, publishedAt: '2026-03-22T11:00:00Z', readTime: 4 },
];

const categorySections = [
  {
    name: 'Politics',
    href: '/category/politics',
    articles: [
      { id: '10', slug: 'article-10', title: 'Election Reform Bills Gain Bipartisan Support', excerpt: 'Rare collaboration emerges as lawmakers seek to address voting access concerns.', category: { name: 'Politics' }, author: { name: 'Robert Hayes', avatarUrl: 'https://i.pravatar.cc/100?img=5' }, publishedAt: '2026-03-25T07:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=10' },
      { id: '11', slug: 'article-11', title: 'International Trade Agreements Face Scrutiny', excerpt: 'New tariffs spark diplomatic tensions among allied nations.', category: { name: 'Politics' }, author: { name: 'Jennifer Cole', avatarUrl: 'https://i.pravatar.cc/100?img=6' }, publishedAt: '2026-03-24T18:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=11' },
      { id: '12', slug: 'article-12', title: 'Defense Budget Debates Heat Up in Capitol', excerpt: 'Lawmakers grapple with modernizing military capabilities.', category: { name: 'Politics' }, author: { name: 'Michael Torres', avatarUrl: 'https://i.pravatar.cc/100?img=7' }, publishedAt: '2026-03-24T13:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=12' },
    ],
  },
  {
    name: 'Economy',
    href: '/category/economy',
    articles: [
      { id: '13', slug: 'article-13', title: 'Tech IPO Market Shows Signs of Revival', excerpt: 'After a prolonged downturn, investors eye promising public offerings.', category: { name: 'Economy' }, author: { name: 'Sandra Liu', avatarUrl: 'https://i.pravatar.cc/100?img=8' }, publishedAt: '2026-03-25T05:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=13' },
      { id: '14', slug: 'article-14', title: 'Global Supply Chains Adapt to New Realities', excerpt: 'Companies prioritize resilience over efficiency in post-pandemic era.', category: { name: 'Economy' }, author: { name: 'Thomas Wright', avatarUrl: 'https://i.pravatar.cc/100?img=9' }, publishedAt: '2026-03-24T11:00:00Z', readTime: 7, imageUrl: 'https://picsum.photos/600/400?random=14' },
      { id: '15', slug: 'article-15', title: 'Housing Market Stabilizes After Volatile Year', excerpt: 'Buyers and sellers find new equilibrium in residential real estate.', category: { name: 'Economy' }, author: { name: 'Amanda Foster', avatarUrl: 'https://i.pravatar.cc/100?img=10' }, publishedAt: '2026-03-23T16:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=15' },
    ],
  },
  {
    name: 'Culture',
    href: '/category/culture',
    articles: [
      { id: '16', slug: 'article-16', title: 'Streaming Wars Intensify With New Content Deals', excerpt: 'Major platforms battle for exclusive programming rights.', category: { name: 'Culture' }, author: { name: 'Nathan Brooks', avatarUrl: 'https://i.pravatar.cc/100?img=11' }, publishedAt: '2026-03-25T09:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=16' },
      { id: '17', slug: 'article-17', title: 'Museums Embrace Digital Art in Post-Pandemic Era', excerpt: 'Traditional institutions find balance between physical and virtual experiences.', category: { name: 'Culture' }, author: { name: 'Olivia Martinez', avatarUrl: 'https://i.pravatar.cc/100?img=12' }, publishedAt: '2026-03-24T14:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=17' },
      { id: '18', slug: 'article-18', title: 'CulinaryScene: Chefs Redefine Farm-to-Table Dining', excerpt: 'Innovative restaurants push sustainability to new heights.', category: { name: 'Culture' }, author: { name: 'Daniel Green', avatarUrl: 'https://i.pravatar.cc/100?img=13' }, publishedAt: '2026-03-23T17:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=18' },
    ],
  },
  {
    name: 'Tech',
    href: '/category/tech',
    articles: [
      { id: '19', slug: 'article-19', title: 'Quantum Computing Reaches New Milestone', excerpt: 'Breakthrough promises to revolutionize cryptography and drug discovery.', category: { name: 'Tech' }, author: { name: 'Rachel Ng', avatarUrl: 'https://i.pravatar.cc/100?img=14' }, publishedAt: '2026-03-25T04:00:00Z', readTime: 8, imageUrl: 'https://picsum.photos/600/400?random=19' },
      { id: '20', slug: 'article-20', title: 'Cybersecurity Experts Warn of Sophisticated New Threats', excerpt: 'Nation-state hackers deploy advanced techniques targeting critical infrastructure.', category: { name: 'Tech' }, author: { name: 'Kevin Zhang', avatarUrl: 'https://i.pravatar.cc/100?img=15' }, publishedAt: '2026-03-24T20:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=20' },
      { id: '21', slug: 'article-21', title: 'The Future of Work: Remote Collaboration Tools Evolve', excerpt: 'Next-generation platforms promise to transform distributed teams.', category: { name: 'Tech' }, author: { name: 'Sophie Anderson', avatarUrl: 'https://i.pravatar.cc/100?img=16' }, publishedAt: '2026-03-23T15:00:00Z', readTime: 5, imageUrl: 'https://picsum.photos/600/400?random=21' },
    ],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm font-medium text-center">
        ✓ Thank you for subscribing!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50"
        required
      />
      <button
        type="submit"
        className="w-full px-4 py-2.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors text-sm"
      >
        Subscribe Now
      </button>
    </form>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section: Featured + Latest */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FeaturedCard article={featuredArticle} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                  Latest Stories
                </h3>
                <div className="space-y-4">
                  {latestArticles.map((article) => (
                    <CompactCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Banner: After Hero */}
        <section className="mb-12">
          <AdBanner slot="home-hero-bottom" format="horizontal" />
        </section>

        {/* Noteworthy Reads Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Noteworthy Reads
                  </h3>
                </div>
                <div className="space-y-3">
                  {noteworthyReads.map((article, index) => (
                    <div key={article.id} className="flex items-start gap-4">
                      <span className="text-3xl font-bold text-slate-200 dark:text-slate-600 w-8">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                          {article.category.name}
                        </span>
                        <Link to={`/article/${article.slug}`}>
                          <h4 className="font-semibold text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2 mt-1">
                            {article.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>{article.author.name}</span>
                          <span>•</span>
                          <span>{article.readTime}m read</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 h-full flex flex-col justify-center">
                <Mail className="w-10 h-10 mb-4 text-slate-400" />
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Get the Daily Briefing
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  The most important stories, delivered to your inbox every morning.
                </p>
                <NewsletterForm />
                <div className="mt-6">
                  <AdBanner slot="home-sidebar-rectangle" format="rectangle" className="mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {categorySections.map((section, i) => (
          <>
            <section key={section.name} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {section.name}
              </h2>
              <Link
                to={section.href}
                className="flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400 hover:gap-2 transition-all"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.articles.map((article) => (
                <StandardCard key={article.id} article={article} />
              ))}
            </div>
          </section>
            {i === 1 && (
              <>
        {/* Ad Banner: Between Category Sections */}
        <section className="mb-12">
          <AdBanner slot="home-category-middle" format="horizontal" />
        </section>
              </>
            )}
          </>
        ))}

        {/* Editor's Picks */}
        <section className="mb-12">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 text-xs font-semibold bg-amber-500 text-slate-900 rounded-full uppercase tracking-wide">
                Investigation
              </span>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                Editor's Picks
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3">
                    <img
                      src={article.imageUrl || 'https://picsum.photos/600/400'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">
                    {article.category.name}
                  </span>
                  <h3
                    className="font-bold text-white group-hover:text-amber-400 transition-colors mt-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {article.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
