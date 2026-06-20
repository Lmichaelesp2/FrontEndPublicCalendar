import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'michael@localbusinesscalendars.com';
const FROM_NAME  = 'Michael — Local Business Calendars';

// ─── Auth ─────────────────────────────────────────────────────────────────────
// Same pattern as send-newsletter: fail closed if neither secret is configured.
function requireSendAuth(req: NextRequest): boolean {
  const bearer = req.headers.get('authorization');
  const sendSecret = process.env.NEWSLETTER_SEND_SECRET;
  if (sendSecret && bearer === `Bearer ${sendSecret}`) return true;

  const adminPw = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get('x-admin-password');
  if (adminPw && provided && provided === adminPw) return true;

  return false;
}

// ─── Daily caps per group ─────────────────────────────────────────────────────
// Group A ("warm"): already overlaps with active newsletter_subscriptions —
//   these people get mail regularly already, so this is a low-risk "in case
//   you missed it" note, not cold outreach.
// Group B ("cold"): free_subscribers with no recent send history — treat as a
//   genuinely cold/dormant-domain re-engagement, ramp much more conservatively.
// Both are adjustable here as deliverability metrics come in (bounce/spam %).
const DAILY_CAP: Record<'warm' | 'cold', number> = {
  warm: 100,
  cold: 25,
};

const CITY_CALENDAR_URL: Record<string, string> = {
  'San Antonio': 'https://www.localbusinesscalendars.com/texas/san-antonio',
  'Austin':      'https://www.localbusinesscalendars.com/texas/austin',
  'Dallas':      'https://www.localbusinesscalendars.com/texas/dallas',
  'Houston':     'https://www.localbusinesscalendars.com/texas/houston',
};

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function todayCST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

