import type { Metadata } from 'next';
import { Providers } from '../src/components/Providers';
import { ChatWidget } from '../src/components/ChatWidget';
import '../src/index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.localbusinesscalendars.com'),
  title: 'Local Business Calendars – Find Events by City & Industry',
  description: 'Find business and networking events by state, city, and industry. Get weekly newsletters with the events that matter to you.',
  alternates: {
    canonical: '/',
  },
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css" />
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#042C53" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BC Calendars" />
        <link rel="apple-touch-icon" href="/icons/01-white-blue-calendar-bc-180.png" />
        {/* Sitebehavior analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (window.location && window.location.search && window.location.search.indexOf('capture-sitebehaviour-heatmap') !== -1) {
                    sessionStorage.setItem('capture-sitebehaviour-heatmap', '_');
                  }

                  var sbSiteSecret = '48f59a94-cbf8-468d-b249-e60862fd802e';
                  window.sitebehaviourTrackingSecret = sbSiteSecret;
                  var scriptElement = document.createElement('script');
                  scriptElement.defer = true;
                  scriptElement.id = 'site-behaviour-script-v2';
                  scriptElement.src = 'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=' + sbSiteSecret;
                  document.head.appendChild(scriptElement);
                } catch (e) { console.error(e); }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ChatWidget />
      </body>
    </html>
  );
}
