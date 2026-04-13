import { Helmet } from 'react-helmet-async';
import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FeaturedCard from '../components/cards/FeaturedCard';
import StandardCard from '../components/cards/StandardCard';
import CompactCard from '../components/cards/CompactCard';
import { ArrowRight, Mail, Loader2 } from 'lucide-react';
import AdBanner from '../components/ads/AdBanner';
import { groq, urlFor } from '../lib/sanity';
import { subscribeEmail } from '../lib/firebase';

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Daily Pulse",
  "url": "https://articleblogwebsite.web.app",
  "logo": "https://articleblogwebsite.web.app/apple-touch-icon.png",
  "sameAs": [
    "https://twitter.com/thedailypulse",
    "https://facebook.com/thedailypulse"
  ]
};

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      try {
        await subscribeEmail(email, 'homepage');
      } catch (error) {
        console.error('Failed to subscribe:', error);
      } finally {
        setIsSubmitting(false);
      }
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
        aria-label="Email address for daily briefing"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50 disabled:opacity-50"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors text-sm disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
      </button>
    </form>
  );
}

export default function HomePage() {
  const { data: articles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: groq.getAllArticles,
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: groq.getAllCategories,
  });

  if (loadingArticles || loadingCategories) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const mapArticle = (a: any) => ({
    id: a._id,
    slug: a.slug?.current || 'untitled',
    title: a.title || 'Untitled Article',
    excerpt: a.excerpt || 'No excerpt available.',
    category: { 
      name: a.category?.name || 'Uncategorized', 
      color: a.category?.color || '#3b82f6' 
    },
    author: { 
      name: a.author?.name || 'The Daily Pulse Team', 
      avatarUrl: (a.author?.avatar?.asset || a.author?.avatar?._ref) 
        ? urlFor(a.author.avatar).url() 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(a.author?.name || 'U')}&background=random` 
    },
    publishedAt: a.publishedAt || new Date().toISOString(),
    readTime: a.readingTime || 5,
    imageUrl: (a.coverImage?.asset || a.coverImage?._ref) 
      ? urlFor(a.coverImage).url() 
      : `https://picsum.photos/1200/600?random=${a._id}`,
  });

  const mappedArticles = articles.map(mapArticle);

  const featuredArticle = mappedArticles[0];
  const latestArticles = mappedArticles.slice(1, 4);
  const noteworthyReads = mappedArticles.slice(4, 9);
  
  const categorySections = categories.map(cat => {
    if (!cat || !cat.name) return null;
    const catArticles = mappedArticles.filter(a => a.category?.name === cat.name).slice(0, 3);
    return {
      name: cat.name,
      href: `/category/${cat.slug?.current || cat.name.toLowerCase()}`,
      articles: catArticles
    };
  }).filter((section): section is any => section !== null && section.articles.length > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Helmet>
        <title>The Daily Pulse | Breaking News, Analysis & Culture</title>
        <meta name="description" content="The Daily Pulse delivers breaking news, in-depth analysis, and cultural coverage. Your trusted source for today's stories that matter." />
        <meta property="og:title" content="The Daily Pulse | Breaking News, Analysis & Culture" />
        <meta property="og:description" content="The Daily Pulse delivers breaking news, in-depth analysis, and cultural coverage." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section: Featured + Latest */}
        {featuredArticle && (
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
        )}

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
          <Fragment key={section.name}>
            <section className="mb-12">
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
              <section className="mb-12">
                <AdBanner slot="home-category-middle" format="horizontal" />
              </section>
            )}
          </Fragment>
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
