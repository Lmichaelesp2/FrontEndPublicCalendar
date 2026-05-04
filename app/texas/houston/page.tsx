import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { HoustonPage } from '../../../src/components/cities/HoustonPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Business Calendar – Events & Networking',
  description: 'Houston business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
    alternates: {
    canonical: '/texas/houston',
  },
  openGraph: {
    title: 'Houston Business Calendar – Events & Networking',
    description: 'Discover Houston business events across technology, real estate, chamber, networking, and small business categories. Subscribe to weekly business event newsletters.',
    images: ['/logos/houston-business-calendar-01.png'],
  },
  twitter: {
    title: 'Houston Business Calendar',
    description: 'Browse Houston business events by industry.',
    images: ['/logos/houston-business-calendar-01.png'],
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
