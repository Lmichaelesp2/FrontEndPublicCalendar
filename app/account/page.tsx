import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account — Local Business Calendars | Manage Your Subscriptions',
  description: 'Manage your Local Business Calendars account. Update your city and industry subscriptions for Texas business event newsletters.',
  alternates: {
    canonical: '/account',
  },
};

import { AccountPage } from '../../src/components/AccountPage';

export default function Page() {
  return <AccountPage />;
}
