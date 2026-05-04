import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Local Business Calendars',
  description: 'Terms of service for Local Business Calendars. Review the terms governing use of our Texas city business event calendar directories and newsletters.',
  alternates: {
    canonical: '/terms',
  },
};

import { TermsPage } from '../../src/components/TermsPage';

export default function Page() {
  return <TermsPage />;
}
