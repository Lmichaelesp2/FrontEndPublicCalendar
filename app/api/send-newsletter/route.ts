import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';
import { SUB_CALENDARS_ENABLED } from '../../../src/lib/subCalendars';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'michael@localbusinesscalendars.com';
const FROM_NAME  = 'Michael — Local Business Calendars';

// ─── Auth ─────────────────────────────────────────────────────────────────────
// Mass-email endpoints must never be publicly callable. Two accepted creds:
//   1. Authorization: Bearer <NEWSLETTER_SEND_SECRET>   (cron / scripts)
//   2. x-admin-password header matching ADMIN_PASSWORD  (admin panel)
// If neither env var is configured, ALL requests are rejected (fail closed).
function requireSendAuth(req: NextRequest): boolean {
  const bearer = req.headers.get('authorization');
  const sendSecret = process.env.NEWSLETTER_SEND_SECRET;
  if (sendSecret && bearer === `Bearer ${sendSecret}`) return true;

  const adminPw = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get('x-admin-password');
  if (adminPw && provided && provided === adminPw) return true;

  return false;
}

// ─── San Antonio ramp schedule ────────────────────────────────────────────────
// Week 1–2: 250/day, Week 3: 500/day, Week 4: 1000/day, Week 5+: unlimited
const SA_DAILY_CAP = 250; // current cap — adjust as reputation builds

const CITY_CALENDAR_URL: Record<string, string> = {
  'San Antonio': 'https://www.localbusinesscalendars.com/texas/san-antonio',
  'Austin':      'https://www.localbusinesscalendars.com/texas/austin',
  'Dallas':      'https://www.localbusinesscalendars.com/texas/dallas',
  'Houston':     'https://www.localbusinesscalendars.com/texas/houston',
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
  // Always use CT date — server runs UTC
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
  const [y, m, d] = todayStr.split('-').map(Number);
  const today = new Date(y, m - 1, d);
  const day = today.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

  // If Friday (5), Saturday (6), or Sunday (0) — look ahead to NEXT Monday's week
  // If Monday–Thursday (1–4) — use the current week
  let diffToMonday: number;
  if (day === 0) {
    diffToMonday = 1;        // Sun → next Mon
  } else if (day >= 5) {
    diffToMonday = 8 - day;  // Fri → +3, Sat → +2
  } else {
    diffToMonday = 1 - day;  // Mon → 0, Tue → -1, etc.
  }

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  return { monday: fmt(monday), sunday: fmt(sunday) };
}

function todayCST(): string {
  // Returns YYYY-MM-DD in US/Central time
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

// ─── Sponsor rotation ─────────────────────────────────────────────────────────
// Returns the ISO week number for a given YYYY-MM-DD (the week's Monday).
// Used to rotate which sponsor leads the email so every sponsor gets the top
// slot equally over time.
function isoWeekNumber(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  // Thursday of this week determines the ISO year/week
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 86400000));
}

