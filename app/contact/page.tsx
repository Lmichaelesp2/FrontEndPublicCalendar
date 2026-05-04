import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Local Business Calendars | Submit Events & Inquiries',
  description: 'Get in touch with Local Business Calendars. Submit event questions, partnership inquiries, or feedback for our Texas city business event calendars.',
  alternates: {
    canonical: '/contact',
  },
};

import { ContactPage } from '../../src/components/ContactPage';

export default function Page() {
  return <ContactPage />;
}
