import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { DallasPage } from '../../../src/components/cities/DallasPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Business Calendar – Events & Networking',
  description: 'Dallas business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
  openGraph: {
    title: 'Dallas Business Calendar – Events & Networking',
    description: 'Discover Dallas business events by industry category with weekly newsletter signup.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Dallas Business Calendar',
    description: 'Browse Dallas business events by industry.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas' });
  return (
    <CityProvider>
      <DallasPage initialEvents={events} />
    </CityProvider>
  );
}
