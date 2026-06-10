import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinRealEstatePage } from '../../../../src/components/cities/AustinRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';
import { redirect } from 'next/navigation';
import { SUB_CALENDARS_ENABLED } from '../../../../src/lib/subCalendars';

export const revalidate = 60;

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // SUB-CAL: hidden while paused
  title: 'Austin Real Estate Events – Networking & Business',
  description: 'Austin Real Estate events calendar — browse upcoming real estate investment events, agent networking, and market update meetings in Austin, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/austin/real-estate',
  },
  openGraph: {
    title: 'Austin Real Estate Events – Networking & Business',
    description: 'Browse Austin Real Estate events — real estate investment events, agent networking, and market update meetings. Subscribe free.',
    images: ['/logos/austin-real-estate-calendar-01.png'],
  },
  twitter: {
    title: 'Austin Real Estate Events',
    description: 'Real Estate professionals in Austin – curated events.',
    images: ['/logos/austin-real-estate-calendar-01.png'],
  },
};

export default async function Page() {
  // SUB-CAL: hidden while sub-calendars are paused
  if (!SUB_CALENDARS_ENABLED) {
    redirect('/texas/austin');
  }

  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'real_estate' });

  const schemaJson = buildPageSchema({
    city: 'Austin', category: 'real-estate',
    url: '/texas/austin/real-estate',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <AustinRealEstatePage initialEvents={events} />
    </CityProvider>
    </>
  );
}
