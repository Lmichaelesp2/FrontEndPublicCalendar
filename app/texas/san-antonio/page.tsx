import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { SanAntonioPage } from '../../../src/components/cities/SanAntonioPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Business Calendar – Events & Networking',
  description: 'San Antonio business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
  openGraph: {
    title: 'San Antonio Business Calendar – Events & Networking',
    description: 'Discover San Antonio business events by industry category with weekly newsletter signup.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'San Antonio Business Calendar',
    description: 'Browse San Antonio business events by industry.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio' });
  return (
    <CityProvider>
      <SanAntonioPage initialEvents={events} />
    </CityProvider>
  );
}
