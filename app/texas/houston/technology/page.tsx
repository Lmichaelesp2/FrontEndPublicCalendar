import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonTechnologyPage } from '../../../../src/components/cities/HoustonTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Technology Events – Networking & Business',
  description: 'Houston Technology events calendar — browse upcoming tech meetups, startup events, and innovation conferences in Houston, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/houston/technology',
  },
  openGraph: {
    title: 'Houston Technology Events – Networking & Business',
    description: 'Browse Houston Technology events — tech meetups, startup events, and innovation conferences. Subscribe free.',
    images: ['/logos/houston-technology-calendar-01.png'],
  },
  twitter: {
    title: 'Houston Technology Events',
    description: 'Technology professionals in Houston – curated events.',
    images: ['/logos/houston-technology-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'technology' });
  return (
    <CityProvider>
      <HoustonTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
