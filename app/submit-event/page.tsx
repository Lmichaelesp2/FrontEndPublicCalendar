import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Business Event — Texas City Calendars | Local Business Calendars',
  description: 'Submit your Texas business event to our city calendars. Reach professionals in San Antonio, Austin, Dallas, and Houston who are looking for networking, technology, and industry events.',
  alternates: {
    canonical: '/submit-event',
  },
};

import { SubmitEventPage } from '../../src/components/SubmitEventPage';

export default function Page() {
  return <SubmitEventPage />;
}
