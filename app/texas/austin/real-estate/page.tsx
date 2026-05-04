import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinRealEstatePage } from '../../../../src/components/cities/AustinRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
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
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'real_estate' });
  return (
    <CityProvider>
      <AustinRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
