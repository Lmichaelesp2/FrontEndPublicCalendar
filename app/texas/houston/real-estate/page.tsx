import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonRealEstatePage } from '../../../../src/components/cities/HoustonRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Real Estate Events – Networking & Business',
  description: 'Houston Real Estate events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Houston Real Estate Events – Networking & Business',
    description: 'Houston-based Real Estate events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Houston Real Estate Events',
    description: 'Real Estate professionals in Houston – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'real_estate' });
  return (
    <CityProvider>
      <HoustonRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
