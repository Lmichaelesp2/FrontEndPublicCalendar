import type { Metadata } from 'next';
import { Suspense } from 'react';
import { UnsubscribePage } from '../../src/components/UnsubscribePage';

export const metadata: Metadata = {
  title: 'Unsubscribed — Local Business Calendars',
  robots: 'noindex',
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <UnsubscribePage />
    </Suspense>
  );
}
