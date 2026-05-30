import type { Metadata } from 'next';
import { OurSponsorsPage } from '../../src/components/OurSponsorsPage';

export const metadata: Metadata = {
  title: 'Our Sponsors | Local Business Calendars',
  description: 'Meet the local businesses and organizations that make the free Local Business Calendars newsletter possible for Texas professionals.',
  alternates: { canonical: '/sponsors' },
};

export default function Page() {
  return <OurSponsorsPage />;
}
