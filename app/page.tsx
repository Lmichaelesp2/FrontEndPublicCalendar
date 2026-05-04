import type { Metadata } from 'next';
import { Homepage } from '../src/components/Homepage';

export const metadata: Metadata = {
  title: 'Local Business Calendars | Free Business & Networking Event Calendars by City',
  description: 'Find networking events, chamber meetings, tech meetups, real estate gatherings, and small business events in San Antonio, Austin, Dallas, and Houston. Free weekly newsletter by city.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Local Business Calendars | Free Business & Networking Event Calendars by City',
    description: 'Find networking events, chamber meetings, tech meetups, real estate gatherings, and small business events in San Antonio, Austin, Dallas, and Houston.',
    images: ['/logos/local-business-calendars-01.png'],
  },
};

export default function Page() {
  return <Homepage />;
}
