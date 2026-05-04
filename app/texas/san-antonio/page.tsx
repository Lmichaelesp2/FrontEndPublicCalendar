import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { SanAntonioPage } from '../../../src/components/cities/SanAntonioPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Business Calendar – Events & Networking',
  description: 'San Antonio business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
    alternates: {
    canonical: '/texas/san-antonio',
  },
  openGraph: {
    title: 'San Antonio Business Calendar – Events & Networking',
    description: 'Discover San Antonio business events across technology, real estate, chamber, networking, and small business categories. Subscribe to weekly business event newsletters.',
    images: ['/logos/san-antonio-business-calendar-01.png'],
  },
  twitter: {
    title: 'San Antonio Business Calendar',
    description: 'Browse San Antonio business events by industry.',
    images: ['/logos/san-antonio-business-calendar-01.png'],
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
