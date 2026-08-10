import { defineType, defineField } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'price', title: 'Price (INR)', type: 'number' }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      // Proposed salon-shop categories — adjust this list as needed.
      options: {
        list: [
          'Shampoo & Conditioner',
          'Styling Products',
          'Treatments & Masks',
          'Tools',
          'Accessories',
          'Hair Extensions',
          'Gift Sets',
        ],
      },
    }),
    defineField({ name: 'stock', title: 'Stock', type: 'number' }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'images.0' },
  },
});
