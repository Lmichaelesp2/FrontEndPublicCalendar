import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Singleton — prevents multiple GoTrueClient instances in the same browser context
const globalForSupabase = globalThis as unknown as { _supabase?: SupabaseClient; _supabaseAdmin?: SupabaseClient };

// flowType: 'implicit' — PKCE requires the password-reset link to be opened
// in the same browser profile that requested it. Real users often request
// a reset on desktop and click the email link on their phone, which PKCE
// rejects as invalid even though it's legitimate. Implicit flow carries the
// session in the link itself, so it works from any device.
export const supabase = globalForSupabase._supabase ?? createClient(supabaseUrl, supabaseAnonKey, {
  auth: { flowType: 'implicit' },
});
if (!globalForSupabase._supabase) globalForSupabase._supabase = supabase;

export const supabaseAdmin = globalForSupabase._supabaseAdmin ?? createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
if (!globalForSupabase._supabaseAdmin) globalForSupabase._supabaseAdmin = supabaseAdmin;

export const CITIES = ['San Antonio', 'Austin', 'Dallas', 'Houston'] as const;
export type City = (typeof CITIES)[number];

export type Event = {
  id: string;
  name: string;
  start_date: string;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  website: string | null;
  description: string | null;
  paid: string;
  address: string | null;
  zipcode: string | null;
  org_name: string | null;
  org_home_page: string | null;
  participation: string;
  part_of_town: string | null;
  city_calendar: string | null;
  org_type: string | null;
  org_id: string | null;
  event_type: string | null;
  event_city: string | null;
  state: string | null;
  source: string | null;
  notes: string | null;
  internal_type: string | null;
  event_category: string | null;
  group_type: string | null;
  time_of_day: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};