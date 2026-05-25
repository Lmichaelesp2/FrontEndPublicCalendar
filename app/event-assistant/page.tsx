import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Assistant — Your Personal Business Event Planner | Local Business Calendars',
  description: 'Event Assistant gives Texas professionals 30 days of upcoming events, personalized recommendations, advanced filters, and a weekly Monday digest — all for $14.99/month.',
  alternates: {
    canonical: '/event-assistant',
  },
};

import { EventAssistantPage } from '../../src/components/EventAssistantPage';

export default function Page() {
  return <EventAssistantPage />;
}
