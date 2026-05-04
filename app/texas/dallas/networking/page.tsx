import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasNetworkingPage } from '../../../../src/components/cities/DallasNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Networking Events – Networking & Business',
  description: 'Dallas Networking events calendar — browse upcoming professional networking mixers, B2B introductions, and industry happy hours in Dallas, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/dallas/networking',
  },
  openGraph: {
    title: 'Dallas Networking Events – Networking & Business',
    description: 'Browse Dallas Networking events — professional networking mixers, B2B introductions, and industry happy hours. Subscribe free.',
    images: ['/logos/dallas-networking-calendar-01.png'],
  },
  twitter: {
    title: 'Dallas Networking Events',
    description: 'Networking professionals in Dallas – curated events.',
    images: ['/logos/dallas-networking-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'networking' });
  return (
    <CityProvider>
      <DallasNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
