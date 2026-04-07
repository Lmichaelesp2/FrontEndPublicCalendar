import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasNetworkingPage } from '../../../../src/components/cities/DallasNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Networking Events – Networking & Business',
  description: 'Dallas Networking events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Dallas Networking Events – Networking & Business',
    description: 'Dallas-based Networking events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Dallas Networking Events',
    description: 'Networking professionals in Dallas – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
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
