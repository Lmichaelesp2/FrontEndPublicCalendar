import { createClient } from '@supabase/supabase-js';
import type { Event } from './supabase';

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return createClient(url || 'https://placeholder.supabase.co', key || 'placeholder');
}

export async function fetchApprovedEvents(options?: {
  city?: string;
  eventCategory?: string;
}): Promise<Event[]> {
  const supabase = getServerSupabase();
  const today = new Date().toISOString().split('T')[0];

  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .gte('start_date', today)
    .order('start_date', { ascending: true });

  if (options?.city) {
    query = query.eq('city_calendar', options.city);
  }

  if (options?.eventCategory) {
    query = query.eq('event_category', options.eventCategory);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data || [];
}
