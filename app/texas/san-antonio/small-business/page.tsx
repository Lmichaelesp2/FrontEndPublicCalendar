import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioSmallBusinessPage } from '../../../../src/components/cities/SanAntonioSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Small Business Events – Networking & Business',
  description: 'San Antonio Small Business events calendar — browse upcoming small business workshops, entrepreneur meetups, and local business owner events in San Antonio, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/san-antonio/small-business',
  },
  openGraph: {
    title: 'San Antonio Small Business Events – Networking & Business',
    description: 'Browse San Antonio Small Business events — small business workshops, entrepreneur meetups, and local business owner events. Subscribe free.',
    images: ['/logos/san-antonio-small-business-calendar-01.png'],
  },
  twitter: {
    title: 'San Antonio Small Business Events',
    description: 'Small Business professionals in San Antonio – curated events.',
    images: ['/logos/san-antonio-small-business-calendar-01.png'],
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
