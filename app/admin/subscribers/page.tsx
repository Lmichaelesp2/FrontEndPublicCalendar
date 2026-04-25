'use client';

import { AdminProvider } from '../../../src/contexts/AdminContext';
import { SubscribersPage } from '../../../src/components/admin/SubscribersPage';

export default function Page() {
  return (
    <AdminProvider>
      <SubscribersPage />
    </AdminProvider>
  );
}
