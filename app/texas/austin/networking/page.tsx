import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AustinNetworkingPage } from '../../../../src/components/cities/AustinNetworkingPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Austin Networking Events – Networking & Business',
  description: 'Austin Networking events calendar — browse upcoming professional networking mixers, B2B introductions, and industry happy hours in Austin, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/austin/networking',
  },
  openGraph: {
    title: 'Austin Networking Events – Networking & Business',
    description: 'Browse Austin Networking events — professional networking mixers, B2B introductions, and industry happy hours. Subscribe free.',
    images: ['/logos/austin-networking-calendar-01.png'],
  },
  twitter: {
    title: 'Austin Networking Events',
    description: 'Networking professionals in Austin – curated events.',
    images: ['/logos/austin-networking-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Austin', groupType: 'networking' });

  const schemaJson = buildPageSchema({
    city: 'Austin', category: 'networking',
    url: '/texas/austin/networking',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <AustinNetworkingPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
