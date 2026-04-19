import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRoleKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
  time_of_day: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};
