import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonSmallBusinessPage } from '../../../../src/components/cities/HoustonSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Small Business Events – Networking & Business',
  description: 'Houston Small Business events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Houston Small Business Events – Networking & Business',
    description: 'Houston-based Small Business events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Houston Small Business Events',
    description: 'Small Business professionals in Houston – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'small_business' });
  return (
    <CityProvider>
      <HoustonSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
