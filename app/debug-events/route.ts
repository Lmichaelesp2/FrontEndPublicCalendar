import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(url, key);

  const { data: sample, error: e1 } = await supabase
    .from('events')
    .select('id, name, status, group_type, event_category, city_calendar, start_date')
    .limit(5);

  const { data: statusRows } = await supabase.from('events').select('status').limit(500);
  const statusCounts: Record<string, number> = {};
  (statusRows || []).forEach((r: Record<string, string | null>) => {
    const k = r.status ?? 'null';
    statusCounts[k] = (statusCounts[k] || 0) + 1;
  });

  const { data: gtRows } = await supabase.from('events').select('group_type').limit(500);
  const gtCounts: Record<string, number> = {};
  (gtRows || []).forEach((r: Record<string, string | null>) => {
    const k = r.group_type ?? 'null';
    gtCounts[k] = (gtCounts[k] || 0) + 1;
  });

  const { data: ecRows } = await supabase.from('events').select('event_category').limit(500);
  const ecCounts: Record<string, number> = {};
  (ecRows || []).forEach((r: Record<string, string | null>) => {
    const k = r.event_category ?? 'null';
    ecCounts[k] = (ecCounts[k] || 0) + 1;
  });

  return NextResponse.json({ sample, sample_error: e1?.message, statusCounts, gtCounts, ecCounts });
}
