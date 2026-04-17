'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Lock } from 'lucide-react';
import type { Event, City } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { dateKey, formatDate, parseDate, sortEventsByTime, useMidnightReset } from '../lib/utils';
import { resolveGroupType } from '../lib/cities';

import { EventCard } from './EventCard';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';


interface CalendarProps {
  initialEvents: Event[];
  forcedCity?: City;
  groupType?: string;
  maxDate?: string;
  minDate?: string;
  showGateBanner?: boolean;
  onAuthClick?: () => void;
  cityName?: string;
}

export function Calendar({ initialEvents, forcedCity, groupType, maxDate, minDate, showGateBanner, onAuthClick, cityName }: CalendarProps) {
  const { user } = useAuth();
  const today = useMidnightReset();
  const [liveEvents, setLiveEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    async function fetchLive() {
      const past30 = new Date();
      past30.setDate(past30.getDate() - 30);
      const past30Str = past30.toISOString().split('T')[0];
      const future60 = new Date();
      future60.setDate(future60.getDate() + 60);
      const future60Str = future60.toISOString().split('T')[0];
      let query = supabase
        .from('events')
        .select('*')
        .gte('start_date', past30Str)
        .lte('start_date', future60Str)
        .order('start_date', { ascending: true });

      if (forcedCity) query = query.eq('city_calendar', forcedCity);
      if (groupType) query = query.eq('event_category', resolveGroupType(groupType));

      const { data } = await query;
      if (data) setLiveEvents(data as Event[]);
    }
    fetchLive();
  }, [forcedCity, groupType]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rangeStart, setRangeStart] = useState<string | null>(() => dateKey(new Date()));
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [inlineAuthOpen, setInlineAuthOpen] = useState(false);

  useEffect(() => {
    setRangeStart(today);
    setRangeEnd(null);
  }, [today]);

  function triggerAuth() {
    if (onAuthClick) {
      onAuthClick();
    } else {
      setInlineAuthOpen(true);
    }
  }

  const eventsSource = liveEvents ?? initialEvents;
  const cityFiltered = eventsSource.filter((e) => {
    if (forcedCity && e.city_calendar !== forcedCity) return false;
    if (groupType && e.event_category !== resolveGroupType(groupType)) return false;
    if (minDate && e.start_date < minDate) return false;
    if (maxDate && e.start_date > maxDate) return false;
    return true;
  });

  function stepDay(direction: 1 | -1) {
    if (!user) {
      triggerAuth();
      return;
    }
    const current = parseDate(rangeStart ?? today);
    current.setDate(current.getDate() + direction);
    const dk = dateKey(current);
    if (dk < today) return;
    if (maxDate && dk > maxDate) return;
    setRangeStart(dk);
    setRangeEnd(null);
    setSearchQuery('');
  }

  const searchActive = searchQuery.trim().length > 0;

  let displayEvents: Event[];
  if (searchActive) {
    const q = searchQuery.toLowerCase();
    displayEvents = cityFiltered
      .filter((e) => {
        const text = `${e.name} ${e.description ?? ''} ${e.org_name ?? ''} ${e.address ?? ''} ${e.participation ?? ''} ${e.paid ?? ''}`.toLowerCase();
        return text.includes(q);
      })
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  } else if (rangeStart) {
    const end = rangeEnd ?? rangeStart;
    displayEvents = sortEventsByTime(
      cityFiltered.filter((e) => e.start_date >= rangeStart && e.start_date <= end)
    ).sort((a, b) => a.start_date.localeCompare(b.start_date) || 0);
  } else {
    displayEvents = sortEventsByTime(cityFiltered);
  }

  const eventCount = displayEvents.length;

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd !== rangeStart
      ? `${formatDate(parseDate(rangeStart))} – ${formatDate(parseDate(rangeEnd))}`
      : formatDate(parseDate(rangeStart))
    : 'All Upcoming';

  const isMultiDay = !!(rangeEnd && rangeEnd !== rangeStart) || searchActive;

  const selectedParsed = rangeStart ? parseDate(rangeStart) : new Date();
  const isSingleDay = rangeStart && !rangeEnd && !searchActive;
  const selectedDayName = selectedParsed.toLocaleDateString('en-US', { weekday: 'long' });
  const selectedDateDisplay = selectedParsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const selectedIsToday = rangeStart === today;
  const singleDayCount = isSingleDay
    ? cityFiltered.filter((e) => e.start_date === rangeStart).length
    : 0;

  return (
    <section className="cal-section" id="calendar">
      <div className="cal-inner">

        {user && (
          <div className="cal-search-row">
            <div className="cal-search-wrap">
              <Search size={15} className="cal-search-icon" />
              <input
                type="text"
                className="cal-search-input"
                placeholder="Search by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="cal-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="cal-search-meta">
              <span className="cal-meta-label">{searchActive ? 'Search results' : 'All Upcoming'}</span>
              <span className="cal-meta-count">{eventCount} events found</span>
            </div>
          </div>
        )}

        {showGateBanner && (
          <div className="ev-gate-banner ev-gate-banner-above">
            <div className="ev-gate-banner-inner">
              <div className="ev-gate-icon">
                <Lock size={24} />
              </div>
              <div className="ev-gate-text">
                <p className="ev-gate-heading">See the Full Week</p>
                <p className="ev-gate-sub">Create a free account to unlock the full weekly calendar.</p>
              </div>
              <div className="ev-gate-banner-buttons">
                <button className="ev-gate-btn" onClick={triggerAuth}>
                  Create Free Account
                </button>
                <button className="ev-gate-signin" onClick={triggerAuth}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="cal-day-nav">
          <button
            className="cal-day-arrow"
            onClick={() => stepDay(-1)}
            disabled={user ? (rangeStart === today || !rangeStart) : false}
            aria-label={!user ? 'Create a free account to see the full week' : 'Previous day'}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="cal-day-center">
            <div className="cal-day-name">{isSingleDay ? (selectedIsToday ? 'Today' : selectedDayName) : rangeLabel}</div>
            <div className="cal-day-full">{isSingleDay ? selectedDateDisplay : `${eventCount} event${eventCount !== 1 ? 's' : ''}`}</div>
            {isSingleDay && (
              <div className="cal-day-count">
                {singleDayCount} event{singleDayCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <button
            className="cal-day-arrow"
            onClick={() => stepDay(1)}
            aria-label={!user ? 'Create a free account to see the full week' : 'Next day'}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="ev-list" style={{ marginTop: '0.5rem' }}>
          {displayEvents.length === 0 ? (
            <div className="no-ev">
              <p>{searchActive ? 'No events match your search.' : 'No events for the selected date range.'}</p>
            </div>
          ) : (
            <>
              <div className="cal-results-label">
                <span>{rangeLabel}</span>
                <span className="cal-results-count">{eventCount} event{eventCount !== 1 ? 's' : ''}</span>
              </div>
              {displayEvents.map((event, index) => {
                const showDivider = isMultiDay && (
                  index === 0 || displayEvents[index - 1].start_date !== event.start_date
                );
                return (
                  <div key={event.id}>
                    {showDivider && (
                      <div className="date-div" style={index === 0 ? { marginTop: 0 } : undefined}>
                        {formatDate(parseDate(event.start_date))}
                      </div>
                    )}
                    <EventCard event={event} index={index} />
                  </div>
                );
              })}
            </>
          )}
        </div>

      </div>

      {inlineAuthOpen && (
        <AuthModal
          isOpen={inlineAuthOpen}
          onClose={() => setInlineAuthOpen(false)}
          onSuccess={() => setInlineAuthOpen(false)}
          cityName={cityName}
        />
      )}
    </section>
  );
}
