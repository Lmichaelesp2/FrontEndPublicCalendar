import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioRealEstatePage } from '../../../../src/components/cities/SanAntonioRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Real Estate Events – Networking & Business',
  description: 'San Antonio Real Estate events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'San Antonio Real Estate Events – Networking & Business',
    description: 'San Antonio-based Real Estate events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'San Antonio Real Estate Events',
    description: 'Real Estate professionals in San Antonio – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'real_estate' });
  return (
    <CityProvider>
      <SanAntonioRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
