import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'michael@localbusinesscalendars.com';
const FROM_NAME  = 'Michael — Local Business Calendars';

const CITY_CALENDAR_URL: Record<string, string> = {
  'San Antonio': 'https://businesscalendar.link/texas/san-antonio',
  'Austin':      'https://businesscalendar.link/texas/austin',
  'Dallas':      'https://businesscalendar.link/texas/dallas',
  'Houston':     'https://businesscalendar.link/texas/houston',
};

function buildWelcomeEmail(firstName: string | null, city: string, subCalendar: string | null): string {
  const name        = firstName ? firstName : 'there';
  const calendarUrl = CITY_CALENDAR_URL[city] ?? 'https://businesscalendar.link';
  const calLabel    = subCalendar ? `${city} ${subCalendar} Calendar` : `${city} Business Calendar`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${calLabel}</title>
</head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:32px 40px;border-radius:8px 8px 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;font-family:Arial,sans-serif;">Local Business Calendars</p>
              <h1 style="margin:12px 0 0;font-size:26px;color:#ffffff;font-weight:normal;">${calLabel}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;">

              <p style="margin:0 0 20px;font-size:17px;color:#1a1a2e;line-height:1.6;">
                Hey ${name},
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.7;">
                Welcome to the <strong>${calLabel}</strong> — you're all set.
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.7;">
                Every <strong>Monday at 6 a.m. CT</strong>, you'll get a curated digest of every upcoming business event in ${city} — networking mixers, chamber meetings, industry roundtables, and more — delivered straight to your inbox.
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.7;">
                You also now have access to <strong>full event details</strong> on the calendar — descriptions, locations, end times, and website links.
              </p>

              <p style="margin:0 0 32px;font-size:16px;color:#333;line-height:1.7;">
                One more thing — your account also gives you free access to <strong><a href="https://www.localbusinessorganizations.com/browse?city=${encodeURIComponent(city)}" style="color:#1a1a2e;text-decoration:underline;">Local Business Organizations</a></strong>, a directory of ${city} business organizations, chambers, and associations. Same login, no extra signup needed.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="background:#c9a84c;border-radius:4px;">
                    <a href="${calendarUrl}" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#1a1a2e;text-decoration:none;letter-spacing:.5px;">
                      View Your Calendar →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.7;">
                The professionals who show up consistently are the ones who build the relationships that lead to referrals, partnerships, and opportunities. I'm glad you're in.
              </p>

              <p style="margin:0 0 4px;font-size:16px;color:#1a1a2e;">— Michael</p>
              <p style="margin:0;font-size:14px;color:#888;font-family:Arial,sans-serif;">Local Business Calendars</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0ede6;padding:24px 40px;border-radius:0 0 8px 8px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;font-family:Arial,sans-serif;line-height:1.6;">
                You're receiving this because you subscribed to the ${calLabel}.
              </p>
              <p style="margin:0;font-size:12px;color:#888;font-family:Arial,sans-serif;">
                <a href="https://businesscalendar.link/unsubscribe" style="color:#c9a84c;text-decoration:none;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="https://businesscalendar.link" style="color:#c9a84c;text-decoration:none;">Visit the Calendar</a>
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

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, city, subCalendar } = await req.json();

    if (!email || !city) {
      return NextResponse.json({ error: 'email and city are required' }, { status: 400 });
    }

    const calLabel = subCalendar
      ? `${city} ${subCalendar} Calendar`
      : `${city} Business Calendar`;

    const msg = {
      to:      email,
      from:    { email: FROM_EMAIL, name: FROM_NAME },
      subject: `Welcome to the ${calLabel} 🗓`,
      html:    buildWelcomeEmail(firstName, city, subCalendar),
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('SendGrid error:', err?.response?.body ?? err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
