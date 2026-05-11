import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'michael@localbusinesscalendars.com';
const FROM_NAME  = 'Michael — Local Business Calendars';

// ─── San Antonio ramp schedule ────────────────────────────────────────────────
// Week 1–2: 250/day, Week 3: 500/day, Week 4: 1000/day, Week 5+: unlimited
const SA_DAILY_CAP = 250; // current cap — adjust as reputation builds

const CITY_CALENDAR_URL: Record<string, string> = {
  'San Antonio': 'https://businesscalendar.link/texas/san-antonio',
  'Austin':      'https://businesscalendar.link/texas/austin',
  'Dallas':      'https://businesscalendar.link/texas/dallas',
  'Houston':     'https://businesscalendar.link/texas/houston',
};

// ─── Supabase admin client (service role — bypasses RLS) ─────────────────────
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function getMondayThisSunday(): { monday: string; sunday: string } {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { monday: fmt(monday), sunday: fmt(sunday) };
}

function todayCST(): string {
  // Returns YYYY-MM-DD in US/Central time
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

// ─── Email HTML builder ───────────────────────────────────────────────────────
interface EventRow {
  id: number;
  name: string;
  start_date: string;
  start_time: string | null;
  org_name: string | null;
  address: string | null;
  website: string | null;
  paid: string | null;
}

function shortDayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const mon = d.toLocaleDateString('en-US', { month: 'numeric' });
  return `${weekday} ${mon}/${day}`;
}

