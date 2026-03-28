import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, Calendar, Heart, MessageSquare, Share2, Bookmark, Facebook, Twitter, Linkedin, Link as LinkIcon, ChevronRight } from 'lucide-react';
import AdBanner from '../components/ads/AdBanner';

const mockArticle = {
  id: '1',
  title: 'Senate Passes Landmark Climate Legislation',
  slug: 'senate-passes-landmark-climate-legislation',
  excerpt: 'In a historic bipartisan vote, the Senate approved sweeping climate measures aimed at reducing carbon emissions by 50% by 2030.',
  content: `In a historic bipartisan vote, the Senate approved sweeping climate measures aimed at reducing carbon emissions by 50% by 2030. The legislation, which passed 62-38, represents the most significant climate action taken by Congress in decades.

The bill includes provisions for renewable energy tax incentives, electric vehicle credits, and funding for climate resilience infrastructure. Supporters hailed the measure as a crucial step toward addressing the climate crisis, while critics argued it did not go far enough.

The legislation now moves to the House, where its fate remains uncertain. Speaker Johnson has indicated the House will take up the measure "when the time is right," without committing to a specific timeline.

> "This is the most significant climate action Congress has taken in a generation," said Sen. Jane Doe (D-CA), the bill's primary sponsor. "We're finally treating this crisis with the urgency it deserves."

## Key Provisions

The legislation includes several major provisions:

- **Renewable Energy**: 10-year extension of tax credits for solar, wind, and geothermal energy
- **Electric Vehicles**: Expanded tax credits up to $12,500 for qualifying EVs
- **Climate Resilience**: $50 billion for infrastructure improvements in vulnerable communities
- **Emissions Targets**: Binding reduction targets for major industries

## Industry Response

The reaction from industry has been mixed. Renewable energy companies have praised the extended tax credits, while some manufacturing groups have expressed concern about the binding emissions targets.

Environmental organizations have largely welcomed the legislation, though some note that the binding targets may not go far enough to meet the Paris Agreement goals.

The bill now heads to the House, where it faces an uncertain future. Several moderate House members have already expressed reservations about certain provisions.`,
  coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=2070',
  category: { name: 'Politics', slug: 'politics', color: '#dc2626' },
  author: { name: 'Sarah Chen', username: 'sarahchen', avatarUrl: 'https://i.pravatar.cc/100?img=1', bio: 'Senior political analyst covering Washington D.C. and global policy.' },
  publishedAt: '2026-03-25T08:00:00Z',
  readTime: 8,
  tags: ['Breaking News', 'Climate'],
};

const relatedArticles = [
  { id: '2', title: 'Election Reform Bills Gain Bipartisan Support', slug: 'election-reform-bills', category: { name: 'Politics' }, imageUrl: 'https://picsum.photos/600/400?random=2' },
  { id: '3', title: 'Defense Budget Debates Heat Up in Capitol', slug: 'defense-budget-debates', category: { name: 'Politics' }, imageUrl: 'https://picsum.photos/600/400?random=3' },
  { id: '4', title: 'International Trade Agreements Face Scrutiny', slug: 'international-trade-agreements', category: { name: 'Politics' }, imageUrl: 'https://picsum.photos/600/400?random=4' },
];

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [readProgress, setReadProgress] = useState(0);
  const [likes] = useState(42);

  // Reading progress
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    setReadProgress(Math.min(100, progress));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 z-50">
        <div
          className="h-full bg-red-600 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Floating Share Bar */}
      <div className="fixed left-8 top-1/3 z-40 hidden xl:flex flex-col gap-2">
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="Share on Twitter" title="Share on Twitter">
          <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
        </button>
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="Share on Facebook" title="Share on Facebook">
          <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
        </button>
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="Share on LinkedIn" title="Share on LinkedIn">
          <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
        </button>
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="Copy Link" title="Copy Link">
          <LinkIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
        </button>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-24 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/politics" className="hover:text-slate-900 dark:hover:text-white">{mockArticle.category.name}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white line-clamp-1">{mockArticle.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-4"
            style={{ backgroundColor: mockArticle.category.color }}
          >
            {mockArticle.category.name}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {mockArticle.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">{mockArticle.excerpt}</p>

          {/* Author & Meta */}
          <div className="flex items-center justify-between">
            <Link to={`/author/${mockArticle.author.username}`} className="flex items-center gap-4">
              <img src={mockArticle.author.avatarUrl} alt={mockArticle.author.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{mockArticle.author.name}</p>
                <p className="text-sm text-slate-500">{mockArticle.author.bio}</p>
              </div>
            </Link>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(new Date(mockArticle.publishedAt), 'MMM d, yyyy')}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{mockArticle.readTime} min read</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <figure className="mb-10">
          <img src={mockArticle.coverImage} alt={mockArticle.title} className="w-full aspect-[21/9] object-cover rounded-2xl" />
        </figure>

        {/* Article Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {mockArticle.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('> ')) {
              return <blockquote key={index} className="border-l-4 border-red-600 pl-6 py-2 my-6 italic text-slate-700 dark:text-slate-300">{paragraph.replace('> ', '')}</blockquote>;
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(line => line.startsWith('- '));
              return (
                <ul key={index} className="list-disc list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">
                  {items.map((item, i) => <li key={i}>{item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>)}
                </ul>
              );
            }
            return (
              <Fragment key={index}>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{paragraph}</p>
                {index === 2 && <AdBanner slot="article-inline" format="article" className="my-8" />}
              </Fragment>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          {mockArticle.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <button aria-label="Like article" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <Heart className="w-5 h-5" aria-hidden="true" /> <span aria-hidden="true">{likes}</span>
            </button>
            <button aria-label="Comment on article" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <MessageSquare className="w-5 h-5" aria-hidden="true" /> <span aria-hidden="true">12</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Bookmark article" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <Bookmark className="w-5 h-5" aria-hidden="true" />
            </button>
            <button aria-label="Share article" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

      </article>

      {/* Ad Banner: Before Related Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="article-bottom" format="horizontal" className="my-8" />
      </div>

      {/* Related Articles */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <Link key={article.id} to={`/article/${article.slug}`} className="group">
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">{article.category.name}</span>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
