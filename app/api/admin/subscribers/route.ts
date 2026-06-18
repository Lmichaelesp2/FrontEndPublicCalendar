import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function isAuthorized(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace('Bearer ', '');
  const expected = process.env.ADMIN_PASSWORD;
  return expected && token === expected;
}

// ── GET — fetch subscribers or premium users ──────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const type = req.nextUrl.searchParams.get('type');
  const supabase = getAdminSupabase();

  // Fetch all newsletter subscriptions
  if (type === 'subscribers') {
    const PAGE = 1000;
    let all: unknown[] = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('id, email, first_name, city, sub_calendar, status, source, created_at')
        .order('created_at', { ascending: false })
        .range(from, from + PAGE - 1);
      if (error || !data || data.length === 0) break;
      all = [...all, ...data];
      if (data.length < PAGE) break;
      from += PAGE;
    }
    return NextResponse.json({ data: all });
  }

  // Fetch premium user_profiles + city lookup from users table
  if (type === 'premium') {
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, subscription_tier, subscription_status, stripe_customer_id, grace_period_ends_at, created_at, notes')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = profiles ?? [];

    if (rows.length > 0) {
      const emails = rows.map((r: { email: string }) => r.email.toLowerCase());
      const { data: userRows } = await supabase
        .from('users')
        .select('email, city')
        .in('email', emails);

      const cityMap = new Map<string, string>();
      for (const u of (userRows ?? []) as { email: string; city: string }[]) {
        cityMap.set(u.email.toLowerCase(), u.city);
      }
      for (const r of rows as { email: string; city?: string | null }[]) {
        r.city = cityMap.get(r.email.toLowerCase()) ?? null;
      }
    }

    return NextResponse.json({ data: rows });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

// ── POST — update subscriber (name/email/add subs) ────────────────────────────
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getAdminSupabase();
  const body = await req.json();
  const { oldEmail, newFirstName, newEmail, toAdd, toRemoveIds, existingIds } = body;

  // 1. Update name + email on existing rows
  if (existingIds?.length > 0) {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ first_name: newFirstName || null, email: newEmail })
      .in('id', existingIds);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 2. Delete removed subscriptions
  if (toRemoveIds?.length > 0) {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .delete()
      .in('id', toRemoveIds);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Insert new subscriptions
  if (toAdd?.length > 0) {
    const newRows = toAdd.map((a: { city: string; sub_calendar: string | null }) => ({
      email: newEmail,
      first_name: newFirstName || null,
      city: a.city,
      sub_calendar: a.sub_calendar,
      status: 'active',
      source: 'admin_added',
    }));
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert(newRows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// ── DELETE — remove all subscriptions for an email ───────────────────────────
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getAdminSupabase();
  const { ids } = await req.json();

  if (!ids?.length) return NextResponse.json({ error: 'No ids provided' }, { status: 400 });

  const { error } = await supabase
    .from('newsletter_subscriptions')
    .delete()
    .in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
