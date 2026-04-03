'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Lock } from 'lucide-react';
import type { Event, City } from '../lib/supabase';
import { dateKey, formatDate, parseDate, sortEventsByTime } from '../lib/utils';
import { EventCard } from './EventCard';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

interface CalendarProps {
  initialEvents: Event[];
  forcedCity?: City;
  eventCategory?: string;
  maxDate?: string;
  minDate?: string;
  showGateBanner?: boolean;
  onAuthClick?: () => void;
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_LABELS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const grid: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) grid.push(null);
  for (let d = 1; d <= last.getDate(); d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export function Calendar({ initialEvents, forcedCity, eventCategory, maxDate, minDate, showGateBanner, onAuthClick }: CalendarProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [rangeStart, setRangeStart] = useState<string | null>(() => dateKey(new Date()));
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [inlineAuthOpen, setInlineAuthOpen] = useState(false);

  const today = dateKey(new Date());

  function triggerAuth() {
    if (onAuthClick) {
      onAuthClick();
    } else {
      setInlineAuthOpen(true);
    }
  }

  const cityFiltered = initialEvents.filter((e) => {
    if (forcedCity && e.city_calendar !== forcedCity) return false;
    if (eventCategory && e.event_category !== eventCategory) return false;
    if (minDate && e.start_date < minDate) return false;
    if (maxDate && e.start_date > maxDate) return false;
    return true;
  });

  function handleDayClick(dk: string) {
    if (dk < today) return;
    if (dk > today && !user) {
      triggerAuth();
      return;
    }
    if (maxDate && dk > maxDate) return;
    setSearchQuery('');
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dk);
      setRangeEnd(null);
    } else {
      if (dk < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(dk);
      } else if (dk === rangeStart) {
        setRangeEnd(null);
      } else {
        setRangeEnd(dk);
      }
    }
  }

  function goToToday() {
    const now = new Date();
    setCalMonth({ year: now.getFullYear(), month: now.getMonth() });
    setRangeStart(today);
    setRangeEnd(null);
    setSearchQuery('');
  }

  function stepDay(direction: 1 | -1) {
    if (direction === 1 && !user) {
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
    setCalMonth({ year: current.getFullYear(), month: current.getMonth() });
  }

  function prevMonth() {
    const d = new Date(calMonth.year, calMonth.month - 1, 1);
    setCalMonth({ year: d.getFullYear(), month: d.getMonth() });
  }

  function nextMonth() {
    const d = new Date(calMonth.year, calMonth.month + 1, 1);
    setCalMonth({ year: d.getFullYear(), month: d.getMonth() });
  }

  const effectiveEnd =
    hoverDate && rangeStart && !rangeEnd && hoverDate >= rangeStart
      ? hoverDate
      : rangeEnd;

  function inRange(dk: string): boolean {
    if (!rangeStart) return false;
    const end = effectiveEnd ?? rangeStart;
    return dk > rangeStart && dk < end;
  }

  const grid = getMonthGrid(calMonth.year, calMonth.month);
  const datesWithEvents = new Set(cityFiltered.map((e) => e.start_date));

  const searchActive = searchQuery.trim().length > 0;

  let displayEvents: Event[];
  if (searchActive) {
    const q = searchQuery.toLowerCase();
    displayEvents = cityFiltered
      .filter((e) => {
        const text = `${e.name} ${e.description ?? ''} ${e.group_name ?? ''} ${e.address ?? ''} ${e.participation ?? ''} ${e.paid ?? ''}`.toLowerCase();
        return text.includes(q) && e.start_date >= today;
      })
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  } else if (rangeStart) {
    const end = rangeEnd ?? rangeStart;
    displayEvents = sortEventsByTime(
      cityFiltered.filter((e) => e.start_date >= rangeStart && e.start_date <= end)
    ).sort((a, b) => a.start_date.localeCompare(b.start_date) || 0);
  } else {
    displayEvents = sortEventsByTime(cityFiltered.filter((e) => e.start_date >= today));
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

  const nextDayAriaLabel = !user ? 'Create a free account to see future events' : 'Next day';

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

        <div className="cal-card">
          <div className="cal-card-header">
            <div className="cal-card-title">
              <span className="cal-card-month">{MONTH_NAMES[calMonth.month]}</span>
              <span className="cal-card-year">{calMonth.year}</span>
            </div>
            <div className="cal-card-nav">
              <button className="cal-today-btn" onClick={goToToday}>Today</button>
              <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={16} />
              </button>
              <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="cal-grid-header">
            {DAY_LABELS.map((l) => (
              <div key={l} className="cal-grid-day-label">{l}</div>
            ))}
          </div>

          <div className="cal-grid">
            {grid.map((date, i) => {
              if (!date) {
                return <div key={`empty-${i}`} className="cal-cell empty" />;
              }
              const dk = dateKey(date);
              const isPast = dk < today;
              const isBeyondMax = !!(maxDate && dk > maxDate);
              const isFutureGated = !user && dk > today;
              const isDisabled = isPast || isBeyondMax;
              const hasEvents = datesWithEvents.has(dk);
              const isStart = dk === rangeStart;
              const isEnd = dk === (effectiveEnd ?? rangeStart);
              const inRangeVal = inRange(dk);
              const isEdge = isStart || isEnd;
              const isToday = dk === today;

              return (
                <button
                  key={dk}
                  className={[
                    'cal-cell',
                    isPast ? 'past' : '',
                    isBeyondMax ? 'past gated' : '',
                    isFutureGated ? 'future-gated' : '',
                    isToday ? 'is-today' : '',
                    inRangeVal ? 'in-range' : '',
                    isEdge ? 'range-edge' : '',
                    isStart ? 'range-start' : '',
                    isEnd && (rangeEnd || isStart) ? 'range-selected' : '',
                    hasEvents && !isDisabled ? 'has-events' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => {
                    if (isDisabled) return;
                    handleDayClick(dk);
                  }}
                  onMouseEnter={() => !isDisabled && !isFutureGated && rangeStart && !rangeEnd && setHoverDate(dk)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={isDisabled}
                  aria-label={isFutureGated ? 'Create a free account to see future events' : undefined}
                >
                  <span className="cal-cell-num">{date.getDate()}</span>
                  {isFutureGated && <span className="cal-cell-lock"><Lock size={8} /></span>}
                  {hasEvents && !isDisabled && !isFutureGated && <span className="cal-cell-dot" />}
                </button>
              );
            })}
          </div>
        </div>

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
            disabled={rangeStart === today || !rangeStart}
            aria-label="Previous day"
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
            className={['cal-day-arrow', !user ? 'cal-day-arrow-gated' : ''].filter(Boolean).join(' ')}
            onClick={() => stepDay(1)}
            aria-label={nextDayAriaLabel}
          >
            {!user ? <Lock size={18} /> : <ChevronRight size={24} />}
          </button>
        </div>

        <div className="ev-list" style={{ marginTop: '1.5rem' }}>
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
        />
      )}
    </section>
  );
}
