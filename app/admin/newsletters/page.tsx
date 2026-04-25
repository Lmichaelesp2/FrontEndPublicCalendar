'use client';

import { AdminProvider } from '../../../src/contexts/AdminContext';
import { NewslettersPage } from '../../../src/components/admin/NewslettersPage';

export default function Page() {
  return (
    <AdminProvider>
      <NewslettersPage />
    </AdminProvider>
  );
}
