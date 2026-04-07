import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioChamberPage } from '../../../../src/components/cities/SanAntonioChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Chamber Events – Networking & Business',
  description: 'San Antonio Chamber events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'San Antonio Chamber Events – Networking & Business',
    description: 'San Antonio-based Chamber events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'San Antonio Chamber Events',
    description: 'Chamber professionals in San Antonio – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'chamber' });
  return (
    <CityProvider>
      <SanAntonioChamberPage initialEvents={events} />
    </CityProvider>
  );
}
