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
  cityName?: string;
}

export function EventGate({ initialEvents, forcedCity, eventCategory, cityName }: EventGateProps) {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const resolvedCityName = cityName ?? forcedCity;
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
        cityName={resolvedCityName}
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
        cityName={resolvedCityName}
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
