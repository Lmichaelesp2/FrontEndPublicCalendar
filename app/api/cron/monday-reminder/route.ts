import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'michael@localbusinesscalendars.com';
const FROM_NAME  = 'Local Business Calendars';
const REMINDER_TO = 'michael@localbusinesscalendars.com';
const ADMIN_URL  = 'https://businesscalendar.link/admin/newsletters';

const CITIES = ['San Antonio', 'Austin', 'Dallas', 'Houston'] as const;
const SUB_CALENDARS = ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'] as const;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function getNextWeekRange(): { monday: string; sunday: string; label: string } {
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
  const [y, m, d] = todayStr.split('-').map(Number);
  const today = new Date(y, m - 1, d);
  const day = today.getDay();
  // Monday cron: day=1, so next Monday is +0 days (this IS Monday), week starts today
  const diffToMonday = day === 1 ? 0 : day === 0 ? 1 : 8 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt: Date) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtISO = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  return {
    monday: fmtISO(monday),
    sunday: fmtISO(sunday),
    label: `${fmt(monday)} – ${fmt(sunday)}`,
  };
}

// Verify this is actually called by Vercel cron (not a random request)
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { monday, sunday, label } = getNextWeekRange();

  // Fetch event counts per city for this week
  const citySummaries: { city: string; cityCount: number; subCals: { name: string; count: number }[] }[] = [];

  for (const city of CITIES) {
    const { data: events } = await supabase
      .from('events')
      .select('name, event_category')
      .eq('city_calendar', city)
      .gte('start_date', monday)
      .lte('start_date', sunday);

    const allEvents = events ?? [];
    const cityCount = allEvents.length;

    // Count per sub-cal
    const subCals = SUB_CALENDARS.map(sub => {
      const map: Record<string, string[]> = {
        'Networking':     ['networking'],
        'Technology':     ['technology', 'tech'],
        'Real Estate':    ['real estate', 'real-estate', 'realestate'],
        'Chamber':        ['chamber'],
        'Small Business': ['small business', 'small-business'],
      };
      const terms = map[sub] ?? [sub.toLowerCase()];
      const count = allEvents.filter(e =>
        e.event_category && terms.some(t => e.event_category.toLowerCase().includes(t))
      ).length;
      return { name: sub, count };
    });

    // Get subscriber counts
    const { count: subCount } = await supabase
      .from('newsletter_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('city', city)
      .eq('status', 'active')
      .is('sub_calendar', null);

    citySummaries.push({ city, cityCount, subCals });
  }

  // Build reminder email HTML
  const cityRows = citySummaries.map(({ city, cityCount, subCals }) => {
    const subRows = subCals.map(s =>
      `<tr>
        <td style="padding:4px 0 4px 20px;font-size:13px;color:#555;">— ${s.name}</td>
        <td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${s.count} events</td>
      </tr>`
    ).join('');
    return `
      <tr>
        <td style="padding:10px 0 4px;font-size:14px;font-weight:700;color:#1a3a5c;border-top:1px solid #e8e8e8;">
          ${city}
        </td>
        <td style="padding:10px 0 4px;font-size:14px;font-weight:700;color:#1a3a5c;text-align:right;border-top:1px solid #e8e8e8;">
          ${cityCount} events
        </td>
      </tr>
      ${subRows}`;
  }).join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e0e0e0;max-width:560px;width:100%;border-radius:6px;overflow:hidden;">

    <tr>
      <td style="background:#1a3a5c;padding:20px 28px;">
        <p style="margin:0;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#a0b4c8;">Local Business Calendars</p>
        <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#fff;">Monday Newsletter Reminder</h1>
      </td>
    </tr>

    <tr>
      <td style="padding:24px 28px;">
        <p style="font-size:15px;color:#333;margin:0 0 6px;">Good morning! This week's newsletters are ready to send.</p>
        <p style="font-size:13px;color:#888;margin:0 0 24px;">${label}</p>

        <table width="100%" cellpadding="0" cellspacing="0">
          ${cityRows}
        </table>

        <table cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
          <tr>
            <td style="background:#1a3a5c;border-radius:5px;">
              <a href="${ADMIN_URL}"
                 style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:.3px;">
                Go to Newsletter Admin →
              </a>
            </td>
          </tr>
        </table>

        <p style="font-size:12px;color:#aaa;text-align:center;margin:20px 0 0;line-height:1.6;">
          Do a test send first, then send to each city when ready.<br>
          San Antonio ramp cap: 250/day.
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  try {
    await sgMail.send({
      to:      REMINDER_TO,
      from:    { email: FROM_EMAIL, name: FROM_NAME },
      subject: `📬 Monday newsletters ready — ${label}`,
      html,
    });

    return NextResponse.json({
      success: true,
      weekLabel: label,
      citySummaries,
    });
  } catch (err: any) {
    console.error('Monday reminder error:', err?.response?.body ?? err);
    return NextResponse.json({ error: 'Failed to send reminder', detail: err?.message }, { status: 500 });
  }
}
