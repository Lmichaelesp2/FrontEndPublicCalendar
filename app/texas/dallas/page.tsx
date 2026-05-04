import type { Metadata } from 'next';
import { CityProvider } from '../../../src/contexts/CityContext';
import { DallasPage } from '../../../src/components/cities/DallasPage';
import { fetchApprovedEvents } from '../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Business Calendar – Events & Networking',
  description: 'Dallas business events by industry – Technology, Real Estate, Chamber, Small Business, Networking. Weekly newsletters.',
    alternates: {
    canonical: '/texas/dallas',
  },
  openGraph: {
    title: 'Dallas Business Calendar – Events & Networking',
    description: 'Discover Dallas business events across technology, real estate, chamber, networking, and small business categories. Subscribe to weekly business event newsletters.',
    images: ['/logos/dallas-business-calendar-01.png'],
  },
  twitter: {
    title: 'Dallas Business Calendar',
    description: 'Browse Dallas business events by industry.',
    images: ['/logos/dallas-business-calendar-01.png'],
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
