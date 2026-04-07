import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasRealEstatePage } from '../../../../src/components/cities/DallasRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Real Estate Events – Networking & Business',
  description: 'Dallas Real Estate events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Dallas Real Estate Events – Networking & Business',
    description: 'Dallas-based Real Estate events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Dallas Real Estate Events',
    description: 'Real Estate professionals in Dallas – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'real_estate' });
  return (
    <CityProvider>
      <DallasRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
