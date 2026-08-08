import { sanityClient } from '@/sanity/client';

// Normalized shape rendered by the gallery grids. `image` is a ready-to-use
// URL — a Sanity CDN URL from the query, or a local import in the fallback.
export type GalleryImage = { image: string; caption: string; alt: string };

const GALLERY_QUERY = `*[_type == "galleryImage" && defined(image.asset)] | order(order asc, _createdAt asc){
  "caption": coalesce(caption, ""),
  "alt": coalesce(alt, caption, ""),
  "image": image.asset->url
}`;

type RawGalleryImage = { caption: string; alt: string; image: string | null };

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const rows = await sanityClient.fetch<RawGalleryImage[]>(GALLERY_QUERY);
  return rows
    .filter((row): row is RawGalleryImage & { image: string } =>
      Boolean(row.image),
    )
    .map((row) => ({
      // Let the Sanity CDN size/format the asset instead of shipping the original.
      image: `${row.image}?auto=format&fit=max&w=1400&q=80`,
      caption: row.caption,
      alt: row.alt,
    }));
}
