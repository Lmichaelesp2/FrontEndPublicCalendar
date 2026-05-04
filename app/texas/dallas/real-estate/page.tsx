import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasRealEstatePage } from '../../../../src/components/cities/DallasRealEstatePage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Real Estate Events – Networking & Business',
  description: 'Dallas Real Estate events calendar — browse upcoming real estate investment events, agent networking, and market update meetings in Dallas, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/dallas/real-estate',
  },
  openGraph: {
    title: 'Dallas Real Estate Events – Networking & Business',
    description: 'Browse Dallas Real Estate events — real estate investment events, agent networking, and market update meetings. Subscribe free.',
    images: ['/logos/dallas-real-estate-calendar-01.png'],
  },
  twitter: {
    title: 'Dallas Real Estate Events',
    description: 'Real Estate professionals in Dallas – curated events.',
    images: ['/logos/dallas-real-estate-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'real_estate' });
  return (
    <CityProvider>
      <DallasRealEstatePage initialEvents={events} />
    </CityProvider>
  );
}
