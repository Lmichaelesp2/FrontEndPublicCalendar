import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || process.env.Stripe)!);

// $14.99/month — Local Business Calendars Premium Subscription
const PREMIUM_PRICE_ID = 'price_1OTuLAJL7OE4OX2i9jD2DkcG';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  try {
    const { userId, email, returnUrl } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://www.localbusinesscalendars.com';
    const successUrl = `${origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = returnUrl ? `${origin}${returnUrl}` : `${origin}/`;

    // Check if user already has a Stripe customer ID stored
    const supabase = getSupabaseAdmin();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;

    // Create a Stripe customer if we don't have one yet
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;

      // Save it back so future checkouts reuse the same customer
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { supabase_user_id: userId },
      subscription_data: {
        metadata: { supabase_user_id: userId },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('create-checkout-session error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
