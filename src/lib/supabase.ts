import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
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
  group_name: string | null;
  participation: string;
  part_of_town: string | null;
  time_of_day: string | null;
  city_calendar: string | null;
  group_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};
