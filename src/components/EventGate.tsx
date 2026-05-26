'use client';
import { useState } from 'react';
import { Calendar } from './Calendar';
import { MonthCalendar } from './MonthCalendar';
import { useMidnightReset, getCurrentWeekRange } from '../lib/utils';
import type { City, Event } from '../lib/supabase';

interface EventGateProps {
  initialEvents: Event[];
  forcedCity: City;
  groupType?: string;
  cityName?: string;
  showMonthCalendar?: boolean;
  weekMode?: boolean;
  newsletterHeading?: string;
  newsletterSubtext?: string;
  subscribeHref?: string;
  /** Slug of the city for sponsor lookup, e.g. 'san-antonio' */
  citySlug?: string;
  /** Slug of the category for sponsor lookup, e.g. 'networking' */
  categorySlug?: string;
}

export function EventGate({ initialEvents, forcedCity, groupType, cityName, showMonthCalendar = false, weekMode = false, newsletterHeading, newsletterSubtext, subscribeHref, citySlug, categorySlug }: EventGateProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const resolvedCityName = cityName ?? forcedCity;
  const today = useMidnightReset();

  // Sub-cal pages (groupType set) show the full current week Sun–Sat.
  // Main city pages use today as the floor so past days are hidden.
  const isSubCal = weekMode || !!groupType;
  const { start: weekStart, end: weekEnd } = getCurrentWeekRange();
  const effectiveMinDate = isSubCal ? weekStart : today;
  const effectiveMaxDate = isSubCal ? weekEnd : undefined;

  const eventDates = new Set(initialEvents.map(e => e.start_date));

  return (
    <>
      {showMonthCalendar && (
        <section className="cal-section" style={{ paddingBottom: 0 }}>
          <div className="cal-inner">
            <MonthCalendar onDateSelect={setSelectedDate} onAuthClick={() => {}} eventDates={eventDates} />
          </div>
        </section>
      )}
      <Calendar
        initialEvents={initialEvents}
        forcedCity={forcedCity}
        groupType={groupType}
        minDate={effectiveMinDate}
        maxDate={effectiveMaxDate}
        cityName={resolvedCityName}
        newsletterHeading={newsletterHeading}
        newsletterSubtext={newsletterSubtext}
        subscribeHref={subscribeHref}
        externalSelectedDate={selectedDate}
        onExternalDateClear={() => setSelectedDate(null)}
        weekMode={weekMode || !!groupType}
        showSearch={!showMonthCalendar}
        citySlug={citySlug}
        categorySlug={categorySlug}
      />
    </>
  );
}
