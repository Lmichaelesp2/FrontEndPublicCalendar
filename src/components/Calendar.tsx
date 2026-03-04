import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { supabase, Event, City } from '../lib/supabase';
import { dateKey, formatDate, parseDate, sortEventsByTime } from '../lib/utils';
import { EventCard } from './EventCard';
import { useAuth } from '../contexts/AuthContext';

interface CalendarProps {
  forcedCity?: City;
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

export function Calendar({ forcedCity }: CalendarProps = {}) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [rangeStart, setRangeStart] = useState<string | null>(() => dateKey(new Date()));
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .gte('start_date', today)
        .order('start_date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }

  const today = dateKey(new Date());

  const cityFiltered = events.filter((e) =>
    forcedCity ? e.city_calendar === forcedCity : true
  );

  function handleDayClick(dk: string) {
    if (dk < today) return;
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

  const totalUpcoming = cityFiltered.filter((e) => e.start_date >= today).length;
  const eventCount = displayEvents.length;

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd !== rangeStart
      ? `${formatDate(parseDate(rangeStart))} – ${formatDate(parseDate(rangeEnd))}`
      : formatDate(parseDate(rangeStart))
    : 'All Upcoming';

  const isMultiDay = !!(rangeEnd && rangeEnd !== rangeStart) || searchActive;

  return (
    <section className="cal-section" id="calendar">
      <div className="cal-inner">

        <div className="cal-search-row">
          <div className="cal-search-wrap">
            <Search size={15} className="cal-search-icon" />
            <input
              type="text"
              className="cal-search-input"
              placeholder={user ? 'Search by keyword...' : 'Log in to search events...'}
              value={searchQuery}
              onChange={(e) => user && setSearchQuery(e.target.value)}
              disabled={!user}
              onClick={() => !user && document.dispatchEvent(new CustomEvent('open-auth-modal'))}
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
                    isToday ? 'is-today' : '',
                    inRangeVal ? 'in-range' : '',
                    isEdge ? 'range-edge' : '',
                    isStart ? 'range-start' : '',
                    isEnd && (rangeEnd || isStart) ? 'range-selected' : '',
                    hasEvents && !isPast ? 'has-events' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => !isPast && handleDayClick(dk)}
                  onMouseEnter={() => !isPast && rangeStart && !rangeEnd && setHoverDate(dk)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={isPast}
                >
                  <span className="cal-cell-num">{date.getDate()}</span>
                  {hasEvents && !isPast && <span className="cal-cell-dot" />}
                </button>
              );
            })}
          </div>
        </div>

        {!user && (
          <div className="cal-guest-note">
            <button
              className="cal-guest-login-btn"
              onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))}
            >
              Log in
            </button>{' '}
            to search all {totalUpcoming} upcoming events and see full event details.
          </div>
        )}

        <div className="ev-list" style={{ marginTop: '1.5rem' }}>
          {loading ? (
            <div className="no-ev"><p>Loading events...</p></div>
          ) : displayEvents.length === 0 ? (
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
                    <EventCard event={event} index={index} isLoggedIn={!!user} />
                  </div>
                );
              })}
            </>
          )}
        </div>

      </div>
    </section>
  );
}
