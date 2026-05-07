import type { Metadata } from 'next';
import { Homepage } from '../src/components/Homepage';
import { fetchThisWeekCounts } from '../src/lib/supabase-server';

export const revalidate = 300; // revalidate every 5 minutes

export const metadata: Metadata = {
  title: 'Local Business Calendars | Free Business & Networking Event Calendars by City',
  description: 'Find networking events, chamber meetings, tech meetups, real estate gatherings, and small business events in San Antonio, Austin, Dallas, and Houston. Free weekly newsletter by city.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Local Business Calendars | Free Business & Networking Event Calendars by City',
    description: 'Find networking events, chamber meetings, tech meetups, real estate gatherings, and small business events in San Antonio, Austin, Dallas, and Houston.',
    images: ['/logos/local-business-calendars-01.png'],
  },
};

export default async function Page() {
  const cityCounts = await fetchThisWeekCounts();
  return <Homepage cityCounts={cityCounts} />;
}
