'use client';

import { useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { EventGate } from './EventGate';
import { PremiumQuestionnaire } from './auth/PremiumQuestionnaire';
import { useAuth } from '../contexts/AuthContext';
import type { Event, City } from '../lib/supabase';

interface PremiumCityViewProps {
  city: City;
  citySlug: string;
  initialEvents: Event[];
}

export function PremiumCityView({ city, citySlug, initialEvents }: PremiumCityViewProps) {
  const { showQuestionnaire } = useAuth();
  const [expanded, setExpanded] = useState(false);

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
            Event Assistant
          </span>
        </div>
        <span style={{ color: '#555', fontSize: '12px' }}>
          30 days · Personalized to your goals
        </span>
      </div>

      {/* Networking Profile banner — shown until questionnaire is filled out */}
      {showQuestionnaire && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: '#7c1d0e',
            border: 'none',
            borderBottom: '1px solid #a12d12',
            padding: '11px 24px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px' }}>📋</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
              Networking Profile
            </span>
            <span style={{ color: '#ffb89a', fontSize: '13px' }}>
              — Tell us who you want to meet so we can personalize your calendar.
            </span>
          </div>
          <span style={{ color: '#ffb89a', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '16px' }}>
            Fill it out →
          </span>
        </button>
      )}

      {/* Inline questionnaire — expands in-page when banner is clicked */}
      {showQuestionnaire && expanded && (
        <div style={{ background: '#0d0f1c', padding: '24px', borderBottom: '1px solid #1e2236' }}>
          <PremiumQuestionnaire inline onClose={() => setExpanded(false)} />
        </div>
      )}

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
