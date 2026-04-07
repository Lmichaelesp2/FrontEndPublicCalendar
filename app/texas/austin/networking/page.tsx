import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinNetworkingPage } from '../../../../src/components/cities/AustinNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Networking Events – Networking & Business',
  description: 'Austin Networking events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Austin Networking Events – Networking & Business',
    description: 'Austin-based Networking events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Austin Networking Events',
    description: 'Networking professionals in Austin – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
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
