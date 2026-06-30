import { createClient } from '@supabase/supabase-js';

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
}

// Maps backend category values → LBO PUBLIC_CATEGORIES labels (must match exactly)
const CATEGORY_MAP: Record<string, string> = {
  'Community/Edu':      'Community/Edu',
  'Technology':         'Technology',
  'Real Estate':        'Real Estate',
  'Networking':         'Networking',
  'Chambers':           'Chambers',
  'Const/Design/Mfg':  'Const/Design/Mfg',
  'Co-Working':         'Co-Working',
  'Fed/State/Local':    'Other',
  'Healthcare':         'Other',
  'Professional Svcs':  'Other',
  'Financial':          'Other',
  'Financial Services': 'Other',
  'Career/HR':          'Other',
  'Hospitality':        'Other',
  'Other':              'Other',
};

export async function fetchSAOrgCounts(): Promise<{
  orgCounts: Record<string, number>;
  totalOrgs: number;
}> {
  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from('organizations')
    .select('group_type, category')
    .eq('city', 'San Antonio')
    .eq('archive', false);

  if (error || !data) {
    console.error('fetchSAOrgCounts ERROR:', error);
    return { orgCounts: {}, totalOrgs: 0 };
  }

  const counts: Record<string, number> = {};

  for (const org of data) {
    // Try group_type first, then category
    const raw = (org.group_type || org.category || '').toLowerCase().trim();
    const mapped = CATEGORY_MAP[raw] ?? 'Other';
    counts[mapped] = (counts[mapped] ?? 0) + 1;
  }

  return { orgCounts: counts, totalOrgs: data.length };
}
