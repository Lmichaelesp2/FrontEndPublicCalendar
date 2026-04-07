import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinRealEstatePage } from '../../../../src/components/cities/AustinRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Real Estate Events – Networking & Business',
  description: 'Austin Real Estate events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Austin Real Estate Events – Networking & Business',
    description: 'Austin-based Real Estate events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Austin Real Estate Events',
    description: 'Real Estate professionals in Austin – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'real_estate' });
  return (
    <CityProvider>
      <AustinRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
