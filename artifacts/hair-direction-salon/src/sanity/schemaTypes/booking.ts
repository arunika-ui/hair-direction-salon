import { defineType, defineField } from 'sanity';

export const booking = defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'service', title: 'Service', type: 'string' }),
    defineField({ name: 'date', title: 'Date', type: 'string' }),
    defineField({ name: 'time', title: 'Time', type: 'string' }),
    defineField({ name: 'notes', title: 'Notes', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['Pending', 'Confirmed', 'Cancelled'] },
      initialValue: 'Pending',
    }),
  ],
  preview: {
    select: { name: 'name', service: 'service', date: 'date', status: 'status' },
    prepare({ name, service, date, status }) {
      return {
        title: `${name ?? 'Booking'} — ${service ?? ''}`.trim(),
        subtitle: [date, status].filter(Boolean).join(' · '),
      };
    },
  },
});
