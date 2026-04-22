import { useLocation, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PortableText } from '@portabletext/react';
import { groq } from '../lib/sanity';
import { portableTextComponents } from '../components/PortableTextComponents';

const SITE_URL = 'https://articleblogwebsite.web.app';

export default function StaticPage() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop();

  const { data: page, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => slug ? groq.getPageBySlug(slug) : Promise.resolve(null),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!page) {
    return <Navigate to="/" replace />;
  }

const pageUrl = `${SITE_URL}/${slug}`;
  const pageTitle = `${page.title} | The Daily Pulse`;
  const pageDescription = page.description || `Read about ${page.title} on The Daily Pulse.`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Helmet>
<title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white">{page.title}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          {page.title}
        </h1>
        {page.description && (
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            {page.description}
          </p>
        )}
        {page.body && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText value={page.body} components={portableTextComponents} />
          </div>
        )}
      </div>
    </div>
  );
}
