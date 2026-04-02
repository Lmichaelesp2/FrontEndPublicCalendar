'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar } from './Calendar';
import { AuthModal } from './auth/AuthModal';
import { getTodayKey, getWeekRangeFromToday } from '../lib/utils';
import type { City } from '../lib/supabase';

interface EventGateProps {
  forcedCity: City;
  eventCategory?: string;
}

export function EventGate({ forcedCity, eventCategory }: EventGateProps) {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const today = getTodayKey();
  const weekRange = getWeekRangeFromToday();

  if (loading) {
    return (
      <div className="ev-gate-loading">
        <div className="ev-gate-spinner" />
      </div>
    );
  }

  if (user) {
    return (
      <Calendar
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
