import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinChamberPage } from '../../../../src/components/cities/AustinChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Chamber Events – Networking & Business',
  description: 'Austin Chamber events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Austin Chamber Events – Networking & Business',
    description: 'Austin-based Chamber events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Austin Chamber Events',
    description: 'Chamber professionals in Austin – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'chamber' });
  return (
    <CityProvider>
      <AustinChamberPage initialEvents={events} />
    </CityProvider>
  );
}