// Rotate the sponsor array by the week number so the lead position cycles
// through every sponsor evenly. Works for any count (1–4): with 2 sponsors
// they alternate the top slot each week; with 1 it's always top; with 0 it's
// a no-op. Rotating the whole array means #2/#3 (in-body) and #4 (recap) also
// cycle, so no single sponsor is permanently buried.
function rotateSponsors(sponsors: SponsorData[], weekNumber: number): SponsorData[] {
  if (sponsors.length <= 1) return sponsors;
  const shift = weekNumber % sponsors.length;
  return [...sponsors.slice(shift), ...sponsors.slice(0, shift)];
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

interface SponsorData {
  name: string;
  url?: string | null;
  tagline?: string | null;
  logo_url?: string | null;
  quote?: string | null;
}

// Shared inner markup for a full sponsor block — NPR-underwriting voice.
// Every sponsor gets the same treatment: a "support comes from" label, the
// org name + tagline, an optional italic quote (when present in the DB), and a
// personal "Please support {Name} →" call to action. Used for ALL sponsors so
// blocks look identical; rotation order is the only difference.
function sponsorBlockInner(sponsor: SponsorData, label: string): string {
  const supportCta = sponsor.url
    ? `<a href="${sponsor.url}" target="_blank" style="font-size:11px;font-weight:700;color:#1a3a5c;text-decoration:none;white-space:nowrap;">Please support ${sponsor.name} →</a>`
    : '';
  return `
        <p style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8a8a;margin:0 0 7px 0;">${label}</p>
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            ${sponsor.logo_url ? `<td width="60" style="vertical-align:top;padding-right:12px;"><img src="${sponsor.logo_url}" width="52" height="52" alt="${sponsor.name} logo" style="display:block;object-fit:contain;border-radius:4px;" /></td>` : ''}
            <td style="vertical-align:top;">
              ${sponsor.url
                ? `<a href="${sponsor.url}" target="_blank" style="font-size:14px;font-weight:700;color:#1a1a1a;text-decoration:none;">${sponsor.name}</a>`
                : `<span style="font-size:14px;font-weight:700;color:#1a1a1a;">${sponsor.name}</span>`}
              ${sponsor.tagline ? `<br><span style="font-size:11px;color:#666;">${sponsor.tagline}</span>` : ''}
              ${sponsor.quote ? `<br><span style="font-size:11px;color:#555;font-style:italic;line-height:1.5;display:inline-block;margin-top:5px;">“${sponsor.quote}”</span>` : ''}
              ${supportCta ? `<br><span style="display:inline-block;margin-top:7px;">${supportCta}</span>` : ''}
            </td>
          </tr>
        </table>`;
}

// A full sponsor block wrapped as an events-table <tr>, for positions 2–4
// woven through the event list. Same visual weight as the top block.
function buildSponsorRowBlock(sponsor: SponsorData): string {
  return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7f2;border:1px solid #e8e8e8;border-radius:4px;">
              <tr>
                <td style="padding:14px 16px;">
                  ${sponsorBlockInner(sponsor, 'Support comes from')}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

// Pre-footer recap card: a clear thank-you that names every sponsor and makes
// it plain the free calendar exists because of them. Features the last sponsor
// in the (rotated) list so the in-body/recap features stay varied week to week.
// Adapts gracefully to any sponsor count (1–4).
function buildSponsorRecap(sponsors: SponsorData[]): string {
  if (sponsors.length === 0) return '';
  const multiple = sponsors.length > 1;
  const names = sponsors
    .map(s => s.url
      ? `<a href="${s.url}" target="_blank" style="color:#1a3a5c;text-decoration:none;font-weight:600;">${s.name}</a>`
      : `<span style="font-weight:600;color:#333;">${s.name}</span>`)
    .join(' &nbsp;·&nbsp; ');
  const header = 'Brought to you this week by';
  const thankLine = multiple
    ? `This calendar reaches your inbox free every week only because these ${sponsors.length} organizations choose to support it. If they ever earn your business, please give it to them.`
    : `This calendar reaches your inbox free every week only because this organization chooses to support it. If they ever earn your business, please give it to them.`;
  return `
    <!-- SPONSOR RECAP -->
    <tr>
      <td style="padding:0 24px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;border:1px solid #e6e0d4;border-radius:4px;">
          <tr>
            <td style="padding:14px 16px 6px;">
              <span style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#8a8a8a;">${header}</span><br>
              <span style="font-size:12px;line-height:1.9;">${names}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px 14px;">
              <span style="font-size:11px;color:#6b6b6b;line-height:1.6;">${thankLine}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function buildSponsorBlock(sponsor: SponsorData | null, city: string): string {
  if (sponsor) {
    const leadLabel = 'Support for this free calendar comes from';
    return `
    <!-- SPONSOR BLOCK (active, position 1) -->
    <tr>
      <td style="background:#f9f7f2;border-bottom:1px solid #e8e8e8;padding:16px 24px;">
        ${sponsorBlockInner(sponsor, leadLabel)}
      </td>
    </tr>`;
  }
  // No sponsor — community supported fallback
  return `
    <!-- SPONSOR BLOCK (community supported) -->
    <tr>
      <td style="background:#fafafa;border-bottom:1px solid #e8e8e8;padding:12px 24px;">
        <p style="font-size:11px;color:#aaa;margin:0;line-height:1.6;">
          🤝 This free newsletter is community supported.
          <a href="https://localbusinesscalendars.com/sponsor" style="color:#1a3a5c;text-decoration:none;font-weight:600;">Become a sponsor →</a>
        </p>
      </td>
    </tr>`;
}

function buildNewsletterHtml(
  city: string,
  weekLabel: string,
  events: EventRow[],
  firstName: string | null,
  unsubToken: string,
  subCalendar: string | null = null,
  sponsors: SponsorData[] = [],
): string {
  const calUrl = CITY_CALENDAR_URL[city] ?? 'https://www.localbusinesscalendars.com';
  const unsubUrl = `https://www.localbusinesscalendars.com/unsubscribe?token=${unsubToken}`;
  const greeting = firstName ? `Hey ${firstName},` : 'Hey there,';
  const headerLabel = subCalendar ? `${city} — ${subCalendar}` : `${city}`;
  const eventsHeading = subCalendar ? `${subCalendar} Events This Week` : `This Week's Events`;
  const topSponsor = sponsors[0] ?? null;

  const eventRowList = events.map(e => {
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
      });

  // Position 1 (sponsors[0]) shows in the top block. The remaining sponsors
  // (sponsors[1..3]) appear as full, identical sponsor blocks spread evenly
  // through the event list. Insert from the back so earlier indices stay valid.
  const rest = sponsors.slice(1);
  if (events.length > 0 && rest.length > 0) {
    const n = eventRowList.length;
    // Even insertion points: with k blocks, place them at k/(k+1) fractions.
    const points = rest.map((_, i) => Math.min(Math.round((n * (i + 1)) / (rest.length + 1)), n));
    for (let i = rest.length - 1; i >= 0; i--) {
      eventRowList.splice(points[i], 0, buildSponsorRowBlock(rest[i]));
    }
  }

  // When there are no events, still show every sponsor so all four always
  // appear — stack the remaining blocks under the "no events" note.
  const eventRows = events.length === 0
    ? `<tr><td style="padding:16px 0;color:#aaa;font-size:13px;font-style:italic;">No events found for this week — check back next Monday!</td></tr>`
      + rest.map(s => buildSponsorRowBlock(s)).join('')
    : eventRowList.join('');

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
              <span style="font-size:18px;font-weight:700;color:#1a1a1a;">${headerLabel} — This Week</span>
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

    ${buildSponsorBlock(topSponsor, city)}

    <!-- GREETING -->
    <tr>
      <td style="padding:20px 24px 4px;">
        <p style="font-size:14px;color:#333;margin:0 0 16px;">${greeting}</p>
        <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#888;margin:0 0 14px;padding-bottom:6px;border-bottom:1px solid #e8e8e8;">${eventsHeading}</p>
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

    ${buildSponsorRecap(sponsors)}

    <!-- FOOTER -->
    <tr>
      <td style="padding:14px 24px;border-top:1px solid #e8e8e8;text-align:center;">
        <p style="font-size:11px;color:#aaa;margin:0;line-height:1.8;">
          You're receiving this free newsletter${sponsors.length > 0 ? ' thanks to our sponsors' : ' — community supported'}.<br>
          <a href="${calUrl}" style="color:#1a3a5c;text-decoration:none;">Visit the calendar</a>
          &nbsp;·&nbsp;
          <a href="${unsubUrl}" style="color:#1a3a5c;text-decoration:none;">Unsubscribe</a>
        </p>
        <p style="font-size:10px;color:#bbb;margin:6px 0 0;">
          Local Business Calendars · 2400 McCullough #12041, San Antonio, TX 78212
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Sub-cal event category filter (mirrors frontend logic) ──────────────────

function eventCategoryMatchesSubCal(eventCategory: string | null, subCal: string): boolean {
  if (!eventCategory) return false;
  const cat = eventCategory.toLowerCase();
  const sub = subCal.toLowerCase().replace(' ', '-');
  const map: Record<string, string[]> = {
    'networking':     ['networking'],
    'technology':     ['technology', 'tech'],
    'real-estate':    ['real estate', 'real-estate', 'realestate'],
    'chamber':        ['chamber'],
    'small-business': ['small business', 'small-business', 'smallbusiness'],
  };
  return (map[sub] || [sub]).some(v => cat.includes(v));
}

// ─── Subject line helper ──────────────────────────────────────────────────────

function buildSubject(city: string, subCalendar: string | null): string {
  return subCalendar
    ? `${city} ${subCalendar} Events — This Week`
    : `${city} Business Events — This Week`;
}

function buildLabel(city: string, subCalendar: string | null): string {
  return subCalendar ? `${city} — ${subCalendar}` : `${city} (all events)`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!requireSendAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { city, dryRun, testEmails } = body;
    // Explicitly handle subCalendar — treat missing/undefined/empty string all as null
    const subCalendar: string | null = body.subCalendar && typeof body.subCalendar === 'string'
      ? body.subCalendar
      : null;

    console.log('[send-newsletter] city:', city, '| subCalendar:', subCalendar, '| testEmails:', !!testEmails);

    // SUB-CAL: sub-calendar sends are paused while sub-calendar pages are hidden.
    // Remove this block to re-enable (see src/lib/subCalendars.ts).
    if (subCalendar && !SUB_CALENDARS_ENABLED) {
      return NextResponse.json({ error: 'Sub-calendar newsletters are temporarily paused.' }, { status: 503 });
    }

    if (!city) {
      return NextResponse.json({ error: 'city is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const today = todayCST();
    const { monday, sunday } = getMondayThisSunday();
    const label = buildLabel(city, subCalendar);

    // ── 1. Fetch this week's events for the city ──────────────────────────────
    // For sub-cals we still pull all city events then filter by category,
    // matching the same logic the newsletter preview uses.
    // Uses events_approved (same view as the admin preview) to stay in sync.
    let eventsQuery = supabase
      .from('events_approved')
      .select('id, name, start_date, start_time, org_name, address, website, paid, event_category')
      .eq('city_calendar', city)
      .gte('start_date', monday)
      .lte('start_date', sunday)
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true });

    const { data: eventsData, error: eventsError } = await eventsQuery;

    if (eventsError) {
      return NextResponse.json({ error: 'Failed to fetch events', detail: eventsError.message }, { status: 500 });
    }

    let allCityEvents = (eventsData ?? []) as (EventRow & { event_category: string | null })[];

    // Filter to sub-cal category if needed
    const events: EventRow[] = subCalendar
      ? allCityEvents.filter(e => eventCategoryMatchesSubCal(e.event_category, subCalendar))
      : allCityEvents;

    // ── 2. Fetch sponsor for this city/subcal ─────────────────────────────────
    const citySlugMap: Record<string, string> = {
      'San Antonio': 'san-antonio', 'Austin': 'austin', 'Dallas': 'dallas', 'Houston': 'houston',
    };
    const citySlug = citySlugMap[city] ?? city.toLowerCase().replace(/\s+/g, '-');
    const categorySlug = subCalendar ? subCalendar.toLowerCase().replace(/\s+/g, '-') : null;

    // City-wide newsletters feature the city's 4 sponsor slots (same sponsors
    // shown on the city page). Slots are keyed by legacy category slugs under
    // the hood, but NO category labels are shown in the email.
    // Sub-cal sends (currently paused) still use their single category sponsor.
    const SLOT_ORDER = ['chamber', 'technology', 'real-estate', 'small-business'];
    let sponsors: SponsorData[] = [];
    if (categorySlug) {
      const { data: subSponsor } = await supabase
        .from('sponsors')
        .select('name, url, tagline, logo_url, quote')
        .eq('city_slug', citySlug)
        .eq('category_slug', categorySlug)
        .eq('active', true)
        .maybeSingle();
      if (subSponsor) sponsors = [subSponsor];
    } else {
      const { data: slotSponsors } = await supabase
        .from('sponsors')
        .select('name, url, tagline, logo_url, quote, category_slug')
        .eq('city_slug', citySlug)
        .eq('active', true)
        .in('category_slug', SLOT_ORDER);
      const bySlot = Object.fromEntries((slotSponsors ?? []).map(s => [s.category_slug, s]));
      sponsors = SLOT_ORDER.map(slug => bySlot[slug]).filter(Boolean) as SponsorData[];
    }

    // Rotate the lead slot weekly so every sponsor gets the top spot equally.
    // Anchored to the week's Monday so all sends in the same week match.
    // Sub-cal sends have a single sponsor, so rotation is a no-op there.
    sponsors = rotateSponsors(sponsors, isoWeekNumber(monday));

    // ── Format week label ─────────────────────────────────────────────────────
    const fmtDate = (s: string) => {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const weekLabel = `Week of ${fmtDate(monday)} – ${fmtDate(sunday)}`;

    // ── TEST SEND — bypass subscriber list and ramp logic entirely ────────────
    if (testEmails && Array.isArray(testEmails) && testEmails.length > 0) {
      const errors: { email: string; error: string }[] = [];
      let sentCount = 0;

      await Promise.all(testEmails.map(async (email: string) => {
        const unsubToken = Buffer.from(email).toString('base64');
        const html = buildNewsletterHtml(city, weekLabel, events, null, unsubToken, subCalendar, sponsors);
        const testHtml = html.replace(
          '<!-- HEADER -->',
          `<!-- TEST BANNER -->
    <tr>
      <td style="background:#f59e0b;padding:8px 24px;text-align:center;">
        <span style="font-size:11px;font-weight:700;color:#1c1917;letter-spacing:0.05em;">
          ⚠ TEST SEND — ${label} · Not sent to real subscribers.
        </span>
      </td>
    </tr>
    <!-- HEADER -->`,
        );

        try {
          await sgMail.send({
            to:      email,
            from:    { email: FROM_EMAIL, name: FROM_NAME },
            subject: `[TEST] ${buildSubject(city, subCalendar)}`,
            html:    testHtml,
          });
          sentCount++;
        } catch (err: any) {
          errors.push({ email, error: err?.message ?? 'unknown' });
        }
      }));

      return NextResponse.json({
        testSend: true,
        city,
        subCalendar,
        eventsCount: events.length,
        sentCount,
        sentTo: testEmails,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // ── 2. Fetch active subscribers for this list ─────────────────────────────
    // city-wide: sub_calendar IS NULL
    // sub-cal:   sub_calendar = 'Networking' (etc.)
    // NOTE: build the full query in one chain — Supabase query builder
    // reassignment is unreliable; conditional chaining must be done inline.
    // Idempotency + SA ramp continuation: exclude anyone already emailed for
    // THIS week (last_email_sent_at >= week's Monday). This means:
    //  - re-clicking Send can never double-email anyone
    //  - the SA daily ramp resumes where it left off instead of re-sending
    //    the same first 250 subscribers each day
    const notSentThisWeek = `last_email_sent_at.is.null,last_email_sent_at.lt.${monday}`;
    const { data: subsData, error: subsError } = subCalendar
      ? await supabase
          .from('newsletter_subscriptions')
          .select('id, email, first_name')
          .eq('city', city)
          .eq('status', 'active')
          .eq('sub_calendar', subCalendar)
          .or(notSentThisWeek)
          .order('id', { ascending: true })
      : await supabase
          .from('newsletter_subscriptions')
          .select('id, email, first_name')
          .eq('city', city)
          .eq('status', 'active')
          .is('sub_calendar', null)
          .or(notSentThisWeek)
          .order('id', { ascending: true });

    if (subsError) {
      return NextResponse.json({ error: 'Failed to fetch subscribers', detail: subsError.message }, { status: 500 });
    }

    const allSubs = (subsData ?? []) as { id: number; email: string; first_name: string | null }[];

    // ── 3. Apply SA daily ramp cap (per list — city-wide and each sub-cal tracked separately) ──
    let subsToSend = allSubs;
    let cappedAt: number | null = null;
    let alreadySentToday = 0;

    if (city === 'San Antonio') {
      const { count } = subCalendar
        ? await supabase
            .from('newsletter_sends')
            .select('*', { count: 'exact', head: true })
            .eq('city', city)
            .eq('send_date', today)
            .eq('sub_calendar', subCalendar)
        : await supabase
            .from('newsletter_sends')
            .select('*', { count: 'exact', head: true })
            .eq('city', city)
            .eq('send_date', today)
            .is('sub_calendar', null);
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

    // ── 4. Dry run ────────────────────────────────────────────────────────────
    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        city,
        subCalendar,
        eventsCount: events.length,
        totalSubscribers: allSubs.length,
        wouldSendTo: subsToSend.length,
        cappedAt,
        alreadySentToday,
        dailyCap: city === 'San Antonio' ? SA_DAILY_CAP : null,
        weekLabel,
      });
    }

    // ── 5. Send emails via SendGrid ───────────────────────────────────────────
    const errors: { email: string; error: string }[] = [];
    let sentCount = 0;
    const sentIds: number[] = [];
    const subject = buildSubject(city, subCalendar);

    const BATCH_SIZE = 50;
    for (let i = 0; i < subsToSend.length; i += BATCH_SIZE) {
      const batch = subsToSend.slice(i, i + BATCH_SIZE);

      await Promise.all(batch.map(async (sub) => {
        const unsubToken = Buffer.from(`id:${sub.id}`).toString('base64');
        const html = buildNewsletterHtml(city, weekLabel, events, sub.first_name, unsubToken, subCalendar, sponsors);

        try {
          await sgMail.send({
            to:      sub.email,
            from:    { email: FROM_EMAIL, name: FROM_NAME },
            subject,
            html,
          });
          sentCount++;
          sentIds.push(sub.id);
        } catch (err: any) {
          errors.push({ email: sub.email, error: err?.message ?? 'unknown' });
        }
      }));
    }

    // ── 6. Record the send in newsletter_sends ────────────────────────────────
    if (sentCount > 0) {
      await supabase.from('newsletter_sends').insert({
        city,
        sub_calendar: subCalendar,
        send_date: today,
        count_sent: sentCount,
        event_count: events.length,
        week_start: monday,
        week_end: sunday,
        sent_at: new Date().toISOString(),
      });

      await supabase
        .from('newsletter_subscriptions')
        .update({ last_email_sent_at: new Date().toISOString() })
        .in('id', sentIds);
    }

    return NextResponse.json({
      success: true,
      city,
      subCalendar,
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

// ─── GET — return today's send stats for a list ───────────────────────────────

export async function GET(req: NextRequest) {
  if (!requireSendAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const city       = req.nextUrl.searchParams.get('city');
  const subCalendar = req.nextUrl.searchParams.get('subCalendar') ?? null;

  if (!city) return NextResponse.json({ error: 'city required' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const today = todayCST();

  const { data } = subCalendar
    ? await supabase
        .from('newsletter_sends')
        .select('count_sent, sent_at')
        .eq('city', city)
        .eq('send_date', today)
        .eq('sub_calendar', subCalendar)
        .order('sent_at', { ascending: false })
    : await supabase
        .from('newsletter_sends')
        .select('count_sent, sent_at')
        .eq('city', city)
        .eq('send_date', today)
        .is('sub_calendar', null)
        .order('sent_at', { ascending: false });

  const sentToday = (data ?? []).reduce((sum, r) => sum + (r.count_sent ?? 0), 0);

  // Total active subscribers for this specific list
  const { count: totalSubs } = subCalendar
    ? await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('city', city)
        .eq('status', 'active')
        .eq('sub_calendar', subCalendar)
    : await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('city', city)
        .eq('status', 'active')
        .is('sub_calendar', null);

  return NextResponse.json({
    city,
    today,
    sentToday,
    totalSubscribers: totalSubs ?? 0,
    dailyCap: city === 'San Antonio' ? SA_DAILY_CAP : null,
    remaining: city === 'San Antonio' ? Math.max(0, SA_DAILY_CAP - sentToday) : null,
  });
}
