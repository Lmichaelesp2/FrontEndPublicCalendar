import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinTechnologyPage } from '../../../../src/components/cities/AustinTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Technology Events – Networking & Business',
  description: 'Austin Technology events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Austin Technology Events – Networking & Business',
    description: 'Austin-based Technology events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Austin Technology Events',
    description: 'Technology professionals in Austin – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'technology' });
  return (
    <CityProvider>
      <AustinTechnologyPage initialEvents={events} />
    </CityProvider>
  );
}
