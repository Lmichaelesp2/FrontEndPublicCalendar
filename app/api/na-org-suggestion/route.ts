import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { org_name, org_city, org_type, submitted_by } = await req.json();

    if (!org_name) {
      return NextResponse.json({ error: 'org_name is required' }, { status: 400 });
    }

    await sgMail.send({
      to:      'michael@localbusinesscalendars.com',
      from:    { email: 'michael@localbusinesscalendars.com', name: 'Networking Assistant' },
      subject: `New org suggestion: ${org_name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;padding:24px;background:#f9fafb;border-radius:8px;">
          <h2 style="margin:0 0 16px;color:#042C53;font-size:18px;">New Organization Suggestion</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:100px;">Name</td>
                <td style="padding:8px 0;font-weight:700;font-size:14px;color:#111827;">${org_name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">City</td>
                <td style="padding:8px 0;font-size:14px;color:#111827;">${org_city ?? '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Type</td>
                <td style="padding:8px 0;font-size:14px;color:#111827;">${org_type ?? '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Submitted by</td>
                <td style="padding:8px 0;font-size:14px;color:#111827;">${submitted_by ?? 'unknown'}</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">Submitted via Networking Assistant · Add to the LBC organizations database if valid.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('na-org-suggestion error:', err?.response?.body ?? err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
