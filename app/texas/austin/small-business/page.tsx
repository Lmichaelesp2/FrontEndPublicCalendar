import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinSmallBusinessPage } from '../../../../src/components/cities/AustinSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Small Business Events – Networking & Business',
  description: 'Austin Small Business events calendar — browse upcoming small business workshops, entrepreneur meetups, and local business owner events in Austin, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/austin/small-business',
  },
  openGraph: {
    title: 'Austin Small Business Events – Networking & Business',
    description: 'Browse Austin Small Business events — small business workshops, entrepreneur meetups, and local business owner events. Subscribe free.',
    images: ['/logos/austin-small-business-calendar-01.png'],
  },
  twitter: {
    title: 'Austin Small Business Events',
    description: 'Small Business professionals in Austin – curated events.',
    images: ['/logos/austin-small-business-calendar-01.png'],
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
