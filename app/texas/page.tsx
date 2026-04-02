import { TexasMainLayout } from '../../src/components/TexasMainLayout';
import { fetchApprovedEvents } from '../../src/lib/supabase-server';

export default async function Page() {
  const today = new Date().toISOString().split('T')[0];
  const initialEvents = await fetchApprovedEvents({ date: today });
  return <TexasMainLayout initialEvents={initialEvents} />;
}
