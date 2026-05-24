'use client';

import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { EventGate } from './EventGate';
import type { Event, City } from '../lib/supabase';

interface PremiumCityViewProps {
  city: City;
  citySlug: string;
  initialEvents: Event[];
}

export function PremiumCityView({ city, citySlug, initialEvents }: PremiumCityViewProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />

      {/* Slim premium header */}
      <div style={{
        borderBottom: '1px solid #1e2236',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0f1120',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}>
            {city} Business Calendar
          </span>
          <span style={{
            background: '#c2410c',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: '4px',
            padding: '2px 8px',
          }}>
            Premium
          </span>
        </div>
        <span style={{ color: '#555', fontSize: '12px' }}>
          30 days of events · Personalized
        </span>
      </div>

      {/* Full-focus calendar */}
      <div style={{ flex: 1 }}>
        <EventGate
          forcedCity={city}
          initialEvents={initialEvents}
          showMonthCalendar={true}
        />
      </div>

      <Footer showIndustryCalendars={false} citySlug={citySlug} cityName={city} />
    </div>
  );
}
