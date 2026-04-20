import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PortableText } from '@portabletext/react';
import { groq } from '../lib/sanity';

export default function StaticPage() {
  const { slug } = useParams<{ slug: string }>();

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

  const pageUrl = `https://articleblogwebsite.web.app/${slug}`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Helmet>
        <title>{page.title} | The Daily Pulse</title>
        <meta name="description" content={page.description || `Read about ${page.title}`} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <PortableText value={page.body} />
          </div>
        )}
      </div>
    </div>
  );
}
