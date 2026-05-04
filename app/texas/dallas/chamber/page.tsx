import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasChamberPage } from '../../../../src/components/cities/DallasChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Chamber Events – Networking & Business',
  description: 'Dallas Chamber of Commerce events calendar — browse upcoming chamber of commerce mixers, ribbon cuttings, and member networking events in Dallas, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/dallas/chamber',
  },
  openGraph: {
    title: 'Dallas Chamber Events – Networking & Business',
    description: 'Browse Dallas Chamber of Commerce events — chamber of commerce mixers, ribbon cuttings, and member networking events. Subscribe free.',
    images: ['/logos/dallas-chamber-calendar-01.png'],
  },
  twitter: {
    title: 'Dallas Chamber Events',
    description: 'Chamber professionals in Dallas – curated events.',
    images: ['/logos/dallas-chamber-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'chamber' });
  return (
    <CityProvider>
      <DallasChamberPage initialEvents={events} />
    </CityProvider>
  );
}
