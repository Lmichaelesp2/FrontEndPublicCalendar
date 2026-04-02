'use client';

import { AdminProvider } from '../../src/contexts/AdminContext';
import { AdminPanel } from '../../src/components/admin/AdminPanel';

export default function Page() {
  return (
    <AdminProvider>
      <AdminPanel />
    </AdminProvider>
  );
}
