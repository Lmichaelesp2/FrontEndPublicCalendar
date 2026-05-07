import type { Metadata } from 'next';
import { EventNetworkingMethodPage } from '../../src/components/EventNetworkingMethodPage';

export const metadata: Metadata = {
  title: 'The Event Networking Method | Local Business Calendars',
  description: 'A simple way to use the calendar to find better business events and meet the right people. Goal, People, Event, Attend.',
  alternates: { canonical: '/event-networking-method' },
};

export default function Page() {
  return <EventNetworkingMethodPage />;
}
