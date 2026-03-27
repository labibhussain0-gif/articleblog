import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Globe } from 'lucide-react';

const mockAuthor = {
  name: 'Sarah Chen',
  username: 'sarahchen',
  bio: 'Senior political analyst covering Washington D.C. and global policy. Former NYT columnist. Award-winning journalist with 15 years of experience in political reporting.',
  avatarUrl: 'https://i.pravatar.cc/200?img=1',
  socialLinks: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', website: 'https://example.com' },
};

const mockArticles = [
  { id: '1', title: 'Senate Passes Landmark Climate Legislation', slug: 'senate-passes-landmark-climate-legislation', excerpt: 'In a historic bipartisan vote, the Senate approved sweeping climate measures.', category: { name: 'Politics' }, publishedAt: '2026-03-25T08:00:00Z', readTime: 8, imageUrl: 'https://picsum.photos/600/400?random=1' },
  { id: '2', title: 'Election Reform Bills Gain Bipartisan Support', slug: 'election-reform-bills', excerpt: 'Rare collaboration emerges as lawmakers seek to address voting access concerns.', category: { name: 'Politics' }, publishedAt: '2026-03-24T14:00:00Z', readTime: 6, imageUrl: 'https://picsum.photos/600/400?random=2' },
  { id: '3', title: 'Defense Budget Debates Heat Up in Capitol', slug: 'defense-budget-debates', excerpt: 'Lawmakers grapple with modernizing military capabilities.', category: { name: 'Politics' }, publishedAt: '2026-03-22T11:00:00Z', readTime: 4, imageUrl: 'https://picsum.photos/600/400?random=4' },
];

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Author Hero */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={mockAuthor.avatarUrl} alt={mockAuthor.name} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-700 shadow-lg" />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {mockAuthor.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-4">@{mockAuthor.username}</p>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl mb-6">{mockAuthor.bio}</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                {mockAuthor.socialLinks.twitter && (
                  <a href={mockAuthor.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </a>
                )}
                {mockAuthor.socialLinks.linkedin && (
                  <a href={mockAuthor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </a>
                )}
                {mockAuthor.socialLinks.website && (
                  <a href={mockAuthor.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </a>
                )}
              </div>
            </div>
            <div className="md:ml-auto text-center">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockArticles.length}</p>
                  <p className="text-sm text-slate-500">Articles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">24.5K</p>
                  <p className="text-sm text-slate-500">Total Reads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Published Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArticles.map((article) => (
            <article key={article.id} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <Link to={`/article/${article.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {article.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                    <span>{article.category.name}</span>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
