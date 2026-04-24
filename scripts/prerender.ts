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
      _id, title, slug, excerpt, body, faq, publishedAt, _updatedAt, coverImage,
      author->{ name, slug, avatar },
      category->{ name, slug }
    }
  `);

  const categories = await sanityClient.fetch(`*[_type == "category"] { name, slug, description }`);
  const authors = await sanityClient.fetch(`*[_type == "author"] { name, slug, bio, avatar }`);
  const pages = await sanityClient.fetch(`*[_type == "page"] { title, slug, description, body }`);

  return { articles, categories, authors, pages };
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
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="The Daily Pulse" />
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
  const { articles, categories, authors, pages } = await fetchSanityData();

  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  // Replace default meta tags block with a comment placeholder so it's easy to replace
  const cleanHtmlTemplate = baseHtml.replace(/<title>.*?<\/title>/ims, '<!-- META -->')
                                    .replace(/<meta name="description".*?>/i, '')
                                    .replace(/<meta property="og:.*?>/ig, '')
                                    .replace(/<meta name="twitter:.*?>/ig, '')
                                    .replace(/<link rel="canonical"[^>]*>/ig, '');

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
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "headline": article.title,
      "description": article.excerpt || article.title,
      "image": imageUrl || "",
      "author": {
        "@type": "Person",
        "name": authorName,
        "url": `${SITE_URL}/author/${article.author?.slug?.current || ''}`
      },
      "datePublished": publishedAt,
      "dateModified": article._updatedAt || publishedAt,
      "publisher": {
        "@type": "Organization",
        "name": "The Daily Pulse",
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/apple-touch-icon.png`
        }
      }
    };

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

    let schemaScripts = `<script type="application/ld+json">\n${JSON.stringify(jsonLd)}\n</script>\n`;

    const finalHead = metaHtml + '\n' + schemaScripts;
    const finalHtml = cleanHtmlTemplate.replace('<!-- META -->', finalHead);
    
    // Create the HTML contents for inside #root
    // We convert portable text if it exists, otherwise fallback to excerpt.
    // When explicit FAQ array exists, filter out FAQ headings and their answers from the body to avoid duplication
    let filteredBody = article.body;
    if (article.faq && Array.isArray(article.faq) && article.faq.length > 0 && article.body) {
      const faqQuestions = new Set(article.faq.map((q: any) => (q.question || '').trim()));
      const blocks = article.body as any[];
      const indicesToRemove = new Set<number>();
      let skipNormal = false;

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block._type !== 'block') continue;

        const isHeading = block.style === 'h2' || block.style === 'h3' || block.style === 'h4';
        const text = (block.children || []).map((c: any) => c.text || '').join('').trim();

        if (isHeading && faqQuestions.has(text)) {
          skipNormal = true;
          indicesToRemove.add(i);
        } else if (isHeading) {
          skipNormal = false;
        } else if (skipNormal && block.style === 'normal') {
          indicesToRemove.add(i);
        }
      }

      filteredBody = blocks.filter((_: any, i: number) => !indicesToRemove.has(i));
    }

    const bodyHtml = (filteredBody || article.body) ? toHTML(filteredBody || article.body, {
      components: {
        block: {
          h1: ({ children }: any) => `<h2 class="text-4xl font-bold mt-8 mb-4">${children}</h2>`,
          h2: ({ children }: any) => `<h2 class="text-2xl font-bold mt-10 mb-4 pt-6 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">${children}</h2>`,
          h3: ({ children }: any) => `<h3 class="text-2xl font-bold mt-6 mb-3">${children}</h3>`,
          h4: ({ children }: any) => `<h4 class="text-xl font-bold mt-6 mb-3">${children}</h4>`,
          normal: ({ children }: any) => `<p class="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-[1.875] mb-6">${children}</p>`,
          blockquote: ({ children }: any) => `<blockquote class="border-l-4 border-red-600 pl-6 py-2 my-6 italic text-slate-700 dark:text-slate-300">${children}</blockquote>`,
        },
        types: {
          image: ({ value }: any) => {
            const src = (value?.asset || value?._ref) ? urlFor(value) : null;
            if (!src) return '';
            return `
              <figure class="my-8">
                <img src="${src}" alt="${value?.alt || ''}" class="w-full rounded-xl object-cover" />
                ${value?.caption ? `<figcaption class="mt-2 text-sm text-center text-slate-500 dark:text-slate-400 italic">${value.caption}</figcaption>` : ''}
              </figure>
            `;
          }
        }
      }
    }) : `<p class="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">${article.excerpt}</p>`;

    // We mimic the structure of the ArticlePage layout so hydration doesn't fail.
    // Notice how we don't have all the sidebar and header elements, but the content container
    // needs to match as close as possible for the main elements, or at least be a single child
    // we can replace or keep without causing a mismatch.
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
      imageUrl: `${SITE_URL}/apple-touch-icon.png`,
    });

    const categorySchema = [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category.name} News`,
        "url": url,
        "description": category.description || `Browse articles in ${category.name}`,
        "publisher": { "@type": "Organization", "name": "The Daily Pulse", "url": SITE_URL }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": category.name, "item": url }
        ]
      }
    ];
    const categorySchemaHtml = categorySchema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
    const finalHtml = cleanHtmlTemplate.replace('<!-- META -->', metaHtml + '\n' + categorySchemaHtml);
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

    const authorSchema = [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": author.name,
        "url": url,
        "image": urlFor(author.avatar) || '',
        "jobTitle": "Journalist",
        "worksFor": { "@type": "Organization", "name": "The Daily Pulse", "url": SITE_URL }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": author.name, "item": url }
        ]
      }
    ];
    const authorSchemaHtml = authorSchema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
    const finalHtml = cleanHtmlTemplate.replace('<!-- META -->', metaHtml + '\n' + authorSchemaHtml);
    const outDir = path.join(DIST_DIR, 'author', author.slug.current);
    ensureDirSync(outDir);
    fs.writeFileSync(path.join(outDir, 'index.html'), finalHtml);
  }

  // 4. Static Pages (About, Contact, etc.)
  console.log(`[Prerender] Generating ${pages.length} static pages...`);
  for (const page of pages) {
    if (!page.slug?.current) continue;
    const url = `${SITE_URL}/${page.slug.current}`;
    const pageDescription = page.description || `Read about ${page.title} on The Daily Pulse.`;
    const metaHtml = generateMetaTags({
      title: page.title,
      description: pageDescription,
      url,
      imageUrl: `${SITE_URL}/apple-touch-icon.png`,
    });

    let pageContentHtml = '';
    if (page.body && Array.isArray(page.body)) {
      pageContentHtml = toHTML(page.body);
    }

    const bodyContent = `<div id="root"><main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><h1>${page.title}</h1>${pageContentHtml}</main></div>`;
    const pageSchema = [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page.title,
        "url": url,
        "description": pageDescription
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": page.title, "item": url }
        ]
      }
    ];
    const pageSchemaHtml = pageSchema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
    const finalHtml = cleanHtmlTemplate.replace('<!-- META -->', metaHtml + '\n' + pageSchemaHtml).replace('<div id="root"></div>', bodyContent);

    const outDir = path.join(DIST_DIR, page.slug.current);
    ensureDirSync(outDir);
    fs.writeFileSync(path.join(outDir, 'index.html'), finalHtml);
  }

  // 5. Generate 404 page
  console.log('[Prerender] Generating 404 page...');
  const notFoundHtml = cleanHtmlTemplate
    .replace('<!-- META -->', `
      <title>Page Not Found | The Daily Pulse</title>
      <meta name="description" content="The page you are looking for does not exist on The Daily Pulse." />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href="${SITE_URL}/404" />
    `)
    .replace('<div id="root"></div>', '<div id="root"><main style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;padding:2rem;text-align:center;"><h1 style="font-size:6rem;margin:0;color:#D42D2D;">404</h1><p style="font-size:1.25rem;color:#475569;margin:0.5rem 0 2rem;">Page Not Found</p><a href="/" style="display:inline-block;background:#D42D2D;color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Back to Home</a></main></div>');
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml);

  // 6. Add canonical link to homepage
  console.log('[Prerender] Adding canonical and schema to homepage...');
  const homepageHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  const homepageMeta = generateMetaTags({
    title: 'Breaking News, Analysis & Culture',
    description: 'The Daily Pulse delivers breaking news, in-depth analysis, and cultural coverage. Your trusted source for today\'s stories that matter.',
    url: `${SITE_URL}/`,
    imageUrl: `${SITE_URL}/apple-touch-icon.png`,
    type: 'website',
  });
  const homepageSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "The Daily Pulse",
      "url": SITE_URL,
      "logo": `${SITE_URL}/apple-touch-icon.png`,
      "sameAs": ["https://twitter.com/thedailypulse", "https://facebook.com/thedailypulse"]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "The Daily Pulse",
      "url": SITE_URL,
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string"
      }
    }
  ];
  const homepageSchemaHtml = homepageSchemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');

  let homepageCleaned = homepageHtml
    .replace(/<title>.*?<\/title>/ims, '<!-- META -->')
    .replace(/<meta name="description".*?>/i, '')
    .replace(/<meta property="og:.*?>/ig, '')
    .replace(/<meta name="twitter:.*?>/ig, '')
    .replace(/<link rel="canonical"[^>]*>/ig, '');

  const homepageFinal = homepageCleaned.replace('<!-- META -->', homepageMeta + '\n' + homepageSchemaHtml);
  fs.writeFileSync(INDEX_HTML_PATH, homepageFinal);

  console.log('[Prerender] Done generating static files for SEO.');
}

run().catch(console.error);
