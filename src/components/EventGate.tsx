import { useState } from 'react';
import { Lock } from 'lucide-react';
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
      />

      <div className="ev-gate-banner">
        <div className="ev-gate-banner-inner">
          <div className="ev-gate-icon">
            <Lock size={20} />
          </div>
          <div className="ev-gate-text">
            <p className="ev-gate-heading">See the full week's events — free</p>
            <p className="ev-gate-sub">Create a free account to unlock Monday through Sunday view. No credit card, no paywall.</p>
          </div>
          <button className="ev-gate-btn" onClick={() => setAuthOpen(true)}>
            Create Free Account
          </button>
          <button className="ev-gate-signin" onClick={() => setAuthOpen(true)}>
            Sign in
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
      />
    </>
  );
}
