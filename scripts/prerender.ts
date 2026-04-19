import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import urlBuilder from '@sanity/image-url';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { toHTML } from '@portabletext/to-html';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

// Updated SITE_URL to point to production
const SITE_URL = process.env.SITE_URL || 'https://articleblogwebsite.web.app';

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'r9p19ugf',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2026-03-25',
  useCdn: true,
  perspective: 'published',
});

const builder = urlBuilder(sanityClient);
function urlFor(source: any) {
  if (!source || !source.asset) return null;
  return builder.image(source).url();
}

async function fetchSanityData() {
  const articles = await sanityClient.fetch(`
    *[_type == "article" && status == "published"] {
      _id, title, slug, excerpt, body, faq, publishedAt, coverImage,
      author->{ name, slug, avatar },
      category->{ name, slug }
    }
  `);

  const categories = await sanityClient.fetch(`*[_type == "category"] { name, slug, description }`);
  const authors = await sanityClient.fetch(`*[_type == "author"] { name, slug, bio, avatar }`);

  return { articles, categories, authors };
}

function ensureDirSync(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateMetaTags(options: any) {
  const { title, description, url, imageUrl, type = 'website' } = options;
  return `
    <title>${title} | The Daily Pulse</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${url}" />
    ${imageUrl ? `<meta property="og:image" content="${imageUrl}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : ''}
  `;
}

async function run() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.warn(`[Prerender] Skipping because ${INDEX_HTML_PATH} does not exist. Did you run build first?`);
    return;
  }

  console.log('[Prerender] Fetching data from Sanity...');
  const { articles, categories, authors } = await fetchSanityData();

  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  // Replace default meta tags block with a comment placeholder so it's easy to replace
  const cleanHtmlTemplate = baseHtml.replace(/<title>.*?<\/title>/ims, '<!-- META -->')
                                    .replace(/<meta name="description".*?>/i, '')
                                    .replace(/<meta property="og:.*?>/ig, '')
                                    .replace(/<meta name="twitter:.*?>/ig, '');

  console.log(`[Prerender] Generating ${articles.length} article pages...`);
  
  // 1. Articles
  for (const article of articles) {
    if (!article.slug?.current) continue;
    
    const url = `${SITE_URL}/article/${article.slug.current}`;
    const imageUrl = urlFor(article.coverImage);
    const authorName = article.author?.name || 'Unknown';
    const publishedAt = article.publishedAt || new Date().toISOString();

    const metaHtml = generateMetaTags({
      title: article.title,
      description: article.excerpt || article.title,
      url,
      imageUrl,
      type: 'article',
    });

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "headline": article.title,
      "description": article.excerpt || article.title,
      "image": imageUrl || "",
      "author": {
        "@type": "Person",
        "name": authorName
      },
      "datePublished": publishedAt,
      "publisher": {
        "@type": "Organization",
        "name": "The Daily Pulse",
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/apple-touch-icon.png`
        }
      }
    };

    let faqSchema = null;
    let faqHtml = '';
    
    // Attempt to extract FAQ from body if explicit FAQ array is empty
    let parsedFaqs = [];
    if (article.faq && Array.isArray(article.faq) && article.faq.length > 0) {
      parsedFaqs = article.faq;
      faqHtml = '<h2>Frequently Asked Questions</h2>' + article.faq.map((q: any) => `<h3>${q.question}</h3><p>${q.answer}</p>`).join('');
    } else if (article.body && Array.isArray(article.body)) {
      const state = article.body.reduce(
        (acc, block) => {
          if (block._type !== 'block') return acc;

          let text = '';
          if (block.children) {
            for (let i = 0, len = block.children.length; i < len; i++) {
              if (block.children[i].text) {
                text += block.children[i].text;
              }
            }
          }

          const isHeader = block.style === 'h2' || block.style === 'h3' || block.style === 'h4';

          if (isHeader) {
            const trimmedText = text.trim();
            if (trimmedText.endsWith('?')) {
              if (acc.currentQuestion && acc.currentAnswer.length > 0) {
                acc.faqs.push({ question: acc.currentQuestion, answer: acc.currentAnswer.join('\n').trim() });
              }
              acc.currentQuestion = trimmedText;
              acc.currentAnswer = [];
            } else if (acc.currentQuestion) {
              if (acc.currentAnswer.length > 0) {
                acc.faqs.push({ question: acc.currentQuestion, answer: acc.currentAnswer.join('\n').trim() });
              }
              acc.currentQuestion = null;
              acc.currentAnswer = [];
            }
          } else if (acc.currentQuestion && block.style === 'normal') {
            acc.currentAnswer.push(text);
          }
          return acc;
        },
        { faqs: [] as { question: string, answer: string }[], currentQuestion: null as string | null, currentAnswer: [] as string[] }
      );

      if (state.currentQuestion && state.currentAnswer.length > 0) {
        state.faqs.push({ question: state.currentQuestion, answer: state.currentAnswer.join('\n').trim() });
      }
      parsedFaqs = state.faqs;
    }

    if (parsedFaqs.length > 0) {
      faqSchema = {
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

    let schemaScripts = `<script type="application/ld+json">\n${JSON.stringify(jsonLd)}\n</script>\n`;
    if (faqSchema) {
      schemaScripts += `<script type="application/ld+json">\n${JSON.stringify(faqSchema)}\n</script>\n`;
    }

    const finalHead = metaHtml + '\n' + schemaScripts;
    const finalHtml = cleanHtmlTemplate.replace('<!-- META -->', finalHead);
    
    // Create the HTML contents for inside #root
    // We convert portable text if it exists, otherwise fallback to excerpt.
    const bodyHtml = article.body ? toHTML(article.body) : `<p>${article.excerpt}</p>`;
    const bodyContent = `<div id="root"><main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 prose prose-lg dark:prose-invert"><h1>${article.title}</h1>${bodyHtml}${faqHtml}</main></div>`;
    
    const readyHtml = finalHtml.replace('<div id="root"></div>', bodyContent);

    const outDir = path.join(DIST_DIR, 'article', article.slug.current);
    ensureDirSync(outDir);
    fs.writeFileSync(path.join(outDir, 'index.html'), readyHtml);
  }

  // 2. Categories
  for (const category of categories) {
    if (!category.slug?.current) continue;
    const url = `${SITE_URL}/category/${category.slug.current}`;
    const metaHtml = generateMetaTags({
      title: `Category: ${category.name}`,
      description: category.description || `Browse articles in ${category.name}`,
      url,
    });
    
    const finalHtml = cleanHtmlTemplate.replace('<!-- META -->', metaHtml);
    const outDir = path.join(DIST_DIR, 'category', category.slug.current);
    ensureDirSync(outDir);
    fs.writeFileSync(path.join(outDir, 'index.html'), finalHtml);
  }

  // 3. Authors
  for (const author of authors) {
    if (!author.slug?.current) continue;
    const url = `${SITE_URL}/author/${author.slug.current}`;
    const metaHtml = generateMetaTags({
      title: `Author: ${author.name}`,
      description: `Articles by ${author.name}`,
      url,
      imageUrl: urlFor(author.avatar),
      type: 'profile',
    });

    const finalHtml = cleanHtmlTemplate.replace('<!-- META -->', metaHtml);
    const outDir = path.join(DIST_DIR, 'author', author.slug.current);
    ensureDirSync(outDir);
    fs.writeFileSync(path.join(outDir, 'index.html'), finalHtml);
  }

  console.log('[Prerender] Done generating static files for SEO.');
}

run().catch(console.error);
