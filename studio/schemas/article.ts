import { defineField, defineType } from 'sanity';

export const articleSchema = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required().min(10).max(200) }),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3,
      validation: (Rule) => Rule.required().max(160),
      description: 'A brief summary (max 160 characters)',
    }),
    defineField({
      name: 'body', title: 'Body', type: 'array',
      of: [
        { type: 'block', styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'Quote', value: 'blockquote' },
        ]},
        { type: 'image', options: { hotspot: true }, fields: [
          { name: 'caption', type: 'string', title: 'Caption' },
          { name: 'alt', type: 'string', title: 'Alt text' },
        ]},
      ],
    }),
    defineField({
      name: 'coverImage', title: 'Cover Image', type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'caption', type: 'string', title: 'Caption' },
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'reference', to: [{ type: 'tag' }] }] }),
    defineField({
      name: 'faq', title: 'FAQ', type: 'array',
      description: 'Optional FAQ items for structured data',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', title: 'Question', type: 'string' },
          { name: 'answer', title: 'Answer', type: 'text' },
        ]
      }]
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({
      name: 'status', title: 'Status', type: 'string',
      options: { list: [{ title: 'Draft', value: 'draft' }, { title: 'Published', value: 'published' }], layout: 'radio' },
      initialValue: 'draft',
    }),
    defineField({ name: 'readingTime', title: 'Reading Time (minutes)', type: 'number', validation: (Rule) => Rule.min(1).max(60) }),
  ],
  preview: { select: { title: 'title', author: 'author.name', media: 'coverImage' } },
  orderings: [{ title: 'Published Date, New', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
});
