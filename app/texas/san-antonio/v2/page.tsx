import type { Metadata } from 'next';
import { CityProvider } from '../../../../src/contexts/CityContext';
import { AuthProvider } from '../../../../src/contexts/AuthContext';
import { SanAntonioV2Page } from '../../../../src/components/cities/SanAntonioV2Page';
import { fetchApprovedEvents } from '../../../../src/lib/supabase-server';
import { fetchSAOrgCounts } from '../../../../src/lib/fetchSAOrgs';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'San Antonio Business Calendar V2 — Test Page',
  description: 'Test page for the new combined events + organizations layout.',
  robots: { index: false, follow: false },
};

export default async function Page() {
  const [events, { orgCounts, totalOrgs }] = await Promise.all([
    fetchApprovedEvents({ city: 'San Antonio' }),
    fetchSAOrgCounts(),
  ]);

  return (
    <AuthProvider>
      <CityProvider>
        <SanAntonioV2Page
          initialEvents={events}
          orgCounts={orgCounts}
          totalOrgs={totalOrgs}
        />
      </CityProvider>
    </AuthProvider>
  );
}
