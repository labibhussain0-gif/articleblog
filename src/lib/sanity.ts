import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2026-03-25';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource): { url: () => string; width: (w: number) => { url: () => string }; height: (h: number) => { url: () => string } } {
  return builder.image(source);
}

export interface SanityImageSource {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
  };
}

export interface SanityReference {
  _ref: string;
  _type: 'reference';
}

export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  slug: { current: string };
  bio?: Array<{ _type: 'block'; children: Array<{ _type: 'span'; text: string }> }>;
  avatar?: SanityImageSource & { alt?: string };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  _id: string;
  _type: 'category';
  name: string;
  slug: { current: string };
  description?: string;
  color?: string;
}

export interface Tag {
  _id: string;
  _type: 'tag';
  name: string;
  slug: { current: string };
}

export interface Article {
  _id: string;
  _type: 'article';
  title: string;
  slug: { current: string };
  excerpt: string;
  body?: Array<{
    _type: string;
    children?: Array<{ _type: 'span'; text: string }>;
    style?: string;
    asset?: { _ref: string; _type: 'reference' };
  }>;
  coverImage?: SanityImageSource & { caption?: string; alt?: string };
  category: Category;
  author: Author;
  tags?: Tag[];
  publishedAt: string;
  status: 'draft' | 'published';
  readingTime?: number;
}

export async function query<T>(query: string, params?: Record<string, unknown>): Promise<T[]> {
  return sanityClient.fetch<T[]>(query, params || {});
}

export async function queryOne<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  const results = await sanityClient.fetch<T[]>(query, params || {});
  return results[0] || null;
}

export const groq = {
  getAllArticles: (): Promise<Article[]> =>
    query<Article>(`
      *[_type == "article" && status == "published"] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, description, color },
        author->{ _id, _type, name, slug, avatar { ..., asset-> }, socialLinks },
        tags[]->{ _id, _type, name, slug },
        publishedAt,
        status,
        readingTime
      }
    `),

  getArticleBySlug: (slug: string): Promise<Article | null> =>
    queryOne<Article>(`
      *[_type == "article" && slug.current == $slug && status == "published"][0] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        body,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, description, color },
        author->{ _id, _type, name, slug, bio, avatar { ..., asset-> }, socialLinks },
        tags[]->{ _id, _type, name, slug },
        publishedAt,
        status,
        readingTime
      }
    `, { slug }),

  getArticlesByCategory: (categorySlug: string): Promise<Article[]> =>
    query<Article>(`
      *[_type == "article" && category->slug.current == $categorySlug && status == "published"] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, description, color },
        author->{ _id, _type, name, slug, avatar { ..., asset-> } },
        tags[]->{ _id, _type, name, slug },
        publishedAt,
        status,
        readingTime
      }
    `, { categorySlug }),

  getArticlesByAuthor: (authorSlug: string): Promise<Article[]> =>
    query<Article>(`
      *[_type == "article" && author->slug.current == $authorSlug && status == "published"] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, description, color },
        author->{ _id, _type, name, slug, avatar { ..., asset-> } },
        tags[]->{ _id, _type, name, slug },
        publishedAt,
        status,
        readingTime
      }
    `, { authorSlug }),

  getArticlesByTag: (tagSlug: string): Promise<Article[]> =>
    query<Article>(`
      *[_type == "article" && $tagSlug in tags[]->slug.current && status == "published"] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, description, color },
        author->{ _id, _type, name, slug, avatar { ..., asset-> } },
        tags[]->{ _id, _type, name, slug },
        publishedAt,
        status,
        readingTime
      }
    `, { tagSlug }),

  getFeaturedArticles: (limit: number = 5): Promise<Article[]> =>
    query<Article>(`
      *[_type == "article" && status == "published"] | order(publishedAt desc)[0...$limit] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, description, color },
        author->{ _id, _type, name, slug, avatar { ..., asset-> } },
        publishedAt,
        readingTime
      }
    `, { limit }),

  searchArticles: (searchTerm: string): Promise<Article[]> =>
    query<Article>(`
      *[_type == "article" && status == "published" && (title match $searchTerm || excerpt match $searchTerm)] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, description, color },
        author->{ _id, _type, name, slug, avatar { ..., asset-> } },
        tags[]->{ _id, _type, name, slug },
        publishedAt,
        readingTime
      }
    `, { searchTerm: `*${searchTerm}*` }),

  getAllCategories: (): Promise<Category[]> =>
    query<Category>(`
      *[_type == "category"] | order(name asc) {
        _id,
        _type,
        name,
        slug,
        description,
        color
      }
    `),

  getCategoryBySlug: (slug: string): Promise<Category | null> =>
    queryOne<Category>(`
      *[_type == "category" && slug.current == $slug][0] {
        _id,
        _type,
        name,
        slug,
        description,
        color
      }
    `, { slug }),

  getAllAuthors: (): Promise<Author[]> =>
    query<Author>(`
      *[_type == "author"] | order(name asc) {
        _id,
        _type,
        name,
        slug,
        bio,
        avatar { ..., asset-> },
        socialLinks
      }
    `),

  getAuthorBySlug: (slug: string): Promise<Author | null> =>
    queryOne<Author>(`
      *[_type == "author" && slug.current == $slug][0] {
        _id,
        _type,
        name,
        slug,
        bio,
        avatar { ..., asset-> },
        socialLinks
      }
    `, { slug }),

  getAllTags: (): Promise<Tag[]> =>
    query<Tag>(`
      *[_type == "tag"] | order(name asc) {
        _id,
        _type,
        name,
        slug
      }
    `),

  getRecentArticles: (limit: number = 10): Promise<Article[]> =>
    query<Article>(`
      *[_type == "article" && status == "published"] | order(publishedAt desc)[0...$limit] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        coverImage { ..., asset->, alt, caption },
        category->{ _id, _type, name, slug, color },
        author->{ _id, _type, name, slug, avatar { ..., asset-> } },
        publishedAt,
        readingTime
      }
    `, { limit }),
};