import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { supabase, Event, CITIES, City } from '../lib/supabase';
import { dateKey, parseDate, sortEventsByTime } from '../lib/utils';
import { EventCard } from './EventCard';

const CITY_ROUTES: Record<City, string> = {
  'San Antonio': '/san-antonio',
  'Austin': '/austin',
  'Dallas': '/dallas',
  'Houston': '/houston',
};

const HOME_LIMIT = 10;

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

export function HomepageCities() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => dateKey(new Date()));

  useEffect(() => {
    async function fetchEvents() {
      try {
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
    fetchEvents();
  }, []);

  const today = dateKey(new Date());
  const datesWithEvents = new Set(events.map((e) => e.start_date));
  const grid = getMonthGrid(calMonth.year, calMonth.month);

  function goToToday() {
    const now = new Date();
    setCalMonth({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedDate(today);
  }

  function stepDay(direction: 1 | -1) {
    const current = parseDate(selectedDate);
    current.setDate(current.getDate() + direction);
    if (dateKey(current) < today) return;
    const dk = dateKey(current);
    setSelectedDate(dk);
    setCalMonth({ year: current.getFullYear(), month: current.getMonth() });
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
            Select any date to browse events by city —{' '}
            <span className="hpc-login-text">log in</span> to search all upcoming events and see full details
          </p>
        </div>

        <div className="hpc-cal-card">
          <div className="hpc-cal-header">
            <div className="hpc-cal-title">
              <span className="hpc-cal-month">{MONTH_NAMES[calMonth.month]}</span>
              <span className="hpc-cal-year">{calMonth.year}</span>
            </div>
            <div className="hpc-cal-nav">
              <button className="hpc-today-btn" onClick={goToToday}>Today</button>
              <button
                className="hpc-nav-btn"
                onClick={() => {
                  const d = new Date(calMonth.year, calMonth.month - 1, 1);
                  setCalMonth({ year: d.getFullYear(), month: d.getMonth() });
                }}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="hpc-nav-btn"
                onClick={() => {
                  const d = new Date(calMonth.year, calMonth.month + 1, 1);
                  setCalMonth({ year: d.getFullYear(), month: d.getMonth() });
                }}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="hpc-grid-header">
            {DAY_LABELS.map((l) => (
              <div key={l} className="hpc-grid-day-label">{l}</div>
            ))}
          </div>

          <div className="hpc-grid">
            {grid.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} className="hpc-cal-cell empty" />;
              const dk = dateKey(date);
              const isPast = dk < today;
              const hasEvents = datesWithEvents.has(dk);
              const isSelected = dk === selectedDate;
              const isToday = dk === today;

              return (
                <button
                  key={dk}
                  className={[
                    'hpc-cal-cell',
                    isPast ? 'past' : '',
                    isToday ? 'is-today' : '',
                    isSelected ? 'selected' : '',
                    hasEvents && !isPast ? 'has-events' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => !isPast && setSelectedDate(dk)}
                  disabled={isPast}
                >
                  <span className="hpc-cell-num">{date.getDate()}</span>
                  {hasEvents && !isPast && <span className="hpc-cell-dot" />}
                </button>
              );
            })}
          </div>
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
            className="hpc-day-arrow"
            onClick={() => stepDay(1)}
            aria-label="Next day"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {loading ? (
          <div className="hpc-loading">Loading events...</div>
        ) : (
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
                  hasMore={hasMore}
                  cityRoute={CITY_ROUTES[city]}
                  selectedDate={selectedDate}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function CitySection({
  city, events, hasMore, cityRoute, selectedDate,
}: {
  city: City;
  events: Event[];
  hasMore: boolean;
  cityRoute: string;
  selectedDate: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="hpc-city-block">
      <div className="hpc-city-header" onClick={() => setExpanded(!expanded)}>
        <div className="hpc-city-title-row">
          <span className="hpc-city-dot" />
          <h3 className="hpc-city-name">{city}</h3>
          <span className="hpc-city-count">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="hpc-city-actions">
          <Link
            to={cityRoute}
            className="hpc-city-link"
            onClick={(e) => e.stopPropagation()}
          >
            View all <ChevronRight size={13} />
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
                <EventCard key={event.id} event={event} index={i} isLoggedIn={false} />
              ))}
              {hasMore && (
                <div className="hpc-city-cta">
                  <div className="hpc-city-cta-text">
                    More events in {city} are available — log in or subscribe to see the full calendar.
                  </div>
                  <div className="hpc-city-cta-btns">
                    <Link to="/login" className="hpc-cta-btn hpc-cta-login">
                      <LogIn size={15} />
                      Log in
                    </Link>
                    <Link to={`${cityRoute}/subscribe`} className="hpc-cta-btn hpc-cta-subscribe">
                      <UserPlus size={15} />
                      Subscribe to {city}
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
