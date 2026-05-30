import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'michael@localbusinesscalendars.com';
const FROM_NAME  = 'Michael — Local Business Network';

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
  const lboUrl      = `https://www.localbusinessorganizations.com`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome — Your ${city} Business Network</title>
</head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:32px 40px;border-radius:8px 8px 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;font-family:Arial,sans-serif;">Local Business Network · ${city}</p>
              <h1 style="margin:12px 0 0;font-size:28px;color:#ffffff;font-weight:normal;">${firstName ? `You're in, ${firstName}.` : `You're in.`}</h1>
              <p style="margin:10px 0 0;font-size:14px;color:#aab4c4;font-family:Georgia,serif;font-style:italic;">Your free account connects two tools — the event calendar and the organization directory.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;">

              <p style="margin:0 0 20px;font-size:17px;color:#1a1a2e;line-height:1.6;">
                Hey ${name},
              </p>

              <p style="margin:0 0 24px;font-size:16px;color:#333;line-height:1.7;">
                Hey ${name} — here's everything your free ${city} account includes:
              </p>

              <!-- LBC block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="background:#1a3a5c;padding:14px 20px;">
                    <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif;">Local Business Calendars</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.7;">
                      The ${city} calendar is <strong>free and open</strong> — anyone can browse it anytime at LocalBusinessCalendars.com. No account needed.
                    </p>
                    <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.7;">
                      As a subscriber, you'll receive the <strong>${calLabel} Newsletter</strong> every Monday morning at 6 a.m. CT — a curated digest of upcoming ${city} business events delivered straight to your inbox.
                    </p>
                    <p style="margin:0 0 16px;font-size:14px;color:#666;line-height:1.6;">
                      You can add more city or category newsletters anytime by visiting any calendar page and clicking Subscribe Free.
                    </p>
                    <a href="${calendarUrl}" style="display:inline-block;background:#1a3a5c;color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;padding:10px 22px;border-radius:4px;text-decoration:none;letter-spacing:.5px;">
                      Visit the ${city} Calendar →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- LBO block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="background:#2d5016;padding:14px 20px;">
                    <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a8d57a;font-family:Arial,sans-serif;">Local Business Organizations</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.7;">
                      Your account unlocks full organization profiles on <strong>Local Business Organizations</strong> — the directory of ${city} chambers of commerce, professional associations, networking groups, and trade organizations.
                    </p>
                    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.7;">
                      Full profiles include contact info, descriptions, website, social links, and membership details. <strong>Same login, no extra signup needed.</strong>
                    </p>
                    <a href="${lboUrl}" style="display:inline-block;background:#2d5016;color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;padding:10px 22px;border-radius:4px;text-decoration:none;letter-spacing:.5px;">
                      Browse ${city} Organizations →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.7;">
                The professionals who show up consistently are the ones who build the relationships that lead to referrals, partnerships, and opportunities. I'm glad you're in.
              </p>

              <p style="margin:0 0 4px;font-size:16px;color:#1a1a2e;">— Michael</p>
              <p style="margin:0;font-size:14px;color:#888;font-family:Arial,sans-serif;">Local Business Calendars &amp; Local Business Organizations</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0ede6;padding:24px 40px;border-radius:0 0 8px 8px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;font-family:Arial,sans-serif;line-height:1.6;">
                You're receiving this because you created a free account on the Local Business Network.
              </p>
              <p style="margin:0;font-size:12px;color:#888;font-family:Arial,sans-serif;">
                <a href="https://businesscalendar.link/unsubscribe" style="color:#c9a84c;text-decoration:none;">Unsubscribe from newsletters</a>
                &nbsp;·&nbsp;
                <a href="https://businesscalendar.link" style="color:#c9a84c;text-decoration:none;">Local Business Calendars</a>
                &nbsp;·&nbsp;
                <a href="${lboUrl}" style="color:#c9a84c;text-decoration:none;">Local Business Organizations</a>
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
      subject: `You're in — your ${calLabel} newsletter starts Monday`,
      html:    buildWelcomeEmail(firstName, city, subCalendar),
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('SendGrid error:', err?.response?.body ?? err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
