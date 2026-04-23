import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

// Use environment variable or fallback to firebase hosting domain
const SITE_URL = process.env.SITE_URL || 'https://articleblogwebsite.web.app';

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'r9p19ugf',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2026-03-25',
  useCdn: true,
  perspective: 'published',
});

async function generateSitemap() {
  console.log('[Sitemap] Fetching data for sitemap...');
  
  const articles = await sanityClient.fetch(`*[_type == "article" && status == "published"] { title, slug, publishedAt }`);
  const categories = await sanityClient.fetch(`*[_type == "category"] { 
    slug, 
    "latestArticleDate": *[_type == "article" && category._ref == ^._id && status == "published"] | order(publishedAt desc)[0].publishedAt 
  }`);
  const authors = await sanityClient.fetch(`*[_type == "author"] { 
    slug, 
    "latestArticleDate": *[_type == "article" && author._ref == ^._id && status == "published"] | order(publishedAt desc)[0].publishedAt 
  }`);

  const xmlLines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`
  ];

  // Static routes
  const staticRoutes = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/about', priority: 0.5, changefreq: 'monthly' },
    { url: '/contact', priority: 0.5, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { url: '/terms', priority: 0.3, changefreq: 'yearly' },
    { url: '/cookies', priority: 0.3, changefreq: 'yearly' },
  ];

  for (const route of staticRoutes) {
    xmlLines.push(
      `  <url>\n` +
      `    <loc>${SITE_URL}${route.url}</loc>\n` +
      `    <changefreq>${route.changefreq}</changefreq>\n` +
      `    <priority>${route.priority}</priority>\n` +
      `  </url>`
    );
  }

  // Articles
  for (const article of articles) {
    if (!article.slug?.current) continue;
    let urlBlock = `  <url>\n    <loc>${SITE_URL}/article/${article.slug.current}</loc>\n`;
    if (article.publishedAt) {
      urlBlock += `    <lastmod>${new Date(article.publishedAt).toISOString()}</lastmod>\n`;

      // Escape title for XML
      const escapedTitle = (article.title || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      urlBlock += `    <news:news>\n`;
      urlBlock += `      <news:publication>\n`;
      urlBlock += `        <news:name>The Daily Pulse</news:name>\n`;
      urlBlock += `        <news:language>en</news:language>\n`;
      urlBlock += `      </news:publication>\n`;
      urlBlock += `      <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>\n`;
      urlBlock += `      <news:title>${escapedTitle}</news:title>\n`;
      urlBlock += `    </news:news>\n`;
    }
    urlBlock += `    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    xmlLines.push(urlBlock);
  }

  // Categories
  for (const category of categories) {
    if (!category.slug?.current) continue;
    let catBlock = `  <url>\n    <loc>${SITE_URL}/category/${category.slug.current}</loc>\n`;
    if (category.latestArticleDate) {
      catBlock += `    <lastmod>${new Date(category.latestArticleDate).toISOString()}</lastmod>\n`;
    }
    catBlock += `    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
    xmlLines.push(catBlock);
  }

  // Authors
  for (const author of authors) {
    if (!author.slug?.current) continue;
    let authBlock = `  <url>\n    <loc>${SITE_URL}/author/${author.slug.current}</loc>\n`;
    if (author.latestArticleDate) {
      authBlock += `    <lastmod>${new Date(author.latestArticleDate).toISOString()}</lastmod>\n`;
    }
    authBlock += `    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`;
    xmlLines.push(authBlock);
  }

  xmlLines.push(`</urlset>`);

  const xml = xmlLines.join('\n') + '\n';

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  
  console.log(`[Sitemap] Sitemap generated at ${sitemapPath}`);
}

generateSitemap().catch(console.error);
