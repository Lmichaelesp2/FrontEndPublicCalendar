import type { Metadata } from 'next';
import { Providers } from '../src/components/Providers';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Local Business Calendars | Free Business & Networking Event Calendars by City',
  description: 'Local Business Calendars is a free network of business event calendars organized by city. Find networking events, chamber meetings, tech meetups, real estate events, and small business gatherings in your city.',
  openGraph: {
    type: 'website',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://bolt.new/static/og_default.png'],
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
