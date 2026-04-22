interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
  canonicalOverride?: string;
}

import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title = 'The Daily Pulse',
  description = 'The Daily Pulse delivers breaking news, in-depth analysis, and cultural coverage.',
  image = 'https://articleblogwebsite.web.app/apple-touch-icon.png',
  url = '',
  type = 'website',
  publishedTime,
  author,
  noindex,
  canonicalOverride,
}: SEOHeadProps) {
  const fullTitle = title === 'The Daily Pulse' ? title : `${title} | The Daily Pulse`;
  const truncatedDesc = description.length > 160 ? description.substring(0, 157) + '...' : description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={truncatedDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="The Daily Pulse" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={image} />
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      {url && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalOverride && <link rel="canonical" href={canonicalOverride} />}
    </Helmet>
  );
}
