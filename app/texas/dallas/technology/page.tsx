import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasTechnologyPage } from '../../../../src/components/cities/DallasTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';
import { redirect } from 'next/navigation';
import { SUB_CALENDARS_ENABLED } from '../../../../src/lib/subCalendars';

export const revalidate = 60;

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // SUB-CAL: hidden while paused
  title: 'Dallas Technology Events – Networking & Business',
  description: 'Dallas Technology events calendar — browse upcoming tech meetups, startup events, and innovation conferences in Dallas, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/dallas/technology',
  },
  openGraph: {
    title: 'Dallas Technology Events – Networking & Business',
    description: 'Browse Dallas Technology events — tech meetups, startup events, and innovation conferences. Subscribe free.',
    images: ['/logos/dallas-technology-calendar-01.png'],
  },
  twitter: {
    title: 'Dallas Technology Events',
    description: 'Technology professionals in Dallas – curated events.',
    images: ['/logos/dallas-technology-calendar-01.png'],
  },
};

export default async function Page() {
  // SUB-CAL: hidden while sub-calendars are paused
  if (!SUB_CALENDARS_ENABLED) {
    redirect('/texas/dallas');
  }

  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'technology' });

  const schemaJson = buildPageSchema({
    city: 'Dallas', category: 'technology',
    url: '/texas/dallas/technology',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <DallasTechnologyPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
