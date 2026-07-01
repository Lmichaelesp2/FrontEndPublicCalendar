import type { Metadata } from 'next';
import { AuthProvider } from '../../../../src/contexts/AuthContext';
import { OrgDirectoryClient } from '../../../../src/components/orgs/OrgDirectoryClient';

export const metadata: Metadata = {
  title: 'Houston Business Organizations | Chambers, Associations & Networking Groups',
  description: 'Browse 200+ business organizations in Houston, TX — energy associations, chambers of commerce, healthcare groups, professional networks, and more.',
  alternates: {
    canonical: '/texas/houston/organizations',
  },
  openGraph: {
    title: 'Houston Business Organizations | Chambers, Associations & Networking Groups',
    description: 'Browse 200+ business organizations in Houston, TX — energy associations, chambers, healthcare groups, professional networks, and more.',
    images: ['/logos/san-antonio-business-calendar-01.png'],
  },
};

export default function Page() {
  return (
    <AuthProvider>
      <OrgDirectoryClient city="Houston" citySlug="houston" />
    </AuthProvider>
  );
}
