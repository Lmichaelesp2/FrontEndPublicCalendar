import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { AustinPage } from '../../../src/components/cities/AustinPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Business Calendar – Events & Networking',
  description: 'Austin business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
    alternates: {
    canonical: '/texas/austin',
  },
  openGraph: {
    title: 'Austin Business Calendar – Events & Networking',
    description: 'Discover Austin business events across technology, real estate, chamber, networking, and small business categories. Subscribe to weekly business event newsletters.',
    images: ['/logos/austin-business-calendar-01.png'],
  },
  twitter: {
    title: 'Austin Business Calendar',
    description: 'Browse Austin business events by industry.',
    images: ['/logos/austin-business-calendar-01.png'],
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
