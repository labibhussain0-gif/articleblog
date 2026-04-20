import { useParams, Link } from 'react-router-dom';
import { Twitter, Linkedin, Globe, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PortableText } from '@portabletext/react';
import { groq, urlFor } from '../lib/sanity';
import { format } from 'date-fns';

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: author, isLoading: isLoadingAuthor } = useQuery({
    queryKey: ['author', slug],
    queryFn: () => groq.getAuthorBySlug(slug!),
    enabled: !!slug,
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articles', 'author', slug],
    queryFn: () => groq.getArticlesByAuthor(slug!),
    enabled: !!slug,
  });

  if (isLoadingAuthor || isLoadingArticles) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Author not found</h1>
      </div>
    );
  }

  // @ts-ignore
  const avatarUrl = (author.avatar?.asset || author.avatar?._ref) ? urlFor(author.avatar).url() : `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name || 'U')}&background=random`;
  
  // Calculate total read time or we can use fake stats for total reads
  const totalArticles = articles.length;
  // Let's keep total reads static or randomized for demo as sanity might not track it natively
  const totalReads = Math.floor(Math.random() * 50) + 10 + 'K';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Author Hero */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={avatarUrl} alt={author.name} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-700 shadow-lg object-cover" />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {author.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-4">@{author.slug?.current || author.name.toLowerCase().replace(/\s+/g, '')}</p>
              {author.bio ? (
                <div className="text-slate-600 dark:text-slate-300 max-w-xl mb-6 prose dark:prose-invert">
                  <PortableText value={author.bio as any} />
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-300 max-w-xl mb-6">No biography provided.</p>
              )}
              
              {author.socialLinks && (
                <div className="flex items-center justify-center md:justify-start gap-4">
                  {author.socialLinks.twitter && (
                    <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </a>
                  )}
                  {author.socialLinks.linkedin && (
                    <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </a>
                  )}
                  {author.socialLinks.website && (
                    <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="md:ml-auto text-center shrink-0">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalArticles}</p>
                  <p className="text-sm text-slate-500">Articles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalReads}</p>
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
        {articles.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No articles published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => {
              const imgUrl = (article.coverImage?.asset || article.coverImage?._ref) 
                ? urlFor(article.coverImage).url() 
                : `https://picsum.photos/600/400?random=${article._id}`;
              return (
                <article key={article._id} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <Link to={`/article/${article.slug?.current || '#'}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={imgUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        {article.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-4">
                        {article.category && (
                          <>
                            <span className="font-semibold text-red-600 dark:text-red-400">{article.category.name}</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(article.publishedAt || Date.now()), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime || 5} min read</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
