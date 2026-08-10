import { sanityClient } from '@/sanity/client';

export type Product = {
  name: string;
  slug: string | null;
  price: number | null;
  priceLabel: string; // formatted, e.g. "₹ 1,200"
  image: string | null;
  category: string | null;
};

const inr = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;

const PRODUCTS_QUERY = `*[_type == "product" && inStock == true] | order(name asc){
  name,
  "slug": slug.current,
  price,
  category,
  "image": images[0].asset->url
}`;

type RawProduct = {
  name: string;
  slug: string | null;
  price: number | null;
  category: string | null;
  image: string | null;
};

export async function fetchProducts(): Promise<Product[]> {
  const rows = await sanityClient.fetch<RawProduct[]>(PRODUCTS_QUERY);
  return rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    price: typeof row.price === 'number' ? row.price : null,
    priceLabel: typeof row.price === 'number' ? inr(row.price) : 'On request',
    image: row.image ? `${row.image}?auto=format&fit=crop&w=800&q=80` : null,
    category: row.category ?? null,
  }));
}
