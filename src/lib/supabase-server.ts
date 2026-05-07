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
    .from('events')
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

  // This week = today through end of Sunday
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon...
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - day); // back to Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // through Saturday

  const from = startOfWeek.toISOString().split('T')[0];
  const to = endOfWeek.toISOString().split('T')[0];

  const cities = ['San Antonio', 'Austin', 'Dallas', 'Houston'];
  const counts: Record<string, number> = {};

  await Promise.all(
    cities.map(async (city) => {
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .eq('city_calendar', city)
        .gte('start_date', from)
        .lte('start_date', to);
      counts[city] = error ? 0 : (count ?? 0);
    })
  );

  return counts;
}