function buildNewsletterHtml(
  city: string,
  weekLabel: string,
  events: EventRow[],
  firstName: string | null,
  unsubToken: string,
): string {
  const calUrl = CITY_CALENDAR_URL[city] ?? 'https://businesscalendar.link';
  const unsubUrl = `https://businesscalendar.link/unsubscribe?token=${unsubToken}`;
  const greeting = firstName ? `Hey ${firstName},` : 'Hey there,';

  const eventRows = events.length === 0
    ? `<tr><td style="padding:16px 0;color:#aaa;font-size:13px;font-style:italic;">No events found for this week — check back next Monday!</td></tr>`
    : events.map(e => {
        const dayLabel = shortDayLabel(e.start_date);
        const venue = e.org_name || e.address || '';
        const time = e.start_time || '';
        const meta = [venue, time].filter(Boolean).join(' · ');
        const link = e.website ?? null;
        return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="60" style="vertical-align:top;padding-top:1px;">
                  <span style="font-size:11px;font-weight:700;color:#1a3a5c;letter-spacing:0.04em;text-transform:uppercase;">${dayLabel}</span>
                </td>
                <td style="vertical-align:top;">
                  ${link
                    ? `<a href="${link}" style="font-size:13px;font-weight:600;color:#1a1a1a;text-decoration:none;">${e.name}</a>`
                    : `<span style="font-size:13px;font-weight:600;color:#1a1a1a;">${e.name}</span>`
                  }
                  ${meta ? `<br><span style="font-size:11px;color:#888;">${meta}</span>` : ''}
                  ${e.paid && e.paid !== 'Free' ? `<br><span style="font-size:11px;color:#b45309;">${e.paid}</span>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
      }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${city} Business Calendar — This Week</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e0e0e0;max-width:600px;width:100%;">

    <!-- HEADER -->
    <tr>
      <td style="padding:16px 24px;border-bottom:1px solid #e8e8e8;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#888;display:block;margin-bottom:3px;">Local Business Calendars</span>
              <span style="font-size:18px;font-weight:700;color:#1a1a1a;">${city} — This Week</span>
            </td>
            <td align="right" style="vertical-align:middle;">
              <span style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#1a3a5c;font-weight:700;">Weekly Edition</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- WEEK LABEL -->
    <tr>
      <td style="background:#1a3a5c;padding:7px 24px;">
        <span style="font-size:11px;color:#ffffff;letter-spacing:0.04em;">${weekLabel}</span>
      </td>
    </tr>

    <!-- SPONSOR BLOCK (open slot) -->
    <tr>
      <td style="background:#fafafa;border-bottom:1px solid #e8e8e8;padding:16px 24px;border-left:3px dashed #ccc;">
        <p style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#bbb;margin:0 0 5px 0;">Sponsorship Opportunity</p>
        <p style="font-size:13px;color:#aaa;margin:0;line-height:1.6;">
          This calendar has an open sponsorship slot. Reach ${city} professionals every week —
          decision-makers who attend local events and support local businesses.
          <a href="https://localbusinesscalendars.com/sponsor" style="color:#1a3a5c;text-decoration:none;font-weight:600;">Learn about founding sponsorship →</a>
        </p>
      </td>
    </tr>

    <!-- GREETING -->
    <tr>
      <td style="padding:20px 24px 4px;">
        <p style="font-size:14px;color:#333;margin:0 0 16px;">${greeting}</p>
        <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#888;margin:0 0 14px;padding-bottom:6px;border-bottom:1px solid #e8e8e8;">This Week's Events</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${eventRows}
        </table>
      </td>
    </tr>

    <!-- VIEW CALENDAR CTA -->
    <tr>
      <td style="padding:20px 24px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#1a3a5c;border-radius:4px;">
              <a href="${calUrl}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:.5px;">
                View Full Calendar →
              </a>
            </td>
          </tr>
        </table>
        <p style="font-size:13px;color:#555;line-height:1.6;margin:16px 0 0;">
          See something missing? <a href="https://localbusinesscalendars.com/submit" style="color:#1a3a5c;text-decoration:none;">Submit an event →</a>
        </p>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="padding:14px 24px;border-top:1px solid #e8e8e8;text-align:center;">
        <p style="font-size:11px;color:#aaa;margin:0;line-height:1.8;">
          You're receiving this because you subscribed to the free ${city} Business Calendar newsletter.<br>
          <a href="${calUrl}" style="color:#1a3a5c;text-decoration:none;">Visit the calendar</a>
          &nbsp;·&nbsp;
          <a href="${unsubUrl}" style="color:#1a3a5c;text-decoration:none;">Unsubscribe</a>
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { city, dryRun } = await req.json();

    if (!city) {
      return NextResponse.json({ error: 'city is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const today = todayCST();
    const { monday, sunday } = getMondayThisSunday();

    // ── 1. Fetch this week's events for the city ──────────────────────────────
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, name, start_date, start_time, org_name, address, website, paid')
      .eq('city_calendar', city)
      .gte('start_date', monday)
      .lte('start_date', sunday)
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (eventsError) {
      return NextResponse.json({ error: 'Failed to fetch events', detail: eventsError.message }, { status: 500 });
    }

    const events = (eventsData ?? []) as EventRow[];

    // ── 2. Fetch active subscribers for this city ─────────────────────────────
    const { data: subsData, error: subsError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, email, first_name')
      .eq('city', city)
      .eq('status', 'active');

    if (subsError) {
      return NextResponse.json({ error: 'Failed to fetch subscribers', detail: subsError.message }, { status: 500 });
    }

    const allSubs = (subsData ?? []) as { id: number; email: string; first_name: string | null }[];

    // ── 3. Apply SA daily ramp cap ────────────────────────────────────────────
    let subsToSend = allSubs;
    let cappedAt: number | null = null;
    let alreadySentToday = 0;

    if (city === 'San Antonio') {
      // Count how many SA emails were sent today
      const { count } = await supabase
        .from('newsletter_sends')
        .select('*', { count: 'exact', head: true })
        .eq('city', city)
        .eq('send_date', today);

      alreadySentToday = count ?? 0;
      const remaining = Math.max(0, SA_DAILY_CAP - alreadySentToday);

      if (remaining === 0) {
        return NextResponse.json({
          error: 'Daily SA cap reached',
          alreadySentToday,
          dailyCap: SA_DAILY_CAP,
          remaining: 0,
        }, { status: 429 });
      }

      subsToSend = allSubs.slice(0, remaining);
      cappedAt = SA_DAILY_CAP;
    }

    // ── 4. Format week label ──────────────────────────────────────────────────
    const fmtDate = (s: string) => {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const weekLabel = `Week of ${fmtDate(monday)} – ${fmtDate(sunday)}`;

    // ── 5. Dry run — return stats without sending ─────────────────────────────
    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        city,
        eventsCount: events.length,
        totalSubscribers: allSubs.length,
        wouldSendTo: subsToSend.length,
        cappedAt,
        alreadySentToday,
        dailyCap: city === 'San Antonio' ? SA_DAILY_CAP : null,
        weekLabel,
      });
    }

    // ── 6. Send emails via SendGrid ───────────────────────────────────────────
    const errors: { email: string; error: string }[] = [];
    let sentCount = 0;
    const sentIds: number[] = [];

    // Send in batches of 50 to avoid overwhelming the API
    const BATCH_SIZE = 50;
    for (let i = 0; i < subsToSend.length; i += BATCH_SIZE) {
      const batch = subsToSend.slice(i, i + BATCH_SIZE);

      await Promise.all(batch.map(async (sub) => {
        // Simple unsub token — email encoded in base64
        const unsubToken = Buffer.from(sub.email).toString('base64');
        const html = buildNewsletterHtml(city, weekLabel, events, sub.first_name, unsubToken);

        const msg = {
          to:      sub.email,
          from:    { email: FROM_EMAIL, name: FROM_NAME },
          subject: `${city} Business Events — This Week`,
          html,
        };

        try {
          await sgMail.send(msg);
          sentCount++;
          sentIds.push(sub.id);
        } catch (err: any) {
          errors.push({ email: sub.email, error: err?.message ?? 'unknown' });
        }
      }));
    }

    // ── 7. Record the send in newsletter_sends ────────────────────────────────
    if (sentCount > 0) {
      await supabase.from('newsletter_sends').insert({
        city,
        send_date: today,
        count_sent: sentCount,
        event_count: events.length,
        week_start: monday,
        week_end: sunday,
        sent_at: new Date().toISOString(),
      });

      // Update last_email_sent_at on each subscriber
      await supabase
        .from('newsletter_subscriptions')
        .update({ last_email_sent_at: new Date().toISOString() })
        .in('id', sentIds);
    }

    return NextResponse.json({
      success: true,
      city,
      eventsCount: events.length,
      totalSubscribers: allSubs.length,
      sentCount,
      skippedByRamp: allSubs.length - subsToSend.length,
      cappedAt,
      alreadySentToday: alreadySentToday + sentCount,
      dailyCap: city === 'San Antonio' ? SA_DAILY_CAP : null,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (err: any) {
    console.error('send-newsletter error:', err);
    return NextResponse.json({ error: 'Internal server error', detail: err?.message }, { status: 500 });
  }
}

// ─── GET — return today's send stats for a city ───────────────────────────────

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city');
  if (!city) return NextResponse.json({ error: 'city required' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const today = todayCST();

  const { data } = await supabase
    .from('newsletter_sends')
    .select('count_sent, sent_at')
    .eq('city', city)
    .eq('send_date', today)
    .order('sent_at', { ascending: false });

  const sentToday = (data ?? []).reduce((sum, r) => sum + (r.count_sent ?? 0), 0);

  // Also get total active subscribers
  const { count: totalSubs } = await supabase
    .from('newsletter_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('city', city)
    .eq('status', 'active');

  return NextResponse.json({
    city,
    today,
    sentToday,
    totalSubscribers: totalSubs ?? 0,
    dailyCap: city === 'San Antonio' ? SA_DAILY_CAP : null,
    remaining: city === 'San Antonio' ? Math.max(0, SA_DAILY_CAP - sentToday) : null,
  });
}
