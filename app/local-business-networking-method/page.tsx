import type { Metadata } from 'next';
import { EventNetworkingMethodPage } from '../../src/components/EventNetworkingMethodPage';

export const metadata: Metadata = {
  title: 'The Local Business Networking Method | Local Business Calendars',
  description: 'A repeatable system for turning the people you meet into customers — through the organizations you join and the events you attend. People · Content · Participation · Relationships.',
  alternates: { canonical: '/local-business-networking-method' },
};

export default function Page() {
  return <EventNetworkingMethodPage />;
}
