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
  
  const articles = await sanityClient.fetch(`*[_type == "article" && status == "published"] { slug, publishedAt }`);
  const categories = await sanityClient.fetch(`*[_type == "category"] { slug }`);
  const authors = await sanityClient.fetch(`*[_type == "author"] { slug }`);

  const xmlLines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  ];

  // Static routes
  const staticRoutes = [
    { url: '/', priority: 1.0 },
    { url: '/about', priority: 0.5 },
    { url: '/contact', priority: 0.5 },
  ];

  for (const route of staticRoutes) {
    xmlLines.push(
      `  <url>\n` +
      `    <loc>${SITE_URL}${route.url}</loc>\n` +
      `    <changefreq>daily</changefreq>\n` +
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
    }
    urlBlock += `    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    xmlLines.push(urlBlock);
  }

  // Categories
  for (const category of categories) {
    if (!category.slug?.current) continue;
    xmlLines.push(
      `  <url>\n` +
      `    <loc>${SITE_URL}/category/${category.slug.current}</loc>\n` +
      `    <changefreq>weekly</changefreq>\n` +
      `    <priority>0.6</priority>\n` +
      `  </url>`
    );
  }

  // Authors
  for (const author of authors) {
    if (!author.slug?.current) continue;
    xmlLines.push(
      `  <url>\n` +
      `    <loc>${SITE_URL}/author/${author.slug.current}</loc>\n` +
      `    <changefreq>monthly</changefreq>\n` +
      `    <priority>0.5</priority>\n` +
      `  </url>`
    );
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
