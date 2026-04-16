import type { Metadata } from 'next';
import { Providers } from '../src/components/Providers';
import '../src/index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://localbusinesscalendars.com'),
  title: 'Local Business Calendars – Find Events by City & Industry',
  description: 'Find business and networking events by state, city, and industry. Get weekly newsletters with the events that matter to you.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'Local Business Calendars – Find Events by City & Industry',
    description: 'Browse business events by state, city, and industry. Subscribe to weekly newsletters.',
    images: ['/logos/local-business-calendars-01.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local Business Calendars – Find Events by City & Industry',
    description: 'Browse business events by state, city, and industry.',
    images: ['/logos/local-business-calendars-01.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
