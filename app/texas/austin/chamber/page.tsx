import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinChamberPage } from '../../../../src/components/cities/AustinChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
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
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'chamber' });
  return (
    <CityProvider>
      <AustinChamberPage initialEvents={events} />
    </CityProvider>
  );
}
