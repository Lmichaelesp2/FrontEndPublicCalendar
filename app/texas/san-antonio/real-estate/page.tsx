import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { SanAntonioRealEstatePage } from '../../../../src/components/cities/SanAntonioRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Real Estate Events – Networking & Business',
  description: 'San Antonio Real Estate events calendar — browse upcoming real estate investment events, agent networking, and market update meetings in San Antonio, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/san-antonio/real-estate',
  },
  openGraph: {
    title: 'San Antonio Real Estate Events – Networking & Business',
    description: 'Browse San Antonio Real Estate events — real estate investment events, agent networking, and market update meetings. Subscribe free.',
    images: ['/logos/san-antonio-real-estate-calendar-01.png'],
  },
  twitter: {
    title: 'San Antonio Real Estate Events',
    description: 'Real Estate professionals in San Antonio – curated events.',
    images: ['/logos/san-antonio-real-estate-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'San Antonio', groupType: 'real_estate' });
  return (
    <CityProvider>
      <SanAntonioRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
