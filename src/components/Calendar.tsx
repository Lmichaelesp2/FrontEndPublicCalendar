'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Mail, Calendar as CalendarIcon } from 'lucide-react';
import type { Event, City } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { dateKey, formatDate, parseDate, sortEventsByTime, useMidnightReset, getMondayWeekRange } from '../lib/utils';
import { resolveGroupType } from '../lib/cities';

import { EventCard } from './EventCard';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';


interface CalendarProps {
  showSearch?: boolean;
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
  externalSelectedDate?: string | null;
  onExternalDateClear?: () => void;
  weekMode?: boolean;
}

export function Calendar({ initialEvents, forcedCity, groupType, maxDate, minDate, showGateBanner, showSearch, onAuthClick, cityName, newsletterHeading, newsletterSubtext, subscribeHref, externalSelectedDate, onExternalDateClear, weekMode = false }: CalendarProps) {
  const { user } = useAuth();
  const today = useMidnightReset();
  const [liveEvents, setLiveEvents] = useState<Event[] | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchLive() {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('start_date', { ascending: true });

      if (forcedCity) query = query.eq('city_calendar', forcedCity);
      if (groupType) query = query.eq('event_category', resolveGroupType(groupType));

      const { data } = await query;
      if (data) setLiveEvents(data as Event[]);
    }
    fetchLive();
  }, [forcedCity, groupType]);

  // Day-based navigation — starts on today
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [inlineAuthOpen, setInlineAuthOpen] = useState(false);

  // Week mode state — starts from today, shows next 7 days per page
  const [weekOffset, setWeekOffset] = useState(0);

  const rangeStart = (() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return dateKey(d);
  })();

  const rangeEnd = (() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7 + 6);
    return dateKey(d);
  })();

  // Month picker state
  const [pickerMonth, setPickerMonth] = useState<number>(() => new Date().getMonth());
  const [pickerYear, setPickerYear] = useState<number>(() => new Date().getFullYear());

  // No click-outside handler — picker closes via its own close button or after selecting a date

  function triggerAuth() {
    if (onAuthClick) {
      onAuthClick();
    } else {
      setInlineAuthOpen(true);
    }
  }

  function stepDay(direction: 1 | -1) {
    const base = externalSelectedDate ?? selectedDate;
    const current = parseDate(base);
    current.setDate(current.getDate() + direction);
    const newKey = dateKey(current);
    if (direction === -1 && newKey < today) return;
    setSelectedDate(newKey);
    if (onExternalDateClear) onExternalDateClear();
    setSearchQuery('');
  }

  function selectDayFromPicker(year: number, month: number, day: number) {
    const d = new Date(year, month, day);
    const key = dateKey(d);
    setSelectedDate(key);
    setShowMonthPicker(false);
    setSearchQuery('');
  }

  function goToToday() {
    const todayKey = dateKey(new Date());
    setSelectedDate(todayKey);
    setPickerMonth(new Date().getMonth());
    setPickerYear(new Date().getFullYear());
    setShowMonthPicker(false);
    setSearchQuery('');
  }

  const eventsSource = liveEvents ?? initialEvents;
  const cityFiltered = eventsSource.filter((e) => {
    if (forcedCity && e.city_calendar !== forcedCity) return false;
    // In week mode, server already filtered by groupType — skip client-side category filter
    if (!weekMode && groupType && e.event_category !== resolveGroupType(groupType)) return false;
    if (minDate && e.start_date < minDate) return false;
    if (maxDate && e.start_date > maxDate) return false;
    return true;
  });

  const searchActive = searchQuery.trim().length > 0;

  // Use external date from MonthCalendar if provided, otherwise use internal selectedDate
  const effectiveDate = externalSelectedDate ?? selectedDate;

  let displayEvents: Event[];
  if (searchActive) {
    const q = searchQuery.toLowerCase();
    displayEvents = cityFiltered
      .filter((e) => {
        const text = `${e.name} ${e.description ?? ''} ${e.org_name ?? ''} ${e.address ?? ''} ${e.participation ?? ''} ${e.paid ?? ''}`.toLowerCase();
        return text.includes(q);
      })
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  } else if (weekMode) {
    displayEvents = sortEventsByTime(
      cityFiltered.filter((e) => e.start_date >= rangeStart && e.start_date <= rangeEnd)
    ).sort((a, b) => a.start_date.localeCompare(b.start_date) || 0);
  } else {
    displayEvents = sortEventsByTime(
      cityFiltered.filter((e) => e.start_date === effectiveDate)
    );
  }

  const eventCount = displayEvents.length;
  const selectedDateObj = parseDate(effectiveDate);
  const dayLabel = weekMode
    ? `${formatDate(parseDate(rangeStart))} – ${formatDate(parseDate(rangeEnd))}`
    : formatDate(selectedDateObj);
  const isToday = effectiveDate === today;

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await supabase.from('assistant_waitlist').insert({ email: newsletterEmail.trim() });
    } catch (_) {}
    setNewsletterSubmitted(true);
  }

  const showNewsletter = !!(newsletterHeading || newsletterSubtext || subscribeHref);

  // Build month picker calendar grid
  function buildMonthGrid(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <section className="cal-section" id="calendar">
      <div className="cal-inner">

        {user && showSearch && (
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

        {showNewsletter && subscribeHref && (
          <div className="cal-newsletter-bar">
            <div className="cal-newsletter-bar-inner">
              <div className="cal-newsletter-bar-text">
                <Mail size={18} className="cal-newsletter-bar-icon" />
                <p className="cal-newsletter-bar-heading">{newsletterHeading}</p>
              </div>
              <a href={subscribeHref} className="cal-newsletter-bar-btn">
                Get the Free Weekly Email →
              </a>
            </div>
          </div>
        )}

        {/* Day navigation */}
        <div className="cal-day-nav" style={{ position: 'relative' }}>
          <button
            className="cal-day-arrow"
            onClick={() => weekMode ? setWeekOffset(w => Math.max(0, w - 1)) : stepDay(-1)}
            disabled={weekMode ? weekOffset === 0 : effectiveDate <= today}
            aria-label={weekMode ? 'Previous week' : 'Previous day'}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="cal-day-center">
            {!weekMode && isToday && <div className="cal-day-name">Today</div>}
            {weekMode && <div className="cal-day-name">{weekOffset === 0 ? 'This Week' : `Week ${weekOffset + 1}`}</div>}
            <div className="cal-day-full">{dayLabel}</div>
            <div className="cal-day-count">
              {eventCount} event{eventCount !== 1 ? 's' : ''}
            </div>
            {/* Month picker toggle — only in day mode */}
            {!weekMode && <button
              onClick={() => {
                setPickerMonth(selectedDateObj.getMonth());
                setPickerYear(selectedDateObj.getFullYear());
                setShowMonthPicker(!showMonthPicker);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginTop: '4px',
                color: '#888',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              aria-label="Open month calendar"
            >
              <CalendarIcon size={13} /> Jump to a date
            </button>}
          </div>

          <button
            className="cal-day-arrow"
            onClick={() => weekMode ? setWeekOffset(w => w + 1) : stepDay(1)}
            aria-label={weekMode ? 'Next week' : 'Next day'}
          >
            <ChevronRight size={24} />
          </button>

          {/* Month picker dropdown */}
          {showMonthPicker && (
            <div
              ref={pickerRef}
              style={{
                position: 'absolute',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1e2130',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '16px',
                zIndex: 100,
                width: '280px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {/* Header row with close button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <button
                  onClick={() => goToToday()}
                  style={{
                    background: '#f5a623',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#000',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '5px 14px',
                  }}
                >
                  Go to Today
                </button>
                <button
                  onClick={() => setShowMonthPicker(false)}
                  style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
                >✕</button>
              </div>

              {/* Go to Today button */}
              <div style={{ textAlign: 'center', marginBottom: '10px', display: 'none' }}>
                <button
                  onClick={() => goToToday()}
                  style={{
                    background: '#f5a623',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#000',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '5px 14px',
                  }}
                >
                  Go to Today
                </button>
              </div>

              {/* Month/Year navigation row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <button
                  onClick={() => {
                    if (pickerMonth === 0) { setPickerMonth(11); setPickerYear(y => y - 1); }
                    else setPickerMonth(m => m - 1);
                  }}
                  style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}
                >‹</button>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                  {monthNames[pickerMonth]} {pickerYear}
                </span>
                <button
                  onClick={() => {
                    if (pickerMonth === 11) { setPickerMonth(0); setPickerYear(y => y + 1); }
                    else setPickerMonth(m => m + 1);
                  }}
                  style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}
                >›</button>
              </div>

              {/* Day of week headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: '#666', padding: '2px' }}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {buildMonthGrid(pickerYear, pickerMonth).map((day, i) => {
                  if (!day) return <div key={i} />;
                  const key = dateKey(new Date(pickerYear, pickerMonth, day));
                  const isPast = key < today;
                  const isSelected = key === selectedDate;
                  const isTodayCell = key === today;
                  return (
                    <button
                      key={i}
                      onClick={() => !isPast && selectDayFromPicker(pickerYear, pickerMonth, day)}
                      style={{
                        background: isSelected ? '#f5a623' : isTodayCell ? '#2a3050' : 'none',
                        border: isTodayCell && !isSelected ? '1px solid #f5a623' : 'none',
                        borderRadius: '6px',
                        color: isPast ? '#444' : isSelected ? '#000' : '#ddd',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        padding: '5px 2px',
                        textAlign: 'center',
                        fontWeight: isSelected ? 700 : 400,
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Events list */}
        <div className="ev-list" style={{ marginTop: '0.5rem' }}>
          {displayEvents.length === 0 ? (
            <div className="no-ev">
              <p>
                {searchActive
                  ? 'No events match your search.'
                  : weekMode
                  ? 'No events this week. Try the next week using the arrow.'
                  : `No events on ${dayLabel}. Use the arrows to check another day.`}
              </p>
            </div>
          ) : (
            <>
              <div className="cal-results-label">
                <span>{searchActive ? 'Search Results' : dayLabel}</span>
                <span className="cal-results-count">{eventCount} event{eventCount !== 1 ? 's' : ''}</span>
              </div>
              {displayEvents.map((event, index) => {
                const showDivider = weekMode && (
                  index === 0 || displayEvents[index - 1].start_date !== event.start_date
                );
                return (
                  <div key={event.id}>
                    {showDivider && (
                      <div className="date-div" style={index === 0 ? { marginTop: 0 } : undefined}>
                        {formatDate(parseDate(event.start_date))}
                      </div>
                    )}
                    <EventCard event={event} index={index} isLoggedIn={!!user} onAuthClick={triggerAuth} />
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
          cityName={
            cityName && groupType
              ? `${cityName} ${groupType.replace(/-/g,' ').replace(/\w/g,c=>c.toUpperCase())} Calendar`
              : cityName
              ? `${cityName} Business Calendar`
              : undefined
          }
        />
      )}
    </section>
  );
}
