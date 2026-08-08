import { sanityClient } from '@/sanity/client';

// ---- Normalized shape rendered by the Services accordion ----
// Both Sanity data and the hardcoded fallback are converted into this shape,
// so the UI has a single thing to render.
export type ServiceVariant = {
  label?: string;
  duration: string;
  priceLabel: string; // formatted for display, e.g. "₹ 1,200"
};
export type ServiceItem = {
  name: string;
  description: string;
  priceLabel: string; // collapsed-row price, e.g. "From ₹ 1,200"
  variants: ServiceVariant[];
};
export type ServiceGroup = { name: string; items: ServiceItem[] };

// Shape of the hardcoded fallback array in App.tsx.
export type RawGroup = {
  name: string;
  items: { name: string; description: string; price: string; duration: string }[];
};

// Display order for categories so the menu keeps its editorial sequence
// regardless of the order Sanity returns documents in.
const CATEGORY_ORDER = [
  'Cutting',
  'Colour',
  'Smoothing & Treatments',
  'Styling',
  'Extensions',
  'Texture',
];

const inr = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;

// ---- Sanity ----
type SanityService = {
  name: string;
  description?: string;
  category?: string;
  priceVariants?: { label?: string; price?: number; duration?: string }[];
};

const SERVICES_QUERY = `*[_type == "service" && inStock == true]{
  name,
  description,
  category,
  priceVariants[]{ label, price, duration }
}`;

function toItem(service: SanityService): ServiceItem {
  const raw = service.priceVariants ?? [];
  const variants: ServiceVariant[] = raw.map((v) => ({
    label: v.label,
    duration: v.duration ?? '',
    priceLabel: typeof v.price === 'number' ? inr(v.price) : 'On request',
  }));
  const prices = raw
    .map((v) => v.price)
    .filter((p): p is number => typeof p === 'number');
  const lowest = prices.length ? Math.min(...prices) : null;
  const priceLabel =
    lowest === null
      ? 'On request'
      : variants.length > 1
        ? `From ${inr(lowest)}`
        : inr(lowest);
  return {
    name: service.name,
    description: service.description ?? '',
    priceLabel,
    variants,
  };
}

export async function fetchServiceGroups(): Promise<ServiceGroup[]> {
  const services = await sanityClient.fetch<SanityService[]>(SERVICES_QUERY);
  const byCategory = new Map<string, ServiceItem[]>();
  for (const service of services) {
    const key = service.category ?? 'Other';
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(toItem(service));
  }
  const orderOf = (name: string) => {
    const i = CATEGORY_ORDER.indexOf(name);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  return [...byCategory.entries()]
    .sort(([a], [b]) => orderOf(a) - orderOf(b))
    .map(([name, items]) => ({ name, items }));
}

// ---- Fallback: hardcoded array -> normalized shape ----
export function normalizeRawGroups(groups: RawGroup[]): ServiceGroup[] {
  return groups.map((group) => ({
    name: group.name,
    items: group.items.map((item) => ({
      name: item.name,
      description: item.description,
      priceLabel: item.price, // already formatted (e.g. "₹ 1,200" / "Complimentary")
      // Single hardcoded price -> one variant; the UI omits the variant list
      // for single-variant items, so the current look is preserved.
      variants: [{ duration: item.duration, priceLabel: item.price }],
    })),
  }));
}
