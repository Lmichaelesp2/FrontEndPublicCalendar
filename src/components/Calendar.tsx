'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Mail } from 'lucide-react';
import type { Event, City } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { dateKey, formatDate, parseDate, sortEventsByTime, useMidnightReset, getMondayWeekRange } from '../lib/utils';
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
  newsletterHeading?: string;
  newsletterSubtext?: string;
  subscribeHref?: string;
}

export function Calendar({ initialEvents, forcedCity, groupType, maxDate, minDate, showGateBanner, onAuthClick, cityName, newsletterHeading, newsletterSubtext, subscribeHref }: CalendarProps) {
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

  const initialWeek = getMondayWeekRange();
  const [searchQuery, setSearchQuery] = useState('');
  const [rangeStart, setRangeStart] = useState<string>(initialWeek.start);
  const [rangeEnd, setRangeEnd] = useState<string>(initialWeek.end);
  const [weekOffset, setWeekOffset] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [inlineAuthOpen, setInlineAuthOpen] = useState(false);

  useEffect(() => {
    const ref = new Date();
    ref.setDate(ref.getDate() + weekOffset * 7);
    const week = getMondayWeekRange(ref);
    setRangeStart(week.start);
    setRangeEnd(week.end);
    setSearchQuery('');
  }, [weekOffset, today]);

  function triggerAuth() {
    if (onAuthClick) {
      onAuthClick();
    } else {
      setInlineAuthOpen(true);
    }
  }

  function stepWeek(direction: 1 | -1) {
    const next = weekOffset + direction;
    if (next < 0) return;
    setWeekOffset(next);
  }

  const eventsSource = liveEvents ?? initialEvents;
  const cityFiltered = eventsSource.filter((e) => {
    if (forcedCity && e.city_calendar !== forcedCity) return false;
    if (groupType && e.event_category !== resolveGroupType(groupType)) return false;
    if (minDate && e.start_date < minDate) return false;
    if (maxDate && e.start_date > maxDate) return false;
    return true;
  });

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
  } else {
    displayEvents = sortEventsByTime(
      cityFiltered.filter((e) => e.start_date >= rangeStart && e.start_date <= rangeEnd)
    ).sort((a, b) => a.start_date.localeCompare(b.start_date) || 0);
  }

  const eventCount = displayEvents.length;

  const rangeLabel = searchActive
    ? 'Search results'
    : `${formatDate(parseDate(rangeStart))} – ${formatDate(parseDate(rangeEnd))}`;

  const isMultiDay = true;

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await supabase.from('assistant_waitlist').insert({ email: newsletterEmail.trim() });
    } catch (_) {}
    setNewsletterSubmitted(true);
  }

  const showNewsletter = !!(newsletterHeading || newsletterSubtext || subscribeHref);

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

        {showNewsletter && (
          <div className="cal-newsletter-bar">
            <div className="cal-newsletter-bar-inner">
              <div className="cal-newsletter-bar-text">
                <Mail size={18} className="cal-newsletter-bar-icon" />
                <div>
                  <p className="cal-newsletter-bar-heading">{newsletterHeading}</p>
                  {newsletterSubtext && <p className="cal-newsletter-bar-sub">{newsletterSubtext}</p>}
                </div>
              </div>
              {!newsletterSubmitted ? (
                <form className="cal-newsletter-bar-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="cal-newsletter-bar-input"
                  />
                  <button type="submit" className="cal-newsletter-bar-btn">
                    Subscribe — Free
                  </button>
                </form>
              ) : (
                <p className="cal-newsletter-bar-success">You're on the list!</p>
              )}
            </div>
          </div>
        )}

        <div className="cal-day-nav">
          <button
            className="cal-day-arrow"
            onClick={() => stepWeek(-1)}
            disabled={weekOffset === 0}
            aria-label="Previous week"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="cal-day-center">
            <div className="cal-day-name">{searchActive ? 'Search Results' : 'This Week'}</div>
            <div className="cal-day-full">{rangeLabel}</div>
            <div className="cal-day-count">
              {eventCount} event{eventCount !== 1 ? 's' : ''}
            </div>
          </div>

          <button
            className="cal-day-arrow"
            onClick={() => stepWeek(1)}
            aria-label="Next week"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="ev-list" style={{ marginTop: '0.5rem' }}>
          {displayEvents.length === 0 ? (
            <div className="no-ev">
              <p>{searchActive ? 'No events match your search.' : 'No events for this week.'}</p>
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
