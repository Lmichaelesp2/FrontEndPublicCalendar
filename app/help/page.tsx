import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Getting Started — Local Business Calendars',
  description: 'Learn how to use Local Business Calendars to find business events, networking mixers, chamber luncheons, and more in San Antonio, Austin, Dallas, and Houston.',
  alternates: {
    canonical: '/help',
  },
};

import { HelpPage } from '../../src/components/HelpPage';

export default function Page() {
  return <HelpPage />;
}
