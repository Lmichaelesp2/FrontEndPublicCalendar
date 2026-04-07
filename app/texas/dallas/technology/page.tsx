import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasTechnologyPage } from '../../../../src/components/cities/DallasTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Technology Events – Networking & Business',
  description: 'Dallas Technology events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Dallas Technology Events – Networking & Business',
    description: 'Dallas-based Technology events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Dallas Technology Events',
    description: 'Technology professionals in Dallas – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'technology' });
  return (
    <CityProvider>
      <DallasTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
