import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/unsubscribe?token=<base64-encoded-email>
// Called when subscriber clicks the unsubscribe link in any newsletter email.
// Decodes the token, marks ALL subscriptions for that email as unsubscribed.

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribe?error=missing', req.url));
  }

  let decoded: string;
  try {
    decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (!decoded) throw new Error('invalid');
  } catch {
    return NextResponse.redirect(new URL('/unsubscribe?error=invalid', req.url));
  }

  const supabase = getSupabaseAdmin();

  let email: string | null = null;

  if (decoded.startsWith('id:')) {
    // New format: "id:123" — unsubscribe only this specific subscription row
    const id = parseInt(decoded.slice(3), 10);
    if (isNaN(id)) {
      return NextResponse.redirect(new URL('/unsubscribe?error=invalid', req.url));
    }

    // Look up the email first so we can show it in the confirmation
    const { data: row } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('id', id)
      .single();
    email = row?.email ?? null;

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Unsubscribe error:', error.message);
      return NextResponse.redirect(new URL('/unsubscribe?error=server', req.url));
    }
  } else if (decoded.includes('@')) {
    // Legacy format: plain email — backward compat for links already sent
    email = decoded.trim().toLowerCase();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (error) {
      console.error('Unsubscribe error:', error.message);
      return NextResponse.redirect(new URL('/unsubscribe?error=server', req.url));
    }
  } else {
    return NextResponse.redirect(new URL('/unsubscribe?error=invalid', req.url));
  }

  // Redirect to confirmation page with email param for the message
  const encoded = email ? encodeURIComponent(email) : '';
  const successUrl = encoded
    ? `/unsubscribe?success=1&email=${encoded}`
    : '/unsubscribe?success=1';
  return NextResponse.redirect(new URL(successUrl, req.url));
}
