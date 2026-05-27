import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsorship — One Sponsorship, Two Properties | Local Business Calendars',
  description: 'One sponsorship covers both Local Business Calendars and Local Business Organizations — your city, your category, the same professionals across both platforms every week.',
  alternates: {
    canonical: '/sponsor',
  },
};

import { SponsorPage } from '../../src/components/SponsorPage';

export default function Page() {
  return <SponsorPage />;
}
