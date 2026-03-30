import { useState, useEffect, Fragment } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, Calendar, Heart, MessageSquare, Share2, Bookmark, Facebook, Twitter, Linkedin, Link as LinkIcon, ChevronRight, Loader2 } from 'lucide-react';
import AdBanner from '../components/ads/AdBanner';
import { useQuery } from '@tanstack/react-query';
import { PortableText } from '@portabletext/react';
import { groq, urlFor } from '../lib/sanity';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [readProgress, setReadProgress] = useState(0);
  const [likes] = useState(42);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => slug ? groq.getArticleBySlug(slug) : Promise.resolve(null),
    enabled: !!slug,
  });

  const { data: relatedArticles = [] } = useQuery({
    queryKey: ['relatedArticles', article?.category?.slug?.current],
    queryFn: () => article?.category?.slug?.current 
      ? groq.getArticlesByCategory(article.category.slug.current) 
      : Promise.resolve([]),
    enabled: !!article?.category?.slug?.current,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !article) {
    return <Navigate to="/" replace />;
  }

  // Filter out the current article from related articles
  const filteredRelated = relatedArticles.filter(a => a._id !== article._id).slice(0, 3);
  
  const coverImageUrl = (article.coverImage?.asset || article.coverImage?._ref) ? urlFor(article.coverImage).url() : undefined;
  const authorAvatarUrl = (article.author?.avatar?.asset || article.author?.avatar?._ref) ? urlFor(article.author.avatar).url() : `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.name || 'U')}&background=random`;
  
  const portableTextComponents = {
    block: {
      h1: ({children}: any) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
      h2: ({children}: any) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
      h3: ({children}: any) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
      h4: ({children}: any) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
      normal: ({children}: any) => <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{children}</p>,
      blockquote: ({children}: any) => <blockquote className="border-l-4 border-red-600 pl-6 py-2 my-6 italic text-slate-700 dark:text-slate-300">{children}</blockquote>,
    },
    list: {
      bullet: ({children}: any) => <ul className="list-disc list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ul>,
      number: ({children}: any) => <ol className="list-decimal list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ol>,
    },
  };

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
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow" title="Share on Twitter">
          <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow" title="Share on Facebook">
          <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow" title="Share on LinkedIn">
          <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow" title="Copy Link">
          <LinkIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-24 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4" />
          {article.category && (
            <>
              <Link to={`/category/${article.category.slug?.current || '#'}`} className="hover:text-slate-900 dark:hover:text-white">{article.category.name}</Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-slate-900 dark:text-white line-clamp-1">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          {article.category && (
            <span
              className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-4"
              style={{ backgroundColor: article.category.color || '#3b82f6' }}
            >
              {article.category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {article.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">{article.excerpt}</p>

          {/* Author & Meta */}
          <div className="flex items-center justify-between">
            <Link to={`/author/${article.author?.slug?.current || '#'}`} className="flex items-center gap-4">
              <img src={authorAvatarUrl} alt={article.author?.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{article.author?.name}</p>
              </div>
            </Link>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(new Date(article.publishedAt || Date.now()), 'MMM d, yyyy')}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readingTime || 5} min read</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {coverImageUrl && (
          <figure className="mb-10">
            <img src={coverImageUrl} alt={article.title} className="w-full aspect-[21/9] object-cover rounded-2xl" />
          </figure>
        )}

        {/* Article Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {article.body ? (
            <PortableText value={article.body} components={portableTextComponents} />
          ) : (
             <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{article.excerpt}</p>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            {article.tags.map((tag: any) => (
              <span key={tag._id || tag.name} className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Heart className="w-5 h-5" /> <span>{likes}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <MessageSquare className="w-5 h-5" /> <span>12</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

      </article>

      {/* Ad Banner: Before Related Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="article-bottom" format="horizontal" className="my-12" />
      </div>

      {/* Related Articles */}
      {filteredRelated.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-800/50 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRelated.map((relatedArticle: any) => {
                const imgUrl = (relatedArticle.coverImage?.asset || relatedArticle.coverImage?._ref) 
                  ? urlFor(relatedArticle.coverImage).url() 
                  : `https://picsum.photos/600/400?random=${relatedArticle._id}`;
                return (
                  <Link key={relatedArticle._id} to={`/article/${relatedArticle.slug?.current || '#'}`} className="group relative">
                    <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4">
                      <img
                        src={imgUrl}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {relatedArticle.category && (
                      <span className="text-red-600 dark:text-red-400 font-semibold text-sm mb-2 block">
                        {relatedArticle.category.name}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
