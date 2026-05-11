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

  let email: string;
  try {
    email = Buffer.from(token, 'base64').toString('utf-8');
    // Basic sanity check
    if (!email || !email.includes('@')) throw new Error('invalid');
  } catch {
    return NextResponse.redirect(new URL('/unsubscribe?error=invalid', req.url));
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('newsletter_subscriptions')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', email.trim().toLowerCase());

  if (error) {
    console.error('Unsubscribe error:', error.message);
    return NextResponse.redirect(new URL('/unsubscribe?error=server', req.url));
  }

  // Redirect to confirmation page with email param for the message
  const encoded = encodeURIComponent(email.trim().toLowerCase());
  return NextResponse.redirect(new URL(`/unsubscribe?success=1&email=${encoded}`, req.url));
}
