import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { HoustonSmallBusinessPage } from '../../../../src/components/cities/HoustonSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Houston Small Business Events – Networking & Business',
  description: 'Houston Small Business events calendar — browse upcoming small business workshops, entrepreneur meetups, and local business owner events in Houston, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/houston/small-business',
  },
  openGraph: {
    title: 'Houston Small Business Events – Networking & Business',
    description: 'Browse Houston Small Business events — small business workshops, entrepreneur meetups, and local business owner events. Subscribe free.',
    images: ['/logos/houston-small-business-calendar-01.png'],
  },
  twitter: {
    title: 'Houston Small Business Events',
    description: 'Small Business professionals in Houston – curated events.',
    images: ['/logos/houston-small-business-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Houston', groupType: 'small_business' });

  const schemaJson = buildPageSchema({
    city: 'Houston', category: 'small-business',
    url: '/texas/houston/small-business',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <HoustonSmallBusinessPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
