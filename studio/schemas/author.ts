import { defineField, defineType } from 'sanity';

export const authorSchema = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'bio', title: 'Bio', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({
      name: 'socialLinks', title: 'Social Links', type: 'object',
      fields: [
        { name: 'twitter', title: 'Twitter/X', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn', type: 'url' },
        { name: 'github', title: 'GitHub', type: 'url' },
        { name: 'website', title: 'Website', type: 'url' },
      ],
    }),
  ],
  preview: { select: { title: 'name', media: 'avatar' } },
});
