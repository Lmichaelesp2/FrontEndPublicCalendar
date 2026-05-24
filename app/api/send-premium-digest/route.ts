import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'michael@localbusinesscalendars.com';
const FROM_NAME  = 'Michael — Local Business Calendars';

const CITY_CALENDAR_URL: Record<string, string> = {
  'San Antonio': 'https://localbusinesscalendars.com/texas/san-antonio',
  'Austin':      'https://localbusinesscalendars.com/texas/austin',
  'Dallas':      'https://localbusinesscalendars.com/texas/dallas',
  'Houston':     'https://localbusinesscalendars.com/texas/houston',
};

// ─── Supabase admin client ────────────────────────────────────────────────────
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function getMondayThisSunday(): { monday: string; sunday: string } {
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
  const [y, m, d] = todayStr.split('-').map(Number);
  const today = new Date(y, m - 1, d);
  const day = today.getDay();
  let diffToMonday: number;
  if (day === 0) {
    diffToMonday = 1;
  } else if (day >= 5) {
    diffToMonday = 8 - day;
  } else {
    diffToMonday = 1 - day;
  }
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  return { monday: fmt(monday), sunday: fmt(sunday) };
}

function fmtDate(s: string): string {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function shortDayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const mon = d.toLocaleDateString('en-US', { month: 'numeric' });
  return `${weekday} ${mon}/${day}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventRow {
  id: number;
  name: string;
  start_date: string;
  start_time: string | null;
  org_name: string | null;
  address: string | null;
  website: string | null;
  paid: string | null;
  event_category: string | null;
  city_calendar: string;
}

interface NetworkProfile {
  categories: string[];
  city: string;
  timeOfDay: string[];
  participation: string;
}

// ─── Category filter (mirrors frontend logic) ─────────────────────────────────
function categoryMatchesFilter(
  eventCategory: string | null,
  filterCategories: string[],
): boolean {
  // No filter set = show all
  if (!filterCategories || filterCategories.length === 0) return true;
  if (!eventCategory) return false;
  const cat = eventCategory.toLowerCase();
  return filterCategories.some(fc => {
    const f = fc.toLowerCase();
    const map: Record<string, string[]> = {
      'networking':     ['networking'],
      'technology':     ['technology', 'tech'],
      'real estate':    ['real estate', 'real-estate', 'realestate'],
      'chamber':        ['chamber'],
      'small business': ['small business', 'small-business', 'smallbusiness'],
    };
    const terms = map[f] ?? [f];
    return terms.some(t => cat.includes(t));
  });
}

// ─── Shared event row builder ─────────────────────────────────────────────────
function buildEventRow(e: EventRow, highlight = false): string {
  const dayLabel = shortDayLabel(e.start_date);
  const venue    = e.org_name || e.address || '';
  const time     = e.start_time || '';
  const meta     = [venue, time].filter(Boolean).join(' · ');
  const link     = e.website ?? null;
  const rowBg    = highlight ? 'background:#fffbeb;border-left:3px solid #c9a84c;padding-left:10px;' : '';

  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;${rowBg}">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="60" style="vertical-align:top;padding-top:1px;">
            <span style="font-size:11px;font-weight:700;color:#1a3a5c;letter-spacing:0.04em;text-transform:uppercase;">${dayLabel}</span>
          </td>
          <td style="vertical-align:top;">
            ${highlight ? `<span style="font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#c9a84c;margin-bottom:2px;display:block;">★ Your Pick</span>` : ''}
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
}

// ─── Email HTML builder — combined picks + full city view ─────────────────────
function buildPremiumDigestHtml(
  firstName: string | null,
  city: string,
  categories: string[],
  weekLabel: string,
  myPicks: EventRow[],     // events matching the user's category filters
  allOther: EventRow[],    // remaining city events (not in picks)
): string {
  const calUrl    = CITY_CALENDAR_URL[city] ?? 'https://localbusinesscalendars.com';
  const greeting  = firstName ? `Hey ${firstName},` : 'Hey there,';
  const catLabel  = categories.length > 0 ? categories.join(', ') : 'All Events';

  // ── Your Picks section ───────────────────────────────────────────────────
  const picksRows = myPicks.length === 0
    ? `<tr><td style="padding:14px 0;color:#aaa;font-size:13px;font-style:italic;">
        No events match your preferences this week — check all city events below.
       </td></tr>`
    : myPicks.map(e => buildEventRow(e, true)).join('');

  // ── All other city events section ────────────────────────────────────────
  const otherRows = allOther.length === 0
    ? `<tr><td style="padding:14px 0;color:#aaa;font-size:13px;font-style:italic;">No other events this week.</td></tr>`
    : allOther.map(e => buildEventRow(e, false)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${city} — Your Personalized Business Digest</title>
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
              <span style="font-size:18px;font-weight:700;color:#1a1a1a;">${city} — Your Personalized Digest</span>
            </td>
            <td align="right" style="vertical-align:middle;">
              <span style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#c9a84c;font-weight:700;background:#1a1a2e;padding:3px 8px;border-radius:3px;">★ Premium</span>
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

    <!-- GREETING -->
    <tr>
      <td style="padding:20px 24px 4px;">
        <p style="font-size:14px;color:#333;margin:0 0 4px;">${greeting}</p>
        <p style="font-size:13px;color:#666;margin:0 0 20px;line-height:1.6;">
          Here's your weekly ${city} business calendar — your picks are highlighted at the top,
          followed by everything else happening this week.
        </p>
      </td>
    </tr>

    <!-- YOUR PICKS -->
    <tr>
      <td style="padding:0 24px 4px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 12px;background:#1a1a2e;border-radius:4px 4px 0 0;">
              <span style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#c9a84c;">★ Your Picks — ${catLabel}</span>
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #e8d88a;border-top:none;border-radius:0 0 4px 4px;padding:0 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${picksRows}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ALL CITY EVENTS -->
    <tr>
      <td style="padding:20px 24px 4px;">
        <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#888;margin:0 0 14px;padding-bottom:6px;border-bottom:1px solid #e8e8e8;">
          All ${city} Events This Week
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${otherRows}
        </table>
      </td>
    </tr>

    <!-- CTA -->
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
          You're receiving this as a premium member of Local Business Calendars.<br>
          <a href="${calUrl}" style="color:#1a3a5c;text-decoration:none;">Visit the calendar</a>
          &nbsp;·&nbsp;
          <a href="https://localbusinesscalendars.com/account" style="color:#1a3a5c;text-decoration:none;">Manage your preferences</a>
          &nbsp;·&nbsp;
          <a href="https://localbusinesscalendars.com/account" style="color:#1a3a5c;text-decoration:none;">Unsubscribe</a>
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── GET — return premium digest stats ───────────────────────────────────────
export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data: premiumUsers, error } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('subscription_tier', 'premium');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = (premiumUsers ?? []).map((u: { id: string }) => u.id);
  const premiumCount = userIds.length;

  let withProfile = 0;
  if (premiumCount > 0) {
    const { count } = await supabase
      .from('user_filters')
      .select('*', { count: 'exact', head: true })
      .in('user_id', userIds)
      .eq('name', 'My Network Profile');
    withProfile = count ?? 0;
  }

  return NextResponse.json({
    premiumCount,
    withProfile,
    withoutProfile: premiumCount - withProfile,
  });
}

// ─── POST — send premium digest ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dryRun, testEmails } = body;

    const supabase  = getSupabaseAdmin();
    const { monday, sunday } = getMondayThisSunday();
    const weekLabel = `Week of ${fmtDate(monday)} – ${fmtDate(sunday)}`;

    // ── 1. Fetch all premium users ────────────────────────────────────────────
    const { data: premiumUsers, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, first_name')
      .eq('subscription_tier', 'premium');

    if (usersError) {
      return NextResponse.json(
        { error: 'Failed to fetch premium users', detail: usersError.message },
        { status: 500 },
      );
    }

    const users = (premiumUsers ?? []) as { id: string; email: string; first_name: string | null }[];

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        premiumCount: 0,
        sentCount: 0,
        message: 'No premium users found',
      });
    }

    const userIds = users.map(u => u.id);

    // ── TEST SEND ─────────────────────────────────────────────────────────────
    if (testEmails && Array.isArray(testEmails) && testEmails.length > 0) {
      // Use the first premium user's profile to build a representative preview
      const { data: sampleFilter } = await supabase
        .from('user_filters')
        .select('filter_view')
        .in('user_id', userIds)
        .eq('name', 'My Network Profile')
        .limit(1)
        .single();

      const profile   = sampleFilter?.filter_view as NetworkProfile | null;
      const city      = profile?.city ?? 'San Antonio';
      const categories = profile?.categories ?? [];

      const { data: eventsData } = await supabase
        .from('events_published_view')
        .select('id, name, start_date, start_time, org_name, address, website, paid, event_category, city_calendar')
        .eq('status', 'approved')
        .eq('city_calendar', city)
        .gte('start_date', monday)
        .lte('start_date', sunday)
        .order('start_date', { ascending: true });

      const allCityEvents = (eventsData ?? []) as EventRow[];
      const myPicks  = allCityEvents.filter(e => categoryMatchesFilter(e.event_category, categories));
      const pickIds  = new Set(myPicks.map(e => e.id));
      const allOther = allCityEvents.filter(e => !pickIds.has(e.id));

      const errors: { email: string; error: string }[] = [];
      let sentCount = 0;

      await Promise.all(
        testEmails.map(async (email: string) => {
          const catLabel  = categories.length > 0 ? categories.join(', ') : 'All Events';
          const baseHtml  = buildPremiumDigestHtml(null, city, categories, weekLabel, myPicks, allOther);
          const testHtml  = baseHtml.replace(
            '<!-- HEADER -->',
            `<!-- TEST BANNER -->
    <tr>
      <td style="background:#f59e0b;padding:8px 24px;text-align:center;">
        <span style="font-size:11px;font-weight:700;color:#1c1917;letter-spacing:0.05em;">
          ⚠ TEST — ${city} · ${catLabel} · Not sent to real subscribers.
        </span>
      </td>
    </tr>
    <!-- HEADER -->`,
          );
          try {
            await sgMail.send({
              to:      email,
              from:    { email: FROM_EMAIL, name: FROM_NAME },
              subject: `[TEST] Your ${city} Personalized Business Digest — This Week`,
              html:    testHtml,
            });
            sentCount++;
          } catch (err: any) {
            errors.push({ email, error: err?.message ?? 'unknown' });
          }
        }),
      );

      return NextResponse.json({
        testSend:    true,
        city,
        categories,
        picksCount:  myPicks.length,
        totalEvents: allCityEvents.length,
        sentCount,
        sentTo:      testEmails,
        errors:      errors.length > 0 ? errors : undefined,
      });
    }

    // ── 2. Fetch all network profiles ─────────────────────────────────────────
    const { data: filtersData, error: filtersError } = await supabase
      .from('user_filters')
      .select('user_id, filter_view')
      .in('user_id', userIds)
      .eq('name', 'My Network Profile');

    if (filtersError) {
      return NextResponse.json(
        { error: 'Failed to fetch user filters', detail: filtersError.message },
        { status: 500 },
      );
    }

    const filterMap = new Map<string, NetworkProfile>();
    for (const f of (filtersData ?? [])) {
      filterMap.set(f.user_id, f.filter_view as NetworkProfile);
    }

    // ── 3. Fetch all this-week events across all cities ───────────────────────
    const { data: allEventsData } = await supabase
      .from('events_published_view')
      .select('id, name, start_date, start_time, org_name, address, website, paid, event_category, city_calendar')
      .eq('status', 'approved')
      .gte('start_date', monday)
      .lte('start_date', sunday)
      .order('start_date', { ascending: true });

    const allEvents = (allEventsData ?? []) as EventRow[];

    // ── 4. DRY RUN ────────────────────────────────────────────────────────────
    if (dryRun) {
      const withProfile    = users.filter(u => filterMap.has(u.id));
      const withoutProfile = users.filter(u => !filterMap.has(u.id));

      const preview = withProfile.slice(0, 5).map(u => {
        const profile    = filterMap.get(u.id)!;
        const cityEvents = allEvents.filter(e => e.city_calendar === profile.city);
        const myPicks    = cityEvents.filter(e => categoryMatchesFilter(e.event_category, profile.categories));
        return {
          email:          u.email,
          city:           profile.city,
          categories:     profile.categories,
          picksCount:     myPicks.length,
          totalCityEvents: cityEvents.length,
        };
      });

      return NextResponse.json({
        dryRun:         true,
        premiumCount:   users.length,
        withProfile:    withProfile.length,
        withoutProfile: withoutProfile.length,
        weekLabel,
        preview,
      });
    }

    // ── 5. Send personalized emails ───────────────────────────────────────────
    const errors: { email: string; error: string }[] = [];
    let sentCount        = 0;
    let skippedNoProfile = 0;

    const usersWithProfile = users.filter(u => filterMap.has(u.id));
    skippedNoProfile       = users.length - usersWithProfile.length;

    const BATCH_SIZE = 50;
    for (let i = 0; i < usersWithProfile.length; i += BATCH_SIZE) {
      const batch = usersWithProfile.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async user => {
          const profile    = filterMap.get(user.id)!;
          const cityEvents = allEvents.filter(e => e.city_calendar === profile.city);
          const myPicks    = cityEvents.filter(e =>
            categoryMatchesFilter(e.event_category, profile.categories),
          );
          const pickIds    = new Set(myPicks.map(e => e.id));
          const allOther   = cityEvents.filter(e => !pickIds.has(e.id));

          const catLabel = profile.categories.length > 0
            ? profile.categories.join(' + ')
            : 'All';
          const subject  = `Your ${profile.city} ${catLabel} Events — This Week`;
          const html     = buildPremiumDigestHtml(
            user.first_name,
            profile.city,
            profile.categories,
            weekLabel,
            myPicks,
            allOther,
          );

          try {
            await sgMail.send({
              to:   user.email,
              from: { email: FROM_EMAIL, name: FROM_NAME },
              subject,
              html,
            });
            sentCount++;
          } catch (err: any) {
            errors.push({ email: user.email, error: err?.message ?? 'unknown' });
          }
        }),
      );
    }

    return NextResponse.json({
      success:         true,
      premiumCount:    users.length,
      sentCount,
      skippedNoProfile,
      weekLabel,
      errors:          errors.length > 0 ? errors : undefined,
    });

  } catch (err: any) {
    console.error('[send-premium-digest] error:', err);
    return NextResponse.json(
      { error: 'Internal server error', detail: err?.message },
      { status: 500 },
    );
  }
}
