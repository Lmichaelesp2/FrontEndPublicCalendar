import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioTechnologyPage } from '../../../../src/components/cities/SanAntonioTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';
import { redirect } from 'next/navigation';
import { SUB_CALENDARS_ENABLED } from '../../../../src/lib/subCalendars';

export const revalidate = 60;

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // SUB-CAL: hidden while paused
  title: 'San Antonio Technology Events – Networking & Business',
  description: 'San Antonio Technology events calendar — browse upcoming tech meetups, startup events, and innovation conferences in San Antonio, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/san-antonio/technology',
  },
  openGraph: {
    title: 'San Antonio Technology Events – Networking & Business',
    description: 'Browse San Antonio Technology events — tech meetups, startup events, and innovation conferences. Subscribe free.',
    images: ['/logos/san-antonio-technology-calendar-01.png'],
  },
  twitter: {
    title: 'San Antonio Technology Events',
    description: 'Technology professionals in San Antonio – curated events.',
    images: ['/logos/san-antonio-technology-calendar-01.png'],
  },
};

export default async function Page() {
  // SUB-CAL: hidden while sub-calendars are paused
  if (!SUB_CALENDARS_ENABLED) {
    redirect('/texas/san-antonio');
  }

  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'technology' });

  const schemaJson = buildPageSchema({
    city: 'San Antonio', category: 'technology',
    url: '/texas/san-antonio/technology',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <SanAntonioTechnologyPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
