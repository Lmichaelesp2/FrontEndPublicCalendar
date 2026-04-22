'use client';
import { useState } from 'react';
import { Calendar } from './Calendar';
import { MonthCalendar } from './MonthCalendar';
import { useMidnightReset } from '../lib/utils';
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
}

export function EventGate({ initialEvents, forcedCity, groupType, cityName, showMonthCalendar = false, weekMode = false, newsletterHeading, newsletterSubtext, subscribeHref }: EventGateProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const resolvedCityName = cityName ?? forcedCity;
  const today = useMidnightReset();

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
        minDate={today}
        cityName={resolvedCityName}
        newsletterHeading={newsletterHeading}
        newsletterSubtext={newsletterSubtext}
        subscribeHref={subscribeHref}
        externalSelectedDate={selectedDate}
        onExternalDateClear={() => setSelectedDate(null)}
        weekMode={weekMode || !!groupType}
      />
    </>
  );
}
