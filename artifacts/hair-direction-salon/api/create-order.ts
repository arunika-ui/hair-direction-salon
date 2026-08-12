import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sanityClient } from '../src/sanity/client.js';

// The frontend sends only { id, qty } per line. Prices/total are ALWAYS derived
// server-side from Sanity — a client-sent amount is never trusted.
type CartItem = { id?: string; qty?: number };
type PriceRow = { id: string; price: number | null };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error('create-order: missing Razorpay env vars');
    return res.status(500).json({ ok: false, error: 'Payment not configured' });
  }

  const items = (req.body?.items ?? []) as CartItem[];
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, error: 'Cart is empty' });
  }

  // Authoritative prices from Sanity (id mirrors the frontend's slug ?? name).
  let priceRows: PriceRow[];
  try {
    priceRows = await sanityClient.fetch<PriceRow[]>(
      `*[_type == "product" && inStock == true]{ "id": coalesce(slug.current, name), price }`,
    );
  } catch (err) {
    console.error('create-order: failed to load product prices', err);
    return res.status(502).json({ ok: false, error: 'Could not price the cart' });
  }
  const priceMap = new Map(priceRows.map((row) => [row.id, row.price]));

  let totalRupees = 0;
  for (const item of items) {
    const qty = Number(item.qty);
    const price = item.id ? priceMap.get(item.id) : undefined;
    if (
      !item.id ||
      !Number.isInteger(qty) ||
      qty <= 0 ||
      typeof price !== 'number'
    ) {
      return res
        .status(400)
        .json({ ok: false, error: 'Cart contains an unavailable item' });
    }
    totalRupees += price * qty;
  }

  const amount = Math.round(totalRupees * 100); // Razorpay expects paise
  if (amount <= 0) {
    return res.status(400).json({ ok: false, error: 'Invalid cart total' });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `hd_${Date.now()}`,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('create-order: Razorpay rejected order', response.status, detail);
      return res.status(502).json({ ok: false, error: 'Could not create order' });
    }
    const order = (await response.json()) as {
      id: string;
      amount: number;
      currency: string;
    };
    // keyId is the public key — the frontend needs it to open Checkout.js.
    return res.status(200).json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error('create-order: order creation error', err);
    return res.status(502).json({ ok: false, error: 'Could not create order' });
  }
}
