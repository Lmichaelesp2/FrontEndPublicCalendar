const BASE_URL = 'https://www.localbusinesscalendars.com';

const CITY_META: Record<string, { state: string; region: string }> = {
  'San Antonio': { state: 'TX', region: 'San Antonio, TX' },
  'Austin':      { state: 'TX', region: 'Austin, TX' },
  'Dallas':      { state: 'TX', region: 'Dallas, TX' },
  'Houston':     { state: 'TX', region: 'Houston, TX' },
};

const CATEGORY_LABELS: Record<string, string> = {
  technology:     'Technology',
  networking:     'Networking',
  'real-estate':  'Real Estate',
  chamber:        'Chamber of Commerce',
  'small-business': 'Small Business',
};

export interface EventRow {
  id?: string;
  name: string;
  description?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  address?: string;
  city_calendar?: string;
  website?: string;
}

/** LocalBusiness schema — one per city or sub-cal page */
export function buildLocalBusinessSchema({
  city,
  category,
  url,
  description,
}: {
  city: string;
  category?: string;
  url: string;
  description: string;
}) {
  const meta = CITY_META[city] ?? { state: 'TX', region: `${city}, TX` };
  const catLabel = category ? CATEGORY_LABELS[category] ?? category : undefined;
  const name = catLabel
    ? `${city} ${catLabel} Events Calendar`
    : `${city} Business Events Calendar`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url: `${BASE_URL}${url}`,
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: 'Texas',
        containedInPlace: {
          '@type': 'Country',
          name: 'United States',
        },
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: meta.state,
      addressCountry: 'US',
    },
  };
}

/** Event schema list — up to 10 upcoming events per page */
export function buildEventSchemas(events: EventRow[], city: string) {
  const today = new Date().toISOString().split('T')[0];

  return events
    .filter((e) => e.start_date && e.start_date >= today)
    .slice(0, 10)
    .map((e) => {
      const startDateTime = e.start_time
        ? `${e.start_date}T${e.start_time}`
        : e.start_date!;
      const endDateTime = e.end_date
        ? e.end_time
          ? `${e.end_date}T${e.end_time}`
          : e.end_date
        : undefined;

      const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: e.name,
        startDate: startDateTime,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: e.address ?? city,
          address: {
            '@type': 'PostalAddress',
            streetAddress: e.address ?? '',
            addressLocality: city,
            addressRegion: 'TX',
            addressCountry: 'US',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: 'Local Business Calendars',
          url: BASE_URL,
        },
      };

      if (e.description) schema.description = e.description;
      if (endDateTime) schema.endDate = endDateTime;
      if (e.website) schema.url = e.website;

      return schema;
    });
}

/** Combine LocalBusiness + Events into a single JSON-LD string */
export function buildPageSchema({
  city,
  category,
  url,
  description,
  events = [],
}: {
  city: string;
  category?: string;
  url: string;
  description: string;
  events?: EventRow[];
}): string {
  const schemas: unknown[] = [
    buildLocalBusinessSchema({ city, category, url, description }),
    ...buildEventSchemas(events, city),
  ];

  return JSON.stringify(schemas);
}
