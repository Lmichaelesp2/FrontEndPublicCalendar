import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, email, city, industry } = await req.json();

    if (!name || !email || !city || !industry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Notify Louis
    await sgMail.send({
      to: 'themobilecoach@gmail.com',
      from: 'noreply@localbusinesscalendars.com',
      replyTo: email,
      subject: `New TBN Waitlist — ${name} (${city})`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Industry:</strong> ${industry}</p>
      `,
    });

    // Confirm to the applicant
    await sgMail.send({
      to: email,
      from: 'michael@localbusinesscalendars.com',
      subject: `You're on the Texas Business Network waitlist`,
      html: `
        <p>Hi ${name},</p>
        <p>You're on the waitlist for the Texas Business Network in <strong>${city}</strong>.</p>
        <p>We're building cohorts of 25 members per city — hand-selected across five industries. When a spot opens in your city, I'll reach out directly to schedule a quick conversation.</p>
        <p>In the meantime, make sure you're using the calendar to stay active: <a href="https://localbusinesscalendars.com/texas/${city.toLowerCase().replace(/\s/g, '-')}">localbusinesscalendars.com</a></p>
        <p>— Louis<br>Texas Business Network</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('TBN waitlist error:', err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
