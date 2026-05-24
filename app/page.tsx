import type { Metadata } from 'next';
import { Homepage } from '../src/components/Homepage';
import { fetchThisWeekCounts } from '../src/lib/supabase-server';

export const revalidate = 60; // revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Local Business Calendars | Free Business & Networking Event Calendars by City',
  description: 'Find networking events, chamber meetings, tech meetups, real estate gatherings, and small business events in San Antonio, Austin, Dallas, and Houston. Free weekly newsletter by city.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Local Business Calendars | Free Business & Networking Event Calendars by City',
    description: 'Find networking events, chamber meetings, tech meetups, real estate gatherings, and small business events in San Antonio, Austin, Dallas, and Houston.',
    images: ['/logos/local-business-calendars-01.png'],
  },
};

export default async function Page() {
  const cityCounts = await fetchThisWeekCounts();

// Structured data for homepage — WebSite + SiteNavigationElement
// TODO: swap city URLs to dedicated domains when live
// e.g. https://www.sanantoniobusinesscalendar.com, https://www.austinbusinesscalendar.com, etc.
const homepageSchema = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Local Business Calendars",
    "url": "https://www.localbusinesscalendars.com",
    "description": "Free weekly business event newsletters organized by city. Find networking events, chamber meetings, tech meetups, real estate gatherings, and small business events in San Antonio, Austin, Dallas, and Houston, Texas.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.localbusinesscalendars.com/texas/{city}"
      },
      "query-input": "required name=city"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "SiteLinksSearchBox",
    "url": "https://www.localbusinesscalendars.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.localbusinesscalendars.com/texas/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Texas Business Calendars by City",
    "description": "Free weekly business event newsletters for Texas cities",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "San Antonio Business Calendar",
        "description": "Free weekly newsletter for San Antonio business events — networking, chamber, technology, real estate, and small business.",
        "url": "https://www.localbusinesscalendars.com/texas/san-antonio"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Austin Business Calendar",
        "description": "Free weekly newsletter for Austin business events — tech meetups, startup events, networking, real estate, and chamber gatherings.",
        "url": "https://www.localbusinesscalendars.com/texas/austin"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Dallas Business Calendar",
        "description": "Free weekly newsletter for Dallas business events — DFW networking, real estate, finance, chamber, and professional gatherings.",
        "url": "https://www.localbusinesscalendars.com/texas/dallas"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Houston Business Calendar",
        "description": "Free weekly newsletter for Houston business events — energy sector, chamber, real estate, and professional networking.",
        "url": "https://www.localbusinesscalendars.com/texas/houston"
      }
    ]
  }
]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homepageSchema }} />
      <Homepage cityCounts={cityCounts} />
    </>
  );
}
