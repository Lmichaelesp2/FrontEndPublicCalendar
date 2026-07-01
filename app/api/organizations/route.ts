import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../src/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'city param required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('organizations')
    .select('*')
    .eq('city', city)
    .eq('archive', false)
    .order('name', { ascending: true });

  if (error) {
    console.error('Organizations fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
