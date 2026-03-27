interface SchemaMarkupProps {
  type?: 'website' | 'article';
  articleTitle?: string;
  articleDescription?: string;
  articlePublishedTime?: string;
  articleAuthor?: string;
  articleImage?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function SchemaMarkup({
  type = 'website',
  articleTitle,
  articleDescription,
  articlePublishedTime,
  articleAuthor,
  articleImage,
  breadcrumbs = [],
}: SchemaMarkupProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Daily Pulse',
    url: 'https://thedailypulse.com',
    logo: { '@type': 'ImageObject', url: 'https://thedailypulse.com/logo.png' },
    sameAs: [
      'https://twitter.com/thedailypulse',
      'https://facebook.com/thedailypulse',
      'https://instagram.com/thedailypulse',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Daily Pulse',
    url: 'https://thedailypulse.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://thedailypulse.com/search?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  } : null;

  const articleSchema = type === 'article' && articleTitle ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: articleTitle,
    description: articleDescription,
    image: articleImage,
    datePublished: articlePublishedTime,
    author: { '@type': 'Person', name: articleAuthor || 'The Daily Pulse' },
    publisher: { '@type': 'Organization', name: 'The Daily Pulse', logo: { '@type': 'ImageObject', url: 'https://thedailypulse.com/logo.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://thedailypulse.com' },
  } : null;

  const schemas = [organizationSchema, websiteSchema, breadcrumbSchema, articleSchema].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
