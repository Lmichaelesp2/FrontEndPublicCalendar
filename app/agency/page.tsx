import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Networking Studio — Strategic Event Networking for Texas Professionals',
  description: 'Event Networking Studio helps professionals find the right rooms, build the right relationships, and turn events into business growth. Based in Texas.',
  alternates: {
    canonical: '/agency',
  },
};

import { AgencyPage } from '../../src/components/AgencyPage';

export default function Page() {
  return <AgencyPage />;
}
