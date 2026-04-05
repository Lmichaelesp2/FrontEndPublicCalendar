'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Mail } from 'lucide-react';
import { Event, CITIES, City } from '../lib/supabase';
import { dateKey, parseDate, sortEventsByTime } from '../lib/utils';
import { EventCard } from './EventCard';

const CITY_ROUTES: Record<City, string> = {
  'San Antonio': '/texas/san-antonio',
  'Austin': '/texas/austin',
  'Dallas': '/texas/dallas',
  'Houston': '/texas/houston',
};

const CITY_DESCRIPTORS: Record<City, string> = {
  'San Antonio': 'Business networking, chamber events & professional meetups — updated weekly',
  'Austin': 'Tech meetups, startup events, real estate & professional networking — updated weekly',
  'Dallas': 'DFW networking, real estate, finance & business events — updated weekly',
  'Houston': 'Energy sector, chamber, real estate & professional networking events — updated weekly',
};

const CITY_HEADINGS: Record<City, string> = {
  'San Antonio': 'Networking & Business Events in San Antonio',
  'Austin': 'Networking & Business Events in Austin',
  'Dallas': 'Networking & Business Events in Dallas',
  'Houston': 'Networking & Business Events in Houston',
};

const CITY_LINK_TEXT: Record<City, string> = {
  'San Antonio': 'San Antonio Business Calendar',
  'Austin': 'Austin Business Calendar',
  'Dallas': 'Dallas Business Calendar',
  'Houston': 'Houston Business Calendar',
};

const HOME_LIMIT = 10;

interface HomepageCitiesProps {
  initialEvents?: Event[];
}

export function HomepageCities({ initialEvents = [] }: HomepageCitiesProps) {
  const today = dateKey(new Date());

  const [events] = useState<Event[]>(initialEvents);

  const selectedParsed = parseDate(today);
  const isToday = true;
  const dayName = selectedParsed.toLocaleDateString('en-US', { weekday: 'long' });
  const dateDisplay = selectedParsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const filteredEvents = events.filter((e) => e.start_date === today);

  return (
    <section className="hpc-section" id="calendar">
      <div className="hpc-inner">
        <div className="hpc-header">
          <div className="hpc-date-full hpc-header-date">{dateDisplay}</div>
          <h2>Today's Networking & Business Events Across Texas</h2>
          <p className="hpc-subtitle">
            Showing today's events. Get a free account to see the full week in San Antonio, Austin, Dallas, or Houston — plus the weekly Monday newsletter.
          </p>
        </div>

        <div className="hpc-cities">
          {CITIES.map((city) => {
            const cityEvents = sortEventsByTime(
              filteredEvents.filter((e) => e.city_calendar === city)
            );
            const displayed = cityEvents.slice(0, HOME_LIMIT);
            const hasMore = cityEvents.length > HOME_LIMIT;

            return (
              <CitySection
                key={city}
                city={city}
                events={displayed}
                totalCount={cityEvents.length}
                hasMore={hasMore}
                cityRoute={CITY_ROUTES[city]}
                selectedDate={today}
              />
            );
          })}
        </div>
      </div>

    </section>
  );
}

function CitySection({
  city, events, totalCount, hasMore, cityRoute, selectedDate,
}: {
  city: City;
  events: Event[];
  totalCount: number;
  hasMore: boolean;
  cityRoute: string;
  selectedDate: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <h2 className="hpc-city-heading">{CITY_HEADINGS[city]}</h2>
      <div className="hpc-city-block">
        <div className="hpc-city-header" onClick={() => setExpanded(!expanded)}>
        <div className="hpc-city-title-row">
          <span className="hpc-city-dot" />
          <div className="hpc-city-info">
            <h3 className="hpc-city-name">{city}</h3>
            <p className="hpc-city-descriptor">{CITY_DESCRIPTORS[city]}</p>
          </div>
          <span className="hpc-city-count">
            {events.length} of {totalCount} event{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="hpc-city-actions">
          <Link
            href={cityRoute}
            className="hpc-city-link"
            onClick={(e) => e.stopPropagation()}
          >
            {CITY_LINK_TEXT[city]} <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {expanded && (
        <div className="hpc-events">
          {events.length === 0 ? (
            <div className="hpc-no-events">No events on this date in {city}.</div>
          ) : (
            <>
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
              {hasMore && (
                <div className="hpc-city-cta">
                  <div className="hpc-city-cta-text">
                    Don't want to check back every week? Get {city}'s full week of events delivered to your inbox every Monday morning.
                  </div>
                  <div className="hpc-city-cta-btns">
                    <Link href={cityRoute} className="hpc-cta-btn hpc-cta-login">
                      View all {city} events
                    </Link>
                    <Link href={`${cityRoute}/subscribe`} className="hpc-cta-btn hpc-cta-subscribe">
                      <Mail size={15} />
                      Get the weekly email
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      </div>
    </>
  );
}
