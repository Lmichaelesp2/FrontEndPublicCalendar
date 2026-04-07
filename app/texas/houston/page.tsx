import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { HoustonPage } from '../../../src/components/cities/HoustonPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Business Calendar – Events & Networking',
  description: 'Houston business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
  openGraph: {
    title: 'Houston Business Calendar – Events & Networking',
    description: 'Discover Houston business events by industry category with weekly newsletter signup.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Houston Business Calendar',
    description: 'Browse Houston business events by industry.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston' });
  return (
    <CityProvider>
      <HoustonPage initialEvents={events} />
    </CityProvider>
  );
}
