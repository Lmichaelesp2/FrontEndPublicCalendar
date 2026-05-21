import { createClient } from '@supabase/supabase-js';
import type { Event } from './supabase';
import { resolveGroupType } from './cities';

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
}

export async function fetchApprovedEvents(options?: {
  city?: string;
  groupType?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Event[]> {
  const supabase = getServerSupabase();

  let query = supabase
    .from('events_approved')
    .select('*')
    .eq('status', 'approved')
    .order('start_date', { ascending: true })
    .limit(2000);

  if (options?.city) {
    query = query.eq('city_calendar', options.city);
  }

  if (options?.groupType) {
    query = query.eq('event_category', resolveGroupType(options.groupType));
  }

  const { data, error } = await query;
  if (error) {
    console.error('fetchApprovedEvents ERROR:', error);
    return [];
  }
  return data || [];
}

export async function fetchThisWeekCounts(): Promise<Record<string, number>> {
  const supabase = getServerSupabase();

  // Full week = always Sunday through Saturday of the current week
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon...6=Sat
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - day); // rewind to Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // forward to Saturday

  // Use local date strings to avoid UTC timezone shifting
  const pad = (n: number) => String(n).padStart(2, '0');
  const from = `${startOfWeek.getFullYear()}-${pad(startOfWeek.getMonth() + 1)}-${pad(startOfWeek.getDate())}`;
  const to = `${endOfWeek.getFullYear()}-${pad(endOfWeek.getMonth() + 1)}-${pad(endOfWeek.getDate())}`;

  const cities = ['San Antonio', 'Austin', 'Dallas', 'Houston'];
  const counts: Record<string, number> = {};

  await Promise.all(
    cities.map(async (city) => {
      const { count, error } = await supabase
        .from('events_week_counts')
        .select('*', { count: 'exact', head: true })
        .eq('city_calendar', city);
      counts[city] = error ? 0 : (count ?? 0);
    })
  );

  return counts;
}
