'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Mail, Lock } from 'lucide-react';
import { supabase, Event, CITIES, City } from '../lib/supabase';
import { dateKey, parseDate, sortEventsByTime } from '../lib/utils';
import { EventCard } from './EventCard';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

const CITY_ROUTES: Record<City, string> = {
  'San Antonio': '/texas/san-antonio',
  'Austin': '/texas/austin',
  'Dallas': '/texas/dallas',
  'Houston': '/texas/houston',
};

const CITY_DESCRIPTORS: Record<City, string> = {
  'San Antonio': 'Networking · Chamber · Technology · Real Estate · Small Business · Healthcare · Finance · and more',
  'Austin': 'Networking · Chamber · Technology · Real Estate · Small Business · Healthcare · Finance · and more',
  'Dallas': 'Networking · Chamber · Technology · Real Estate · Small Business · Healthcare · Finance · and more',
  'Houston': 'Networking · Chamber · Technology · Real Estate · Small Business · Healthcare · Finance · and more',
};

const CITY_HEADINGS: Record<City, string> = {
  'San Antonio': 'Networking & Business Events in San Antonio',
  'Austin': 'Networking & Business Events in Austin',
  'Dallas': 'Networking & Business Events in Dallas',
  'Houston': 'Networking & Business Events in Houston',
};

const CITY_LINK_TEXT: Record<City, string> = {
  'San Antonio': 'Browse San Antonio Events',
  'Austin': 'Browse Austin Events',
  'Dallas': 'Browse Dallas Events',
  'Houston': 'Browse Houston Events',
};

const HOME_LIMIT = 10;

interface HomepageCitiesProps {
  initialEvents?: Event[];
}

export function HomepageCities({ initialEvents = [] }: HomepageCitiesProps) {
  const today = dateKey(new Date());
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [fetchedDates, setFetchedDates] = useState<Set<string>>(() => new Set([today]));
  const [selectedDate, setSelectedDate] = useState<string>(today);

  async function fetchEventsForDate(date: string) {
    if (fetchedDates.has(date)) return;
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .eq('start_date', date)
        .order('start_date', { ascending: true });
      if (error) throw error;
      setEvents((prev) => {
        const existing = new Set(prev.map((e) => e.id));
        const newEvents = (data || []).filter((e) => !existing.has(e.id));
        return [...prev, ...newEvents];
      });
      setFetchedDates((prev) => new Set([...prev, date]));
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }

  useEffect(() => {
    if (selectedDate !== today) {
      fetchEventsForDate(selectedDate);
    }
  }, [selectedDate]);

  function goToToday() {
    setSelectedDate(today);
  }

  function handleDayClick(dk: string) {
    if (dk < today) return;
    if (dk > today && !user) {
      setAuthOpen(true);
      return;
    }
    setSelectedDate(dk);
  }

  function stepDay(direction: 1 | -1) {
    if (direction === 1 && !user) {
      setAuthOpen(true);
      return;
    }
    const current = parseDate(selectedDate);
    current.setDate(current.getDate() + direction);
    if (dateKey(current) < today) return;
    const dk = dateKey(current);
    setSelectedDate(dk);
  }

  const selectedParsed = parseDate(selectedDate);
  const isToday = selectedDate === today;
  const dayName = selectedParsed.toLocaleDateString('en-US', { weekday: 'long' });
  const dateDisplay = selectedParsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const filteredEvents = events.filter((e) => e.start_date === selectedDate);

  return (
    <section className="hpc-section" id="calendar">
      <div className="hpc-inner">
        <div className="hpc-header">
          <h2>Events Across Texas</h2>
          <p className="hpc-subtitle">
            Select any date to browse events by city — subscribe to get a weekly digest in your inbox every Monday
          </p>
        </div>


        <div className="hpc-date-nav">
          <button
            className="hpc-day-arrow"
            onClick={() => stepDay(-1)}
            disabled={selectedDate === today}
            aria-label="Previous day"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="hpc-date-center">
            <div className="hpc-date-day">{isToday ? 'Today' : dayName}</div>
            <div className="hpc-date-full">{dateDisplay}</div>
            <div className="hpc-date-count">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </div>
          </div>

          <button
            className={['hpc-day-arrow', !user ? 'hpc-day-arrow-gated' : ''].filter(Boolean).join(' ')}
            onClick={() => stepDay(1)}
            aria-label={!user ? 'Create a free account to see future events' : 'Next day'}
          >
            {!user ? <Lock size={18} /> : <ChevronRight size={20} />}
          </button>
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
                selectedDate={selectedDate}
              />
            );
          })}
        </div>
      </div>

      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => setAuthOpen(false)}
        />
      )}
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
