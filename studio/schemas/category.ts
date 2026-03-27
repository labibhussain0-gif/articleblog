import { defineField, defineType } from 'sanity';

export const categorySchema = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'color', title: 'Color', type: 'string',
      description: 'Hex color code (e.g., #dc2626)',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Must be a valid hex color'),
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'description' } },
});
