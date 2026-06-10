import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinSmallBusinessPage } from '../../../../src/components/cities/AustinSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';
import { redirect } from 'next/navigation';
import { SUB_CALENDARS_ENABLED } from '../../../../src/lib/subCalendars';

export const revalidate = 60;

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // SUB-CAL: hidden while paused
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
  // SUB-CAL: hidden while sub-calendars are paused
  if (!SUB_CALENDARS_ENABLED) {
    redirect('/texas/austin');
  }

  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'small_business' });

  const schemaJson = buildPageSchema({
    city: 'Austin', category: 'small-business',
    url: '/texas/austin/small-business',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <AustinSmallBusinessPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
