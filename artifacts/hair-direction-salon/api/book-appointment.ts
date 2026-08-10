import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { Resend } from 'resend';

type BookingBody = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  date?: string; // YYYY-MM-DD from the form's <input type="date">
  time?: string; // HH:MM from the form's <input type="time">
  notes?: string;
};

// The salon is in Delhi; wall-clock times from the form are interpreted in this zone.
const TIME_ZONE = 'Asia/Kolkata';
// The booking form doesn't collect a duration, so each appointment is blocked
// out for a default length. Adjust if per-service durations are wired in later.
const DEFAULT_DURATION_MIN = 60;

const pad = (n: number) => String(n).padStart(2, '0');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name, phone, email, service, date, time, notes } = (req.body ??
    {}) as BookingBody;

  if (!name || !phone || !email || !service || !date || !time) {
    return res
      .status(400)
      .json({ ok: false, error: 'Missing required booking fields' });
  }

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Env-stored PEM keys usually carry literal "\n"; restore real newlines.
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n',
  );
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!serviceAccountEmail || !key || !calendarId) {
    // Log server-side; don't leak which var is missing to the client.
    console.error('book-appointment: missing Google Calendar env vars');
    return res.status(500).json({ ok: false, error: 'Server not configured' });
  }

  // Build start/end as wall-clock strings; Google applies TIME_ZONE. Using
  // Date.UTC keeps the arithmetic independent of the server's local timezone,
  // and handles rollover past midnight for the end time.
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) {
    return res.status(400).json({ ok: false, error: 'Invalid date or time' });
  }
  const startMs = Date.UTC(y, m - 1, d, hh, mm);
  const end = new Date(startMs + DEFAULT_DURATION_MIN * 60 * 1000);
  const startDateTime = `${date}T${pad(hh)}:${pad(mm)}:00`;
  const endDateTime = `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(
    end.getUTCDate(),
  )}T${pad(end.getUTCHours())}:${pad(end.getUTCMinutes())}:00`;

  // --- Phase 1: the calendar event is the source of truth. If this fails, the
  // booking fails (502). No email code lives in this try, so an email error can
  // never be caught here and turn a real booking into a failure.
  let eventId: string | null | undefined;
  try {
    // GoogleAuth with service-account credentials is accepted by every
    // googleapis version's auth union (unlike a bare JWT, which some versions'
    // GlobalOptions reject). Pass auth per-request so this doesn't depend on the
    // calendar() options overload accepting an `auth` field either.
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: serviceAccountEmail, private_key: key },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
    const calendar = google.calendar('v3');
    const event = await calendar.events.insert({
      auth,
      calendarId,
      requestBody: {
        summary: `${name} — ${service}`,
        description: `Phone: ${phone}\nEmail: ${email}${notes ? `\nNotes: ${notes}` : ''}`,
        start: { dateTime: startDateTime, timeZone: TIME_ZONE },
        end: { dateTime: endDateTime, timeZone: TIME_ZONE },
      },
    });
    eventId = event.data.id;
  } catch (err) {
    console.error('book-appointment: failed to create calendar event', err);
    return res.status(502).json({ ok: false, error: 'Failed to create booking' });
  }

  // --- Phase 2: notification emails are best-effort. The helper never throws,
  // so whatever happens here, a created booking still returns success. Awaited
  // so the serverless function isn't frozen before the emails are sent.
  await sendNotificationEmails({
    adminEmail: calendarId,
    name,
    phone,
    email,
    service,
    date,
    time,
    notes,
  });

  return res.status(200).json({ ok: true, eventId });
}

type BookingEmailData = {
  adminEmail: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
};

// Sends the customer confirmation and admin notification via Resend. Guaranteed
// never to throw: a missing key, a rejected send, or a Resend API error (e.g.
// the onboarding@resend.dev sandbox 403 on unverified recipients) is logged but
// never propagated, so it can't fail a booking.
async function sendNotificationEmails(booking: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      'book-appointment: RESEND_API_KEY not set; skipping notification emails',
    );
    return;
  }

  const { adminEmail, name, phone, email, service, date, time, notes } = booking;
  // Default Resend testing sender; swap for a verified hairdirection.com address
  // once DNS is set up.
  const from = 'The Hair Direction Salon <onboarding@resend.dev>';

  try {
    const resend = new Resend(apiKey);

    const customerText = [
      `Hi ${name},`,
      '',
      'Your appointment at The Hair Direction Salon is confirmed:',
      '',
      `Service: ${service}`,
      `Date: ${date}`,
      `Time: ${time}`,
      '',
      'If you need to change anything, just call the studio on 075031 35104.',
      '',
      'See you soon,',
      'The Hair Direction Salon',
    ].join('\n');

    const adminLines = [
      'New booking received:',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Service: ${service}`,
      `Date: ${date}`,
      `Time: ${time}`,
    ];
    if (notes) adminLines.push(`Notes: ${notes}`);

    // allSettled: both sends run concurrently and independently — one failing
    // never stops the other, and the call itself never rejects.
    const results = await Promise.allSettled([
      resend.emails.send({
        from,
        to: email,
        subject: 'Booking Confirmed — The Hair Direction Salon',
        text: customerText,
      }),
      resend.emails.send({
        from,
        to: adminEmail,
        subject: `New Booking — ${name}`,
        text: adminLines.join('\n'),
      }),
    ]);

    const labels = ['customer', 'admin'];
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        console.error(
          `book-appointment: ${labels[i]} email threw (booking still recorded)`,
          result.reason,
        );
      } else if (result.value.error) {
        console.error(
          `book-appointment: ${labels[i]} email failed (booking still recorded)`,
          result.value.error,
        );
      }
    });
  } catch (err) {
    console.error(
      'book-appointment: notification emails failed (booking still recorded)',
      err,
    );
  }
}
