import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonNetworkingPage } from '../../../../src/components/cities/HoustonNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Networking Events – Networking & Business',
  description: 'Houston Networking events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Houston Networking Events – Networking & Business',
    description: 'Houston-based Networking events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Houston Networking Events',
    description: 'Networking professionals in Houston – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'networking' });
  return (
    <CityProvider>
      <HoustonNetworkingPage initialEvents={events} />
    </CityProvider>
  );
}
