import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || process.env.Stripe)!);

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// Next.js App Router streams the raw body automatically — no bodyParser config needed

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('Stripe webhook error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // ── Handle subscription activated / updated ───────────────────────────────
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    let userId: string | null = null;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      userId = session.metadata?.supabase_user_id ?? null;
    } else {
      const sub = event.data.object as Stripe.Subscription;
      userId = sub.metadata?.supabase_user_id ?? null;

      // If subscription is cancelled or past_due, downgrade
      if (sub.status === 'canceled' || sub.status === 'unpaid') {
        if (userId) {
          await supabase
            .from('user_profiles')
            .update({ subscription_tier: 'free' })
            .eq('id', userId);
          console.log(`Downgraded user ${userId} to free (sub status: ${sub.status})`);
        }
        return NextResponse.json({ received: true });
      }
    }

    if (userId) {
      const { error } = await supabase
        .from('user_profiles')
        .update({ subscription_tier: 'premium' })
        .eq('id', userId);

      if (error) {
        console.error('Failed to upgrade user:', userId, error);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }
      console.log(`Upgraded user ${userId} to premium`);
    }
  }

  // ── Handle subscription cancelled ─────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.supabase_user_id ?? null;

    if (userId) {
      await supabase
        .from('user_profiles')
        .update({ subscription_tier: 'free' })
        .eq('id', userId);
      console.log(`Downgraded user ${userId} to free (subscription deleted)`);
    }
  }

  return NextResponse.json({ received: true });
}
