import { Helmet } from 'react-helmet-async';
import { useState, useEffect, Fragment } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, Calendar, Heart, MessageSquare, Share2, Bookmark, ChevronRight, Loader2 } from 'lucide-react';
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
      h2: ({children}: any) => <h2 className="text-2xl font-bold mt-10 mb-4 pt-6 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">{children}</h2>,
      h3: ({children}: any) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
      h4: ({children}: any) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
      normal: ({children}: any) => <p className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-[1.875] mb-6">{children}</p>,
      blockquote: ({children}: any) => <blockquote className="border-l-4 border-red-600 pl-6 py-2 my-6 italic text-slate-700 dark:text-slate-300">{children}</blockquote>,
    },
    types: {
      image: ({ value }: any) => {
        const src = (value?.asset || value?._ref) ? urlFor(value).url() : null;
        if (!src) return null;
        return (
          <figure className="my-8">
            <img
              src={src}
              alt={value?.alt || ''}
              className="w-full rounded-xl object-cover"
            />
            {value?.caption && (
              <figcaption className="mt-2 text-sm text-center text-slate-500 dark:text-slate-400 italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
    marks: {
      link: ({value, children}: any) => (
        <a href={value?.href} target="_blank" rel="noopener noreferrer" 
           className="text-red-600 dark:text-red-400 hover:underline font-medium">
          {children}
        </a>
      ),
      strong: ({children}: any) => <strong className="font-bold">{children}</strong>,
      em: ({children}: any) => <em className="italic">{children}</em>,
    },
    list: {
      bullet: ({children}: any) => <ul className="list-disc list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ul>,
      number: ({children}: any) => <ol className="list-decimal list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ol>,
    },
  };

  const articleUrl = `https://articleblogwebsite.web.app/article/${article.slug?.current}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "headline": article.title,
    "description": article.excerpt || article.title,
    "image": coverImageUrl || "",
    "author": {
      "@type": "Person",
      "name": article.author?.name || 'Unknown'
    },
    "datePublished": article.publishedAt || new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "The Daily Pulse",
      "logo": {
        "@type": "ImageObject",
        "url": "https://articleblogwebsite.web.app/apple-touch-icon.png"
      }
    }
  };

  let faqJsonLd = null;
  let parsedFaqs = [];
  if (article.faq && Array.isArray(article.faq) && article.faq.length > 0) {
    parsedFaqs = article.faq;
  } else if (article.body && Array.isArray(article.body)) {
    let currentQuestion = null;
    let currentAnswer = '';
    for (const block of article.body) {
      if (block._type !== 'block') continue;
      const text = block.children?.map((c: any) => c.text).join('') || '';
      
      if ((block.style === 'h2' || block.style === 'h3' || block.style === 'h4') && text.trim().endsWith('?')) {
        if (currentQuestion && currentAnswer) parsedFaqs.push({ question: currentQuestion, answer: currentAnswer.trim() });
        currentQuestion = text.trim();
        currentAnswer = '';
      } else if (currentQuestion && block.style === 'normal') {
        currentAnswer += text + '\n';
      } else if (currentQuestion && (block.style === 'h2' || block.style === 'h3' || block.style === 'h4')) {
        if (currentAnswer) parsedFaqs.push({ question: currentQuestion, answer: currentAnswer.trim() });
        currentQuestion = null;
        currentAnswer = '';
      }
    }
    if (currentQuestion && currentAnswer) parsedFaqs.push({ question: currentQuestion, answer: currentAnswer.trim() });
  }

  if (parsedFaqs.length > 0) {
    faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": parsedFaqs.map((q: any) => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Helmet>
        <title>{article.title} | The Daily Pulse</title>
        <meta name="description" content={article.excerpt || article.title} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        {coverImageUrl && <meta property="og:image" content={coverImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || article.title} />
        {coverImageUrl && <meta name="twitter:image" content={coverImageUrl} />}
        <script type="application/ld+json">
          {JSON.stringify(articleJsonLd)}
        </script>
        {faqJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(faqJsonLd)}
          </script>
        )}
      </Helmet>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 z-50">
        <div
          className="h-full bg-red-600 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 xl:gap-14">
          <article>
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
            <img
              src={coverImageUrl}
              alt={article.coverImage?.alt || article.title}
              className="w-full aspect-[16/9] object-cover rounded-xl"
            />
            {article.coverImage?.caption && (
              <figcaption className="mt-2 text-sm text-center text-slate-500 dark:text-slate-400 italic">
                {article.coverImage.caption}
              </figcaption>
            )}
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

        {/* Explicit FAQs */}
        {article.faq && Array.isArray(article.faq) && article.faq.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {article.faq.map((faq: any, index: number) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
            <button aria-label={`${likes} Likes`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Heart className="w-5 h-5" /> <span aria-hidden="true">{likes}</span>
            </button>
            <button aria-label="12 Comments" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <MessageSquare className="w-5 h-5" /> <span aria-hidden="true">12</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Bookmark article" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button aria-label="Share article" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

          </article>

          {/* RIGHT: Sidebar (hidden on mobile) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Ad slot */}
              <AdBanner slot="article-sidebar" format="horizontal" />

              {/* Related Articles — compact list */}
              {filteredRelated.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    Related
                  </h3>
                  <ul className="space-y-4">
                    {filteredRelated.map((r: any) => {
                      const rImg = (r.coverImage?.asset || r.coverImage?._ref)
                        ? urlFor(r.coverImage).width(160).height(112).url()
                        : `https://picsum.photos/160/112?random=${r._id}`;
                      return (
                        <li key={r._id}>
                          <Link to={`/article/${r.slug?.current || '#'}`} className="group flex gap-3">
                            <img src={rImg} alt={r.title} className="w-20 h-14 object-cover rounded flex-shrink-0" />
                            <p className="text-sm font-semibold line-clamp-3 group-hover:text-red-600 transition-colors text-slate-700 dark:text-slate-300">
                              {r.title}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Tags cloud */}
              {article.tags && article.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: any) => (
                      <span key={tag._id || tag.name} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>

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
