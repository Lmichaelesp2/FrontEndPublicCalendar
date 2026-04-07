import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioNetworkingPage } from '../../../../src/components/cities/SanAntonioNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Networking Events – Networking & Business',
  description: 'San Antonio Networking events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'San Antonio Networking Events – Networking & Business',
    description: 'San Antonio-based Networking events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'San Antonio Networking Events',
    description: 'Networking professionals in San Antonio – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
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
