import { defineType, defineField } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Service Name', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Cutting', 'Colour', 'Smoothing & Treatments', 'Styling', 'Extensions', 'Texture'] },
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'priceVariants',
      title: 'Pricing',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string' }),
          defineField({ name: 'price', title: 'Price (INR)', type: 'number' }),
          defineField({ name: 'duration', title: 'Duration', type: 'string' }),
        ],
      }],
    }),
    defineField({ name: 'inStock', title: 'Currently Offered', type: 'boolean', initialValue: true }),
  ],
});
