import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

type BookingBody = {
  name?: string;
  phone?: string;
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

  const { name, phone, service, date, time, notes } = (req.body ??
    {}) as BookingBody;

  if (!name || !phone || !service || !date || !time) {
    return res
      .status(400)
      .json({ ok: false, error: 'Missing required booking fields' });
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Env-stored PEM keys usually carry literal "\n"; restore real newlines.
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n',
  );
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!email || !key || !calendarId) {
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

  try {
    // GoogleAuth with service-account credentials is accepted by every
    // googleapis version's auth union (unlike a bare JWT, which some versions'
    // GlobalOptions reject). Pass auth per-request so this doesn't depend on the
    // calendar() options overload accepting an `auth` field either.
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: email, private_key: key },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
    const calendar = google.calendar('v3');
    const event = await calendar.events.insert({
      auth,
      calendarId,
      requestBody: {
        summary: `${name} — ${service}`,
        description: `Phone: ${phone}${notes ? `\nNotes: ${notes}` : ''}`,
        start: { dateTime: startDateTime, timeZone: TIME_ZONE },
        end: { dateTime: endDateTime, timeZone: TIME_ZONE },
      },
    });
    return res.status(200).json({ ok: true, eventId: event.data.id });
  } catch (err) {
    console.error('book-appointment: failed to create calendar event', err);
    return res.status(502).json({ ok: false, error: 'Failed to create booking' });
  }
}
