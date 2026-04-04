'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar } from './Calendar';
import { MonthCalendar } from './MonthCalendar';
import { AuthModal } from './auth/AuthModal';
import { getWeekRangeFromToday, useMidnightReset } from '../lib/utils';
import type { City, Event } from '../lib/supabase';

interface EventGateProps {
  initialEvents: Event[];
  forcedCity: City;
  groupType?: string;
  cityName?: string;
  showMonthCalendar?: boolean;
}

export function EventGate({ initialEvents, forcedCity, groupType, cityName, showMonthCalendar = false }: EventGateProps) {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const resolvedCityName = cityName ?? forcedCity;
  const today = useMidnightReset();
  const weekRange = getWeekRangeFromToday();

  if (loading) {
    return (
      <>
        {showMonthCalendar && (
          <section className="cal-section" style={{ paddingBottom: 0 }}>
            <div className="cal-inner">
              <MonthCalendar onDateSelect={setSelectedDate} onAuthClick={() => setAuthOpen(true)} />
            </div>
          </section>
        )}
        <Calendar
          initialEvents={initialEvents}
          forcedCity={forcedCity}
          groupType={groupType}
          minDate={today}
          maxDate={today}
          showGateBanner={false}
          onAuthClick={() => setAuthOpen(true)}
          cityName={resolvedCityName}
        />
      </>
    );
  }

  if (user) {
    return (
      <>
        {showMonthCalendar && (
          <section className="cal-section" style={{ paddingBottom: 0 }}>
            <div className="cal-inner">
              <MonthCalendar onDateSelect={setSelectedDate} onAuthClick={() => setAuthOpen(true)} />
            </div>
          </section>
        )}
        <Calendar
          initialEvents={initialEvents}
          forcedCity={forcedCity}
          groupType={groupType}
          minDate={weekRange.start}
          maxDate={weekRange.end}
          cityName={resolvedCityName}
        />
      </>
    );
  }

  return (
    <>
      {showMonthCalendar && (
        <section className="cal-section" style={{ paddingBottom: 0 }}>
          <div className="cal-inner">
            <MonthCalendar onDateSelect={setSelectedDate} onAuthClick={() => setAuthOpen(true)} />
          </div>
        </section>
      )}
      <Calendar
        initialEvents={initialEvents}
        forcedCity={forcedCity}
        groupType={groupType}
        minDate={today}
        maxDate={today}
        showGateBanner={true}
        onAuthClick={() => setAuthOpen(true)}
        cityName={resolvedCityName}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
        cityName={resolvedCityName}
      />
    </>
  );
}
