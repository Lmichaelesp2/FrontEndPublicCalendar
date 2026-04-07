import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioTechnologyPage } from '../../../../src/components/cities/SanAntonioTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Technology Events – Networking & Business',
  description: 'San Antonio Technology events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'San Antonio Technology Events – Networking & Business',
    description: 'San Antonio-based Technology events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'San Antonio Technology Events',
    description: 'Technology professionals in San Antonio – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'technology' });
  return (
    <CityProvider>
      <SanAntonioTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
