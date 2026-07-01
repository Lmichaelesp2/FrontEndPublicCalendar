import type { Metadata } from 'next';
import { AuthProvider } from '../../../../src/contexts/AuthContext';
import { OrgDirectoryClient } from '../../../../src/components/orgs/OrgDirectoryClient';

export const metadata: Metadata = {
  title: 'San Antonio Business Organizations | Chambers, Networking & Associations',
  description: 'Browse 180+ business organizations in San Antonio, TX — chambers of commerce, professional associations, networking groups, real estate organizations, and more.',
  alternates: {
    canonical: '/texas/san-antonio/organizations',
  },
  openGraph: {
    title: 'San Antonio Business Organizations | Chambers, Networking & Associations',
    description: 'Browse 180+ business organizations in San Antonio, TX — chambers, networking groups, real estate organizations, tech groups, and more.',
    images: ['/logos/san-antonio-business-calendar-01.png'],
  },
};

export default function Page() {
  return (
    <AuthProvider>
      <OrgDirectoryClient city="San Antonio" citySlug="san-antonio" />
    </AuthProvider>
  );
}
