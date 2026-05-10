import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { DallasSmallBusinessPage } from '../../../../src/components/cities/DallasSmallBusinessPage';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { buildPageSchema } from '../../../../src/lib/structured-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dallas Small Business Events – Networking & Business',
  description: 'Dallas Small Business events calendar — browse upcoming small business workshops, entrepreneur meetups, and local business owner events in Dallas, Texas. Free weekly newsletter for professionals.',  alternates: {
    canonical: '/texas/dallas/small-business',
  },
  openGraph: {
    title: 'Dallas Small Business Events – Networking & Business',
    description: 'Browse Dallas Small Business events — small business workshops, entrepreneur meetups, and local business owner events. Subscribe free.',
    images: ['/logos/dallas-small-business-calendar-01.png'],
  },
  twitter: {
    title: 'Dallas Small Business Events',
    description: 'Small Business professionals in Dallas – curated events.',
    images: ['/logos/dallas-small-business-calendar-01.png'],
  },
};

export default async function Page() {
  const events = await fetchApprovedEvents({ city: 'Dallas', groupType: 'small_business' });

  const schemaJson = buildPageSchema({
    city: 'Dallas', category: 'small-business',
    url: '/texas/dallas/small-business',
    description: metadata.description ?? '',
    events,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <CityProvider>
      <DallasSmallBusinessPage initialEvents={events} />
    </CityProvider>
    </>
  );
}
