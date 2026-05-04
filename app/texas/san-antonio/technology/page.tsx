import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioTechnologyPage } from '../../../../src/components/cities/SanAntonioTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Technology Events – Networking & Business',
  description: 'San Antonio Technology events calendar — browse upcoming tech meetups, startup events, and innovation conferences in San Antonio, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/san-antonio/technology',
  },
  openGraph: {
    title: 'San Antonio Technology Events – Networking & Business',
    description: 'Browse San Antonio Technology events — tech meetups, startup events, and innovation conferences. Subscribe free.',
    images: ['/logos/san-antonio-technology-calendar-01.png'],
  },
  twitter: {
    title: 'San Antonio Technology Events',
    description: 'Technology professionals in San Antonio – curated events.',
    images: ['/logos/san-antonio-technology-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'technology' });
  return (
    <CityProvider>
      <SanAntonioTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
