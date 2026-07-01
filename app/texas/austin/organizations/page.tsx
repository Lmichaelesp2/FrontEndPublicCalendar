import type { Metadata } from 'next';
import { AuthProvider } from '../../../../src/contexts/AuthContext';
import { OrgDirectoryClient } from '../../../../src/components/orgs/OrgDirectoryClient';

export const metadata: Metadata = {
  title: 'Austin Business Organizations | Chambers, Tech Groups & Professional Associations',
  description: 'Browse 90+ business organizations in Austin, TX — technology groups, startup networks, chambers of commerce, professional associations, and more.',
  alternates: {
    canonical: '/texas/austin/organizations',
  },
  openGraph: {
    title: 'Austin Business Organizations | Chambers, Tech Groups & Professional Associations',
    description: 'Browse 90+ business organizations in Austin, TX — tech groups, startup networks, chambers, professional associations, and more.',
    images: ['/logos/san-antonio-business-calendar-01.png'],
  },
};

export default function Page() {
  return (
    <AuthProvider>
      <OrgDirectoryClient city="Austin" citySlug="austin" />
    </AuthProvider>
  );
}
