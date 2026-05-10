import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonNetworkingPage } from '../../../../src/components/cities/HoustonNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Networking Events – Networking & Business',
  description: 'Houston Networking events calendar — browse upcoming professional networking mixers, B2B introductions, and industry happy hours in Houston, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/houston/networking',
  },
  openGraph: {
    title: 'Houston Networking Events – Networking & Business',
    description: 'Browse Houston Networking events — professional networking mixers, B2B introductions, and industry happy hours. Subscribe free.',
    images: ['/logos/houston-networking-calendar-01.png'],
  },
  twitter: {
    title: 'Houston Networking Events',
    description: 'Networking professionals in Houston – curated events.',
    images: ['/logos/houston-networking-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'networking' });

  const schemaJson = buildPageSchema({
    city: 'Houston', category: 'networking'
    url: '/texas/houston/networking',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <HoustonNetworkingPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
