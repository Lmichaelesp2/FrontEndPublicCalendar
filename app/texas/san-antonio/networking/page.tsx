import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioNetworkingPage } from '../../../../src/components/cities/SanAntonioNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Networking Events – Networking & Business',
  description: 'San Antonio Networking events calendar — browse upcoming professional networking mixers, B2B introductions, and industry happy hours in San Antonio, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/san-antonio/networking',
  },
  openGraph: {
    title: 'San Antonio Networking Events – Networking & Business',
    description: 'Browse San Antonio Networking events — professional networking mixers, B2B introductions, and industry happy hours. Subscribe free.',
    images: ['/logos/san-antonio-networking-calendar-01.png'],
  },
  twitter: {
    title: 'San Antonio Networking Events',
    description: 'Networking professionals in San Antonio – curated events.',
    images: ['/logos/san-antonio-networking-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'networking' });
  return (
    <CityProvider>
      <SanAntonioNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
