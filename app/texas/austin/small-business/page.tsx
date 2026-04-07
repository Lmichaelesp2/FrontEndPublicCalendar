import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinSmallBusinessPage } from '../../../../src/components/cities/AustinSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Small Business Events – Networking & Business',
  description: 'Austin Small Business events – networking, conferences, and business opportunities. Weekly newsletter for professionals.',
  openGraph: {
    title: 'Austin Small Business Events – Networking & Business',
    description: 'Austin-based Small Business events and networking opportunities with curated weekly newsletter.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Austin Small Business Events',
    description: 'Small Business professionals in Austin – curated events.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'small_business' });
  return (
    <CityProvider>
      <AustinSmallBusinessPage initialEvents={events} />
    </CityProvider>
  );
}
