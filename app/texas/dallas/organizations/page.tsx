import type { Metadata } from 'next';
import { AuthProvider } from '../../../../src/contexts/AuthContext';
import { OrgDirectoryClient } from '../../../../src/components/orgs/OrgDirectoryClient';

export const metadata: Metadata = {
  title: 'Dallas Business Organizations | Chambers, Professional Associations & Networking',
  description: 'Browse 90+ business organizations in Dallas, TX — chambers of commerce, finance associations, real estate groups, technology networks, and more.',
  alternates: {
    canonical: '/texas/dallas/organizations',
  },
  openGraph: {
    title: 'Dallas Business Organizations | Chambers, Professional Associations & Networking',
    description: 'Browse 90+ business organizations in Dallas, TX — chambers, finance associations, real estate groups, tech networks, and more.',
    images: ['/logos/san-antonio-business-calendar-01.png'],
  },
};

export default function Page() {
  return (
    <AuthProvider>
      <OrgDirectoryClient city="Dallas" citySlug="dallas" />
    </AuthProvider>
  );
}
