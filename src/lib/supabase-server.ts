import { createClient } from '@supabase/supabase-js';
import type { Event } from './supabase';
import { resolveGroupType } from './cities';

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return createClient(url || 'https://placeholder.supabase.co', key || 'placeholder');
}

export async function fetchApprovedEvents(options?: {
  city?: string;
  groupType?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Event[]> {
  const supabase = getServerSupabase();
  const today = new Date().toISOString().split('T')[0];

  const from = options?.dateFrom ?? today;
  const future60 = new Date();
  future60.setDate(future60.getDate() + 60);
  const to = options?.dateTo ?? future60.toISOString().split('T')[0];

  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .gte('start_date', from)
    .lte('start_date', to)
    .order('start_date', { ascending: true });

  if (options?.city) {
    query = query.eq('city_calendar', options.city);
  }

  if (options?.groupType) {
    query = query.eq('event_category', resolveGroupType(options.groupType));
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data || [];
}
