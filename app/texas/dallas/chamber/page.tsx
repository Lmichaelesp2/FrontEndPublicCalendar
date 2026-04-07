import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasChamberPage } from '../../../../src/components/cities/DallasChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Chamber Events – Networking & Business',
  description: 'Dallas Chamber events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Dallas Chamber Events – Networking & Business',
    description: 'Dallas-based Chamber events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Dallas Chamber Events',
    description: 'Chamber professionals in Dallas – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'chamber' });
  return (
    <CityProvider>
      <DallasChamberPage initialEvents={events} />
    </CityProvider>
  );
}
