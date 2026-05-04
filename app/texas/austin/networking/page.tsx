import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinNetworkingPage } from '../../../../src/components/cities/AustinNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Networking Events – Networking & Business',
  description: 'Austin Networking events calendar — browse upcoming professional networking mixers, B2B introductions, and industry happy hours in Austin, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/austin/networking',
  },
  openGraph: {
    title: 'Austin Networking Events – Networking & Business',
    description: 'Browse Austin Networking events — professional networking mixers, B2B introductions, and industry happy hours. Subscribe free.',
    images: ['/logos/austin-networking-calendar-01.png'],
  },
  twitter: {
    title: 'Austin Networking Events',
    description: 'Networking professionals in Austin – curated events.',
    images: ['/logos/austin-networking-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'networking' });
  return (
    <CityProvider>
      <AustinNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
