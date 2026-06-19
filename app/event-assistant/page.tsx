import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SHOW_EVENT_ASSISTANT } from '../../src/lib/featureFlags';

export const metadata: Metadata = {
  title: 'Event Assistant — Your Personal Business Event Planner | Local Business Calendars',
  description: 'Event Assistant gives Texas professionals 30 days of upcoming events, personalized event recommendations and advanced filters — all for $14.99/month.',
  alternates: {
    canonical: '/event-assistant',
  },
};

import { EventAssistantPage } from '../../src/components/EventAssistantPage';

export default function Page() {
  // Event Assistant is paused — redirect instead of rendering the sales page.
  // Flip SHOW_EVENT_ASSISTANT back to true in src/lib/featureFlags.ts to restore.
  if (!SHOW_EVENT_ASSISTANT) {
    redirect('/pricing');
  }
  return <EventAssistantPage />;
}
