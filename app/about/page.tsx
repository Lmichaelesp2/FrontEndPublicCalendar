import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Local Business Calendars | Texas City Business Event Directories',
  description: 'Learn how Local Business Calendars helps Texas professionals discover business events, networking opportunities, and industry meetups by city — San Antonio, Austin, Dallas, Houston.',
  alternates: {
    canonical: '/about',
  },
};

import { AboutPage } from '../../src/components/AboutPage';

export default function Page() {
  return <AboutPage />;
}
