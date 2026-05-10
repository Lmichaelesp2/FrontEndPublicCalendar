import type { Metadata } from 'next';
import { TexasMainLayout } from '../../src/components/TexasMainLayout';
import { fetchApprovedEvents, fetchThisWeekCounts } from '../../src/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Texas Business Calendars – Events by City & Industry',
  description: 'Discover Texas business events by city and industry. Browse Austin, Dallas, Houston, San Antonio events with weekly newsletters.',
  openGraph: {
    title: 'Texas Business Calendars – Events by City & Industry',
    description: 'Find business events across Texas cities and industries with weekly newsletters.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Texas Business Calendars',
    description: 'Browse Texas business events by city and industry.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export const revalidate = 300; // revalidate every 5 minutes

export default async function Page() {
  const [initialEvents, cityCounts] = await Promise.all([
    fetchApprovedEvents(),
    fetchThisWeekCounts(),
  ]);
  return <TexasMainLayout initialEvents={initialEvents} cityCounts={cityCounts} />;
}
