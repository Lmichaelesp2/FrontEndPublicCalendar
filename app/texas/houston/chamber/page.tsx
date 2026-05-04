import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonChamberPage } from '../../../../src/components/cities/HoustonChamberPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Chamber Events – Networking & Business',
  description: 'Houston Chamber of Commerce events calendar — browse upcoming chamber of commerce mixers, ribbon cuttings, and member networking events in Houston, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/houston/chamber',
  },
  openGraph: {
    title: 'Houston Chamber Events – Networking & Business',
    description: 'Browse Houston Chamber of Commerce events — chamber of commerce mixers, ribbon cuttings, and member networking events. Subscribe free.',
    images: ['/logos/houston-chamber-calendar-01.png'],
  },
  twitter: {
    title: 'Houston Chamber Events',
    description: 'Chamber professionals in Houston – curated events.',
    images: ['/logos/houston-chamber-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'chamber' });
  return (
    <CityProvider>
      <HoustonChamberPage initialEvents={events} />
    </CityProvider>
  );
}
