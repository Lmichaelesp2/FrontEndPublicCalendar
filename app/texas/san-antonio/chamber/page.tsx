import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioChamberPage } from '../../../../src/components/cities/SanAntonioChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Chamber Events – Networking & Business',
  description: 'San Antonio Chamber of Commerce events calendar — browse upcoming chamber of commerce mixers, ribbon cuttings, and member networking events in San Antonio, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/san-antonio/chamber',
  },
  openGraph: {
    title: 'San Antonio Chamber Events – Networking & Business',
    description: 'Browse San Antonio Chamber of Commerce events — chamber of commerce mixers, ribbon cuttings, and member networking events. Subscribe free.',
    images: ['/logos/san-antonio-chamber-calendar-01.png'],
  },
  twitter: {
    title: 'San Antonio Chamber Events',
    description: 'Chamber professionals in San Antonio – curated events.',
    images: ['/logos/san-antonio-chamber-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'chamber' });
  return (
    <CityProvider>
      <SanAntonioChamberPage initialEvents={events} />
    </CityProvider>
  );
}