// ─── Email HTML ───────────────────────────────────────────────────────────────
function buildReengagementHtml(
  firstName: string | null,
  city: string,
  unsubToken: string,
): string {
  const calendarUrl = CITY_CALENDAR_URL[city] ?? 'https://www.localbusinesscalendars.com';
  const unsubUrl = `https://www.localbusinesscalendars.com/unsubscribe?token=${unsubToken}`;
  const name = firstName ? firstName : 'there';
  const calLabel = `${city} Business Calendar`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${city} Business Calendar — quick update</title>
</head>
<body style="margin:0;padding:0;background:#f7fafc;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1652f0;padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;color:#cfe0ff;text-transform:uppercase;font-family:Arial,sans-serif;">${city} Business Calendar</p>
              <h1 style="margin:12px 0 0;font-size:26px;color:#ffffff;font-weight:700;">Quick update on your account</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border:1px solid #e2e8f0;border-top:none;">

              <p style="margin:0 0 20px;font-size:16px;color:#1f2a3d;line-height:1.7;">
                Hey ${name},
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#1f2a3d;line-height:1.7;">
                A while back you signed up for the ${calLabel} — since then we've rebuilt it from the ground up, and wanted to make sure you knew what changed.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="background:#eef3fe;padding:14px 20px;">
                    <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#1652f0;font-weight:bold;font-family:Arial,sans-serif;">What's new</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px;font-size:15px;color:#1f2a3d;line-height:1.7;">
                      The calendar is now <strong>completely free, with no trial and no downgrade</strong> — the old free-trial model is gone. Your account is already active, no need to sign up again.
                    </p>
                    <p style="margin:0 0 16px;font-size:15px;color:#1f2a3d;line-height:1.7;">
                      Just head to the calendar and use <strong>Forgot Password</strong> to get back in — that's it.
                    </p>
                    <a href="${calendarUrl}" style="display:inline-block;background:#1652f0;color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;padding:11px 22px;border-radius:8px;text-decoration:none;letter-spacing:.5px;">
                      Visit the ${city} Calendar →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:15px;color:#1f2a3d;line-height:1.7;">
                If you'd like a calendar that's filtered just for you — your categories, your week, delivered straight to your inbox — that's what <strong>Event Assistant</strong> does. Totally optional, and easy to try.
              </p>

              <p style="margin:0 0 4px;font-size:16px;color:#1f2a3d;">— Michael</p>
              <p style="margin:0;font-size:14px;color:#5b6678;font-family:Arial,sans-serif;">Local Business Calendars</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;padding:24px 40px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
              <p style="margin:0 0 8px;font-size:12px;color:#5b6678;font-family:Arial,sans-serif;line-height:1.6;">
                You're receiving this one-time note because you signed up for the ${city} Business Calendar in the past.
              </p>
              <p style="margin:0;font-size:12px;color:#5b6678;font-family:Arial,sans-serif;">
                <a href="${unsubUrl}" style="color:#1652f0;text-decoration:none;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${calendarUrl}" style="color:#1652f0;text-decoration:none;">Visit the calendar</a>
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:#9aa5b4;font-family:Arial,sans-serif;">
                Local Business Calendars · 2400 McCullough #12041, San Antonio, TX 78212
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildSubject(city: string): string {
  return `Your ${city} Business Calendar account — quick update`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
// Body params:
//   group: 'warm' | 'cold'           (required unless testEmails is set)
//   city: string                     (optional — filters to one city)
//   dryRun: boolean                  (optional — report counts, send nothing)
//   testEmails: string[]             (optional — bypass list/cap, send N test emails)
//   limit: number                    (optional — override the day's cap, for controlled testing)

export async function POST(req: NextRequest) {
  if (!requireSendAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { group, city, dryRun, testEmails, limit } = body as {
      group?: 'warm' | 'cold';
      city?: string;
      dryRun?: boolean;
      testEmails?: string[];
      limit?: number;
    };

    const supabase = getSupabaseAdmin();
    const today = todayCST();

    // ── TEST SEND — bypass everything, send to explicit addresses only ───────
    if (testEmails && Array.isArray(testEmails) && testEmails.length > 0) {
      const testCity = city || 'San Antonio';
      const errors: { email: string; error: string }[] = [];
      let sentCount = 0;

      await Promise.all(testEmails.map(async (email: string) => {
        const unsubToken = Buffer.from(email).toString('base64');
        const html = buildReengagementHtml(null, testCity, unsubToken);
        const testHtml = html.replace(
          '<!-- Header -->',
          `<!-- TEST BANNER -->
            <tr>
              <td style="background:#f59e0b;padding:8px 24px;text-align:center;">
                <span style="font-size:11px;font-weight:700;color:#1c1917;letter-spacing:0.05em;">
                  ⚠ TEST SEND — Re-engagement (${testCity}) · Not sent to real subscribers.
                </span>
              </td>
            </tr>
            <!-- Header -->`,
        );

        try {
          await sgMail.send({
            to:      email,
            from:    { email: FROM_EMAIL, name: FROM_NAME },
            subject: `[TEST] ${buildSubject(testCity)}`,
            html:    testHtml,
          });
          sentCount++;
        } catch (err: any) {
          errors.push({ email, error: err?.message ?? 'unknown' });
        }
      }));

      return NextResponse.json({
        testSend: true,
        city: testCity,
        sentCount,
        sentTo: testEmails,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    if (!group || (group !== 'warm' && group !== 'cold')) {
      return NextResponse.json({ error: "group must be 'warm' or 'cold'" }, { status: 400 });
    }

    // ── 1. Build the candidate list ───────────────────────────────────────────
    // warm = free_subscribers rows whose email also has an ACTIVE row in
    //        newsletter_subscriptions (already getting mail regularly)
    // cold = free_subscribers rows with NO matching active newsletter_subscriptions row
    // Both exclude: premium users, anyone already sent (reengagement_sends),
    // and anyone marked unsubscribed.
    const { data: premiumRows } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('subscription_tier', 'premium');
    const premiumEmails = new Set((premiumRows ?? []).map((r: any) => (r.email || '').toLowerCase()));

    const { data: alreadySentRows } = await supabase
      .from('reengagement_sends')
      .select('free_subscriber_id')
      .eq('test_send', false);
    const alreadySentIds = new Set((alreadySentRows ?? []).map((r: any) => r.free_subscriber_id));

    let fsQuery = supabase
      .from('free_subscribers')
      .select('id, email, city, unsubscribe')
      .is('unsubscribe', null)
      .order('id', { ascending: true });
    if (city) fsQuery = fsQuery.eq('city', city);

    const { data: fsRows, error: fsError } = await fsQuery;
    if (fsError) {
      return NextResponse.json({ error: 'Failed to fetch free_subscribers', detail: fsError.message }, { status: 500 });
    }

    const { data: activeNlRows } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('status', 'active');
    const activeNlEmails = new Set((activeNlRows ?? []).map((r: any) => (r.email || '').toLowerCase()));

    const candidates = (fsRows ?? []).filter((r: any) => {
      const email = (r.email || '').toLowerCase();
      if (!email) return false;
      if (premiumEmails.has(email)) return false;
      if (alreadySentIds.has(r.id)) return false;
      const isWarm = activeNlEmails.has(email);
      return group === 'warm' ? isWarm : !isWarm;
    });

    // ── 2. Apply daily cap ────────────────────────────────────────────────────
    const { count: sentTodayCount } = await supabase
      .from('reengagement_sends')
      .select('*', { count: 'exact', head: true })
      .eq('send_date', today)
      .eq('send_group', group)
      .eq('test_send', false);
    const sentToday = sentTodayCount ?? 0;

    const cap = typeof limit === 'number' && limit > 0 ? limit : DAILY_CAP[group];
    const remaining = Math.max(0, cap - sentToday);
    const toSend = candidates.slice(0, remaining);

    // ── 3. Dry run ─────────────────────────────────────────────────────────────
    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        group,
        city: city || 'all',
        totalCandidates: candidates.length,
        sentToday,
        dailyCap: cap,
        wouldSendTo: toSend.length,
      });
    }

    if (toSend.length === 0) {
      return NextResponse.json({
        success: true,
        group,
        city: city || 'all',
        sentCount: 0,
        message: sentToday >= cap ? 'Daily cap already reached for this group' : 'No eligible candidates',
        sentToday,
        dailyCap: cap,
      });
    }

    // ── 4. Send ─────────────────────────────────────────────────────────────────
    const errors: { email: string; error: string }[] = [];
    let sentCount = 0;
    const sentRows: { free_subscriber_id: number; email: string; city: string | null }[] = [];

    const BATCH_SIZE = 25;
    for (let i = 0; i < toSend.length; i += BATCH_SIZE) {
      const batch = toSend.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (sub: any) => {
        const unsubToken = Buffer.from(`fs:${sub.id}`).toString('base64');
        const html = buildReengagementHtml(null, sub.city || 'San Antonio', unsubToken);

        try {
          await sgMail.send({
            to:      sub.email,
            from:    { email: FROM_EMAIL, name: FROM_NAME },
            subject: buildSubject(sub.city || 'San Antonio'),
            html,
          });
          sentCount++;
          sentRows.push({ free_subscriber_id: sub.id, email: sub.email, city: sub.city });
        } catch (err: any) {
          errors.push({ email: sub.email, error: err?.message ?? 'unknown' });
        }
      }));
    }

    if (sentRows.length > 0) {
      await supabase.from('reengagement_sends').insert(
        sentRows.map(r => ({
          free_subscriber_id: r.free_subscriber_id,
          email: r.email,
          city: r.city,
          send_group: group,
          send_date: today,
          test_send: false,
        })),
      );
    }

    return NextResponse.json({
      success: true,
      group,
      city: city || 'all',
      totalCandidates: candidates.length,
      sentCount,
      sentToday: sentToday + sentCount,
      dailyCap: cap,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (err: any) {
    console.error('send-reengagement error:', err);
    return NextResponse.json({ error: 'Internal server error', detail: err?.message }, { status: 500 });
  }
}

// ─── GET — stats for today/this group, for the admin panel ───────────────────
export async function GET(req: NextRequest) {
  if (!requireSendAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const today = todayCST();

  const { data, error } = await supabase
    .from('reengagement_sends')
    .select('send_group, city')
    .eq('send_date', today)
    .eq('test_send', false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const byGroup: Record<string, number> = {};
  for (const row of data ?? []) {
    byGroup[row.send_group] = (byGroup[row.send_group] ?? 0) + 1;
  }

  return NextResponse.json({ date: today, sentToday: byGroup, dailyCaps: DAILY_CAP });
}
