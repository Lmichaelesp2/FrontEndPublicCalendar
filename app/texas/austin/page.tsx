import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { AustinPage } from '../../../src/components/cities/AustinPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Business Calendar – Events & Networking',
  description: 'Austin business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
  openGraph: {
    title: 'Austin Business Calendar – Events & Networking',
    description: 'Discover Austin business events by industry category with weekly newsletter signup.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Austin Business Calendar',
    description: 'Browse Austin business events by industry.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin' });
  return (
    <CityProvider>
      <AustinPage initialEvents={events} />
    </CityProvider>
  );
}
