import { Suspense } from 'react';
import type { Metadata } from 'next';
import { UpgradePageClient } from '../../src/components/UpgradePageClient';

export const metadata: Metadata = {
  title: 'Get the Event Assistant | Local Business Calendars',
  description: 'The Event Assistant gives you 30 days of events across all four Texas cities, personalized recommendations, advanced filters, and a weekly digest built for your goals.',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <UpgradePageClient />
    </Suspense>
  );
}
