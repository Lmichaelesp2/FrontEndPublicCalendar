import type { Metadata } from 'next';
import { UpgradePageClient } from '../../src/components/UpgradePageClient';

export const metadata: Metadata = {
  title: 'Go Premium | Local Business Calendars',
  description: 'Unlock 30 days of personalized business events, custom filters, and a weekly digest tailored to your industry and goals.',
};

export default function Page() {
  return <UpgradePageClient />;
}
