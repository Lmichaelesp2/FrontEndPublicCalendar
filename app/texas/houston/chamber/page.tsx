import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonChamberPage } from '../../../../src/components/cities/HoustonChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Chamber Events – Networking & Business',
  description: 'Houston Chamber events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Houston Chamber Events – Networking & Business',
    description: 'Houston-based Chamber events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Houston Chamber Events',
    description: 'Chamber professionals in Houston – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'chamber' });
  return (
    <CityProvider>
      <HoustonChamberPage initialEvents={events} />
    </CityProvider>
  );
}
