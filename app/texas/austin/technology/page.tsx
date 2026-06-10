import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinTechnologyPage } from '../../../../src/components/cities/AustinTechnologyPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';
import { redirect } from 'next/navigation';
import { SUB_CALENDARS_ENABLED } from '../../../../src/lib/subCalendars';

export const revalidate = 60;

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // SUB-CAL: hidden while paused
  title: 'Austin Technology Events – Networking & Business',
  description: 'Austin Technology events calendar — browse upcoming tech meetups, startup events, and innovation conferences in Austin, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/austin/technology',
  },
  openGraph: {
    title: 'Austin Technology Events – Networking & Business',
    description: 'Browse Austin Technology events — tech meetups, startup events, and innovation conferences. Subscribe free.',
    images: ['/logos/austin-technology-calendar-01.png'],
  },
  twitter: {
    title: 'Austin Technology Events',
    description: 'Technology professionals in Austin – curated events.',
    images: ['/logos/austin-technology-calendar-01.png'],
  },
};

export default async function Page() {
  // SUB-CAL: hidden while sub-calendars are paused
  if (!SUB_CALENDARS_ENABLED) {
    redirect('/texas/austin');
  }

  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'technology' });

  const schemaJson = buildPageSchema({
    city: 'Austin', category: 'technology',
    url: '/texas/austin/technology',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <AustinTechnologyPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
