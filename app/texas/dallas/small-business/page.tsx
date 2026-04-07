import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasSmallBusinessPage } from '../../../../src/components/cities/DallasSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Small Business Events – Networking & Business',
  description: 'Dallas Small Business events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Dallas Small Business Events – Networking & Business',
    description: 'Dallas-based Small Business events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Dallas Small Business Events',
    description: 'Small Business professionals in Dallas – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'small_business' });
  return (
    <CityProvider>
      <DallasSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
