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
    .order('start_date', { ascending: true });

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
