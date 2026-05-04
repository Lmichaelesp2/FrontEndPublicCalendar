import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Local Business Calendars',
  description: 'Privacy policy for Local Business Calendars. Learn how we collect, use, and protect your data when you subscribe to Texas city business event newsletters.',
  alternates: {
    canonical: '/privacy',
  },
};

import { PrivacyPage } from '../../src/components/PrivacyPage';

export default function Page() {
  return <PrivacyPage />;
}
