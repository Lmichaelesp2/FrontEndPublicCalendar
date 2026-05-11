import type { Metadata } from 'next';
import { UnsubscribePage } from '../../src/components/UnsubscribePage';

export const metadata: Metadata = {
  title: 'Unsubscribed — Local Business Calendars',
  robots: 'noindex',
};

export default function Page() {
  return <UnsubscribePage />;
}
