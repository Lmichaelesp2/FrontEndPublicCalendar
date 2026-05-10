import type { Metadata } from 'next';
import { TexasMainLayout } from '../../src/components/TexasMainLayout';
import { fetchApprovedEvents, fetchThisWeekCounts } from '../../src/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Texas Business Calendars – Events by City & Industry',
  description: 'Discover Texas business events by city and industry. Browse Austin, Dallas, Houston, San Antonio events with weekly newsletters.',
  openGraph: {
    title: 'Texas Business Calendars – Events by City & Industry',
    description: 'Find business events across Texas cities and industries with weekly newsletters.',
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    title: 'Texas Business Calendars',
    description: 'Browse Texas business events by city and industry.',
    images: ['https://bolt.new/static/og_default.png'],
  },
};

export const revalidate = 300; // revalidate every 5 minutes

export default async function Page() {
  const [initialEvents, cityCounts] = await Promise.all([
    fetchApprovedEvents(),
    fetchThisWeekCounts(),
  ]);

// Structured data for Texas hub page
const texasSchema = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Texas Business Calendars",
    "url": "https://www.localbusinesscalendars.com/texas",
    "description": "Free weekly business event newsletters for San Antonio, Austin, Dallas, and Houston, Texas.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Local Business Calendars", "item": "https://www.localbusinesscalendars.com" },
        { "@type": "ListItem", "position": 2, "name": "Texas", "item": "https://www.localbusinesscalendars.com/texas" }
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Texas Business Calendars by City",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "San Antonio Business Calendar",
        "url": "https://www.localbusinesscalendars.com/texas/san-antonio"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Austin Business Calendar",
        "url": "https://www.localbusinesscalendars.com/texas/austin"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Dallas Business Calendar",
        "url": "https://www.localbusinesscalendars.com/texas/dallas"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Houston Business Calendar",
        "url": "https://www.localbusinesscalendars.com/texas/houston"
      }
    ]
  }
]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: texasSchema }} />
      <TexasMainLayout initialEvents={initialEvents} cityCounts={cityCounts} />
    </>
  );
}
