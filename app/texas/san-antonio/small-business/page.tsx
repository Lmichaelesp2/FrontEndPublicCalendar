import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioSmallBusinessPage } from '../../../../src/components/cities/SanAntonioSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Small Business Events – Networking & Business',
  description: 'San Antonio Small Business events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'San Antonio Small Business Events – Networking & Business',
    description: 'San Antonio-based Small Business events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'San Antonio Small Business Events',
    description: 'Small Business professionals in San Antonio – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'small_business' });
  return (
    <CityProvider>
      <SanAntonioSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
