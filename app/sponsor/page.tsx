import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsor a Business Calendar — Reach Texas Professionals | Local Business Calendars',
  description: 'Sponsor a city business calendar in San Antonio, Austin, Dallas, or Houston. Reach engaged local professionals and business owners through targeted event newsletters.',
  alternates: {
    canonical: '/sponsor',
  },
};

import { SponsorPage } from '../../src/components/SponsorPage';

export default function Page() {
  return <SponsorPage />;
}
