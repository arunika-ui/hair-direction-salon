import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'node:crypto';

type VerifyBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error('verify-payment: missing RAZORPAY_KEY_SECRET');
    return res.status(500).json({ ok: false, error: 'Payment not configured' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    (req.body ?? {}) as VerifyBody;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ ok: false, error: 'Missing payment fields' });
  }

  // Razorpay's documented verification: HMAC-SHA256(order_id + "|" + payment_id)
  // keyed with the secret, compared against the signature returned to the browser.
  const expected = createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(razorpay_signature);
  const valid =
    expectedBuf.length === signatureBuf.length &&
    timingSafeEqual(expectedBuf, signatureBuf);

  if (!valid) {
    console.warn('verify-payment: signature mismatch for order', razorpay_order_id);
    return res.status(400).json({ ok: false, error: 'Payment verification failed' });
  }

  return res.status(200).json({ ok: true });
}
