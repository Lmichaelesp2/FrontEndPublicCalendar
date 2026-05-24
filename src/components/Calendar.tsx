'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Mail, Calendar as CalendarIcon, List, CalendarDays } from 'lucide-react';
import type { Event, City } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { dateKey, formatDate, parseDate, sortEventsByTime, useMidnightReset, getMondayWeekRange } from '../lib/utils';
import { resolveGroupType } from '../lib/cities';

import { EventCard } from './EventCard';
import { FilterBar, FilterState, emptyFilters, hasActiveFilters } from './FilterBar';
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
  const { user, profile, userFilters } = useAuth();
  const networkProfile = userFilters[0]?.filter_view ?? null;
  const today = useMidnightReset();

  // ── Free vs. Premium date cap ─────────────────────────────────────────────
  // Free users: 7 days from today. Premium users: 30 days. weekMode (sub-cal
  // pages) is not gated — they use their own minDate/maxDate.
  const isPremium = profile?.subscription_tier === 'premium';
  const dateCap = (() => {
    if (weekMode) return maxDate ?? null; // sub-cal pages use their own range
    const d = new Date();
    d.setDate(d.getDate() + (isPremium ? 29 : 6)); // 30 days or 7 days
    const cap = dateKey(d);
    if (maxDate && maxDate < cap) return maxDate; // respect tighter passed maxDate
    return cap;
  })();
  const [liveEvents, setLiveEvents] = useState<Event[] | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchLive() {
      // For sub-cals (minDate = week start), fetch from the week start so the
      // full Sun–Sat window is visible even on Saturday evening.
      const fetchFrom = minDate && minDate < today ? minDate : today;

      let query = supabase
        .from('events_published_view')
        .select('*')
        .eq('status', 'approved')
        .gte('start_date', fetchFrom)
        .order('start_date', { ascending: true })
        .limit(2000);

      if (forcedCity) query = query.eq('city_calendar', forcedCity);
      if (groupType) query = query.ilike('event_category', `%${resolveGroupType(groupType)}%`);
      if (maxDate) query = query.lte('start_date', maxDate);
      else if (dateCap) query = query.lte('start_date', dateCap);

      const { data } = await query;
      if (data) setLiveEvents(data as Event[]);
    }
    fetchLive();
  }, [forcedCity, groupType, dateCap, minDate, maxDate, today]);

  // Day-based navigation — starts on today
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [inlineAuthOpen, setInlineAuthOpen] = useState(false);
  const [showUpgradeNudge, setShowUpgradeNudge] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'list'>('day');
  const [manualFilters, setManualFilters] = useState<FilterState>(emptyFilters());

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
    if (direction === 1 && dateCap && newKey > dateCap) {
      setShowUpgradeNudge(true);
      return;
    }
    if (showUpgradeNudge) setShowUpgradeNudge(false);
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

  // personalization active when: premium + has profile + not a sub-cal + user hasn't toggled it off
  const personalizationActive = !weekMode && isPremium && !!networkProfile && isPersonalized;

  const cityFiltered = eventsSource.filter((e) => {
    if (forcedCity && e.city_calendar !== forcedCity) return false;
    // In week mode, server already filtered by groupType — skip client-side category filter
    if (!weekMode && groupType && !e.event_category?.includes(resolveGroupType(groupType))) return false;
    if (minDate && e.start_date < minDate) return false;
    if (dateCap && e.start_date > dateCap) return false;

    // ── Personalization filters (premium only) ────────────────────────────
    if (personalizationActive && networkProfile) {
      // City filter — only apply if no forcedCity already set
      if (!forcedCity && networkProfile.city) {
        if (e.city_calendar !== networkProfile.city) return false;
      }
      // Category filter — only filter events that HAVE a category and it doesn't match.
      // Uncategorized events (null) always pass through.
      if (networkProfile.categories.length > 0 && e.event_category) {
        const hasMatch = networkProfile.categories.some(cat =>
          e.event_category!.includes(cat)
        );
        if (!hasMatch) return false;
      }
      // Participation filter
      if (networkProfile.participation === 'In-Person') {
        if (e.participation === 'Virtual') return false;
      }
    }

    // ── Manual filter bar (premium "View All Events" mode only) ───────────
    if (isPremium && !isPersonalized && !weekMode && hasActiveFilters(manualFilters)) {
      // City
      if (manualFilters.cities.length > 0) {
        if (!e.city_calendar || !manualFilters.cities.includes(e.city_calendar)) return false;
      }
      // Cost
      if (manualFilters.costs.length > 0) {
        const costVal = e.paid === 'Paid' ? 'Paid' : e.paid === 'Free' ? 'Free' : 'Unknown';
        if (!manualFilters.costs.includes(costVal)) return false;
      }
      // Time of day
      if (manualFilters.times.length > 0 && e.start_time) {
        const hour = parseInt(e.start_time.split(':')[0] ?? '12', 10);
        const tod = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
        if (!manualFilters.times.includes(tod)) return false;
      }
      // Participation
      if (manualFilters.participation.length > 0 && e.participation) {
        if (!manualFilters.participation.includes(e.participation)) return false;
      }
      // Location (part_of_town)
      if (manualFilters.locations.length > 0) {
        const loc = e.part_of_town ?? 'No Address';
        if (!manualFilters.locations.includes(loc)) return false;
      }
      // Category — null-category events pass through
      if (manualFilters.categories.length > 0 && e.event_category) {
        const hasMatch = manualFilters.categories.some(cat => e.event_category!.includes(cat));
        if (!hasMatch) return false;
      }
    }

    return true;
  });

  const searchActive = searchQuery.trim().length > 0;

  // Use external date from MonthCalendar if provided, otherwise use internal selectedDate
  const effectiveDate = externalSelectedDate ?? selectedDate;

  const isListView = isPremium && !weekMode && viewMode === 'list';

  let displayEvents: Event[];
  if (searchActive) {
    const q = searchQuery.toLowerCase();
    displayEvents = cityFiltered
      .filter((e) => {
        const text = `${e.name} ${e.description ?? ''} ${e.org_name ?? ''} ${e.address ?? ''} ${e.participation ?? ''} ${e.paid ?? ''}`.toLowerCase();
        return text.includes(q);
      })
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  } else if (isListView) {
    // Premium list view — all upcoming events sorted by date then time
    displayEvents = cityFiltered
      .sort((a, b) => a.start_date.localeCompare(b.start_date) || a.start_time?.localeCompare(b.start_time ?? '') || 0);
  } else if (weekMode) {
    // Show all events already filtered by minDate/maxDate (full Sun–Sat week for sub-cals)
    displayEvents = cityFiltered
      .sort((a, b) => a.start_date.localeCompare(b.start_date) || a.start_time?.localeCompare(b.start_time ?? '') || 0);
  } else {
    displayEvents = sortEventsByTime(
      cityFiltered.filter((e) => e.start_date === effectiveDate)
    );
  }

  const eventCount = displayEvents.length;
  const selectedDateObj = parseDate(effectiveDate);
  const dayLabel = isListView
    ? 'All Upcoming Events'
    : weekMode
    ? 'All Upcoming Events'
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

        {/* Premium view toggle — Day vs List */}
        {isPremium && !weekMode && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
            <div style={{
              display: 'inline-flex',
              background: '#1e2130',
              border: '1px solid #2a2f45',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px',
            }}>
              <button
                onClick={() => setViewMode('day')}
                title="Day view"
                style={{
                  background: viewMode === 'day' ? '#2a3050' : 'none',
                  border: 'none',
                  borderRadius: '6px',
                  color: viewMode === 'day' ? '#f5a623' : '#666',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  fontWeight: viewMode === 'day' ? 700 : 400,
                }}
              >
                <CalendarDays size={13} /> Day
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List view"
                style={{
                  background: viewMode === 'list' ? '#2a3050' : 'none',
                  border: 'none',
                  borderRadius: '6px',
                  color: viewMode === 'list' ? '#f5a623' : '#666',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  fontWeight: viewMode === 'list' ? 700 : 400,
                }}
              >
                <List size={13} /> List
              </button>
            </div>
          </div>
        )}

        {/* Day navigation — hidden in list view */}
        <div className="cal-day-nav" style={{ position: 'relative', display: isListView ? 'none' : undefined }}>
          {!weekMode && <button
            className="cal-day-arrow"
            onClick={() => stepDay(-1)}
            disabled={effectiveDate <= today}
            aria-label="Previous day"
          >
            <ChevronLeft size={24} />
          </button>}

          <div className="cal-day-center">
            {!weekMode && isToday && <div className="cal-day-name">Today</div>}
            {weekMode && <div className="cal-day-name">All Upcoming Events</div>}
            <div className="cal-day-full">{weekMode ? '' : dayLabel}</div>
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

          {!weekMode && <button
            className="cal-day-arrow"
            onClick={() => stepDay(1)}
            aria-label="Next day"
          >
            <ChevronRight size={24} />
          </button>}

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
                  const isPastCap = !!(dateCap && key > dateCap);
                  const isBlocked = isPast || isPastCap;
                  const isSelected = key === selectedDate;
                  const isTodayCell = key === today;
                  return (
                    <button
                      key={i}
                      onClick={() => !isBlocked && selectDayFromPicker(pickerYear, pickerMonth, day)}
                      title={isPastCap && !isPremium ? 'Upgrade to see a full month of events' : undefined}
                      style={{
                        background: isSelected ? '#f5a623' : isTodayCell ? '#2a3050' : 'none',
                        border: isTodayCell && !isSelected ? '1px solid #f5a623' : 'none',
                        borderRadius: '6px',
                        color: isBlocked ? '#444' : isSelected ? '#000' : '#ddd',
                        cursor: isBlocked ? 'not-allowed' : 'pointer',
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

        {/* Upgrade nudge — shown when free user tries to navigate past 7 days */}
        {showUpgradeNudge && !isPremium && (
          <div style={{
            background: 'linear-gradient(135deg, #1e2130 0%, #252a42 100%)',
            border: '1px solid #f5a62340',
            borderRadius: '12px',
            padding: '16px 20px',
            margin: '12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ color: '#f5a623', fontWeight: 700, fontSize: '14px', margin: 0 }}>
                Free accounts show 7 days of events
              </p>
              <p style={{ color: '#aaa', fontSize: '13px', margin: '4px 0 0' }}>
                Upgrade for a full month of personalized events matched to your goals.
              </p>
            </div>
            <button
              onClick={triggerAuth}
              style={{
                background: '#f5a623',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                padding: '8px 16px',
                whiteSpace: 'nowrap',
              }}
            >
              Upgrade →
            </button>
          </div>
        )}

        {/* Personalization banner — shown to premium users with a saved network profile */}
        {isPremium && networkProfile && !weekMode && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 14px',
            margin: '8px 0',
            background: isPersonalized ? '#f5a62312' : '#1e2130',
            border: `1px solid ${isPersonalized ? '#f5a62340' : '#2a2f45'}`,
            borderRadius: '10px',
            flexWrap: 'wrap',
          }}>
            <span style={{ color: '#aaa', fontSize: '13px' }}>
              {isPersonalized
                ? `✦ Personalized · ${networkProfile.categories.join(', ')}${networkProfile.city ? ` · ${networkProfile.city}` : ''}`
                : '⊙ Showing all events'}
            </span>
            <button
              onClick={() => {
                const next = !isPersonalized;
                setIsPersonalized(next);
                if (next) setManualFilters(emptyFilters()); // clear manual filters when going back to personalized
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#f5a623',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                padding: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {isPersonalized ? 'View All Events →' : '← Back to My Events'}
            </button>
          </div>
        )}

        {/* Filter bar — premium "View All Events" mode only */}
        {isPremium && !isPersonalized && !weekMode && (
          <FilterBar filters={manualFilters} onChange={setManualFilters} />
        )}

        {/* Events list */}
        <div className="ev-list" style={{ marginTop: '0.5rem' }}>
          {displayEvents.length === 0 ? (
            <div className="no-ev">
              <p>
                {searchActive
                  ? 'No events match your search.'
                  : weekMode
                  ? 'No upcoming events found.'
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
                // For week mode: group by Monday–Sunday week header
                // For day mode: group by date
                let showDivider = false;
                let dividerLabel = '';

                if (weekMode) {
                  const eventDate = parseDate(event.start_date);
                  const dow = eventDate.getDay(); // 0=Sun
                  const monday = new Date(eventDate);
                  monday.setDate(eventDate.getDate() - ((dow + 6) % 7)); // Monday of this week
                  const sunday = new Date(monday);
                  sunday.setDate(monday.getDate() + 6);
                  const weekKey = dateKey(monday);

                  const prevDate = index > 0 ? parseDate(displayEvents[index - 1].start_date) : null;
                  let prevWeekKey = '';
                  if (prevDate) {
                    const prevDow = prevDate.getDay();
                    const prevMonday = new Date(prevDate);
                    prevMonday.setDate(prevDate.getDate() - ((prevDow + 6) % 7));
                    prevWeekKey = dateKey(prevMonday);
                  }

                  if (index === 0 || weekKey !== prevWeekKey) {
                    showDivider = true;
                    dividerLabel = `Week of ${formatDate(monday)} – ${formatDate(sunday)}`;
                  }
                } else {
                  showDivider = index === 0 || displayEvents[index - 1].start_date !== event.start_date;
                  dividerLabel = formatDate(parseDate(event.start_date));
                }

                return (
                  <div key={event.id}>
                    {showDivider && (
                      <div className="date-div" style={index === 0 ? { marginTop: 0 } : undefined}>
                        {dividerLabel}
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
