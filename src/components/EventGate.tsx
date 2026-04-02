'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar } from './Calendar';
import { AuthModal } from './auth/AuthModal';
import { getTodayKey, getWeekRangeFromToday } from '../lib/utils';
import type { City, Event } from '../lib/supabase';

interface EventGateProps {
  initialEvents: Event[];
  forcedCity: City;
  eventCategory?: string;
}

export function EventGate({ initialEvents, forcedCity, eventCategory }: EventGateProps) {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const today = getTodayKey();
  const weekRange = getWeekRangeFromToday();

  if (loading) {
    return (
      <Calendar
        initialEvents={initialEvents}
        forcedCity={forcedCity}
        eventCategory={eventCategory}
        minDate={today}
        maxDate={today}
        showGateBanner={false}
        onAuthClick={() => setAuthOpen(true)}
      />
    );
  }

  if (user) {
    return (
      <Calendar
        initialEvents={initialEvents}
        forcedCity={forcedCity}
        eventCategory={eventCategory}
        minDate={weekRange.start}
        maxDate={weekRange.end}
      />
    );
  }

  return (
    <>
      <Calendar
        initialEvents={initialEvents}
        forcedCity={forcedCity}
        eventCategory={eventCategory}
        minDate={today}
        maxDate={today}
        showGateBanner={true}
        onAuthClick={() => setAuthOpen(true)}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
      />
    </>
  );
}
