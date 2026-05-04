import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscribe to Business Event Newsletters — Texas Cities | Local Business Calendars',
  description: 'Subscribe to weekly business event newsletters for San Antonio, Austin, Dallas, and Houston. Choose your city and industry — networking, technology, real estate, chamber events, and more.',
  alternates: {
    canonical: '/subscribe',
  },
};

import { SubscribeChoosePage } from '../../src/components/SubscribeChoosePage';

export default function SubscribePage() {
  return <SubscribeChoosePage />;
}
