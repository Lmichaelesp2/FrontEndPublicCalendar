import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinChamberPage } from '../../../../src/components/cities/AustinChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';
import { redirect } from 'next/navigation';
import { SUB_CALENDARS_ENABLED } from '../../../../src/lib/subCalendars';

export const revalidate = 60;

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // SUB-CAL: hidden while paused
  title: 'Austin Chamber Events – Networking & Business',
  description: 'Austin Chamber of Commerce events calendar — browse upcoming chamber of commerce mixers, ribbon cuttings, and member networking events in Austin, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/austin/chamber',
  },
  openGraph: {
    title: 'Austin Chamber Events – Networking & Business',
    description: 'Browse Austin Chamber of Commerce events — chamber of commerce mixers, ribbon cuttings, and member networking events. Subscribe free.',
    images: ['/logos/austin-chamber-calendar-01.png'],
  },
  twitter: {
    title: 'Austin Chamber Events',
    description: 'Chamber professionals in Austin – curated events.',
    images: ['/logos/austin-chamber-calendar-01.png'],
  },
};

export default async function Page() {
  // SUB-CAL: hidden while sub-calendars are paused
  if (!SUB_CALENDARS_ENABLED) {
    redirect('/texas/austin');
  }

  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'chamber' });

  const schemaJson = buildPageSchema({
    city: 'Austin', category: 'chamber',
    url: '/texas/austin/chamber',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <AustinChamberPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
