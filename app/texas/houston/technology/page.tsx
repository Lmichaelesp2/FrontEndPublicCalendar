import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonTechnologyPage } from '../../../../src/components/cities/HoustonTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Technology Events – Networking & Business',
  description: 'Houston Technology events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Houston Technology Events – Networking & Business',
    description: 'Houston-based Technology events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Houston Technology Events',
    description: 'Technology professionals in Houston – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'technology' });
  return (
    <CityProvider>
      <HoustonTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
