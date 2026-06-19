'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { useUpgrade } from '../hooks/useUpgrade';
import { SHOW_EVENT_ASSISTANT } from '../lib/featureFlags';

const FEATURES_FREE = [
  'Current week events only',
  'San Antonio, Austin, Dallas & Houston',
  'Browse by day',
];

const FEATURES_PREMIUM = [
  '30 days of upcoming events',
  'My Recommended Events — personalized to your goals',
  'Choose your city — SA, Austin, Dallas, or Houston',
  'Advanced filters — city, cost, time, category',
  'Personalized weekly email digest',
  'AI-powered event recommendations',
];

export function UpgradePageClient() {
  const { user, profile } = useAuth();
  const { startCheckout, loading } = useUpgrade();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') ?? '/';
  const isPremium = profile?.subscription_tier === 'premium';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f7f4' }}>
      <Navigation />

      <main style={{ flex: 1, padding: '60px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            background: '#c2410c', color: '#fff',
            fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em',
            textTransform: 'uppercase', borderRadius: '4px', padding: '3px 10px',
            display: 'inline-block', marginBottom: '16px',
          }}>
            Event Assistant
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 12px', lineHeight: 1.2 }}>
            Stop browsing. Start getting the right events.
          </h1>
          <p style={{ color: '#555', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' }}>
            The Event Assistant learns your city, industry, and goals — then shows you the events worth your time and delivers a personalized digest every Monday.
          </p>
        </div>

        {/* Already premium */}
        {isPremium && (
          <div style={{
            background: '#fff', border: '2px solid #c2410c', borderRadius: '16px',
            padding: '32px', textAlign: 'center', maxWidth: '480px', margin: '0 auto',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: '0 0 8px' }}>
              You're on the Event Assistant!
            </p>
            <p style={{ color: '#555', margin: '0 0 20px' }}>
              Head back to your calendar to see your personalized events.
            </p>
            <Link href={returnUrl} style={{
              display: 'inline-block', background: '#c2410c', color: '#fff',
              padding: '12px 28px', borderRadius: '8px', fontWeight: 700,
              textDecoration: 'none', fontSize: '0.95rem',
            }}>
              Back to Calendar
            </Link>
          </div>
        )}

        {/* Paused — flag is off and this user isn't already premium */}
        {!isPremium && !SHOW_EVENT_ASSISTANT && (
          <div style={{
            background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px',
            padding: '32px', textAlign: 'center', maxWidth: '480px', margin: '0 auto',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: '0 0 8px' }}>
              New signups are paused right now
            </p>
            <p style={{ color: '#555', margin: '0 0 20px' }}>
              The Event Assistant isn't taking new subscribers at the moment. The full calendar is still free to browse anytime.
            </p>
            <Link href="/subscribe" style={{
              display: 'inline-block', background: '#111', color: '#fff',
              padding: '12px 28px', borderRadius: '8px', fontWeight: 700,
              textDecoration: 'none', fontSize: '0.95rem',
            }}>
              Browse the Free Calendar
            </Link>
          </div>
        )}

        {/* Pricing cards */}
        {!isPremium && SHOW_EVENT_ASSISTANT && (
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Free card */}
            <div style={{
              background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px',
              padding: '32px 28px', width: '280px', flexShrink: 0,
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '4px' }}>$0</div>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>forever</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {FEATURES_FREE.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', color: '#444' }}>
                    <Check size={14} style={{ color: '#999', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div style={{
                display: 'block', textAlign: 'center', padding: '11px',
                border: '1px solid #ddd', borderRadius: '8px',
                fontSize: '14px', fontWeight: 600, color: '#888',
              }}>
                Your current plan
              </div>
            </div>

            {/* Premium card */}
            <div style={{
              background: '#fff', border: '2px solid #c2410c', borderRadius: '16px',
              padding: '32px 28px', width: '300px', flexShrink: 0,
              boxShadow: '0 8px 32px rgba(194,65,12,0.12)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                background: '#c2410c', color: '#fff', fontSize: '11px', fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 14px', borderRadius: '20px',
              }}>
                Most Popular
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#c2410c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Assistant</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#111' }}>$14.99</span>
                <span style={{ fontSize: '14px', color: '#888' }}>/month</span>
              </div>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>Cancel anytime</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {FEATURES_PREMIUM.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', color: '#333' }}>
                    <Check size={14} style={{ color: '#c2410c', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              {user ? (
                <button
                  onClick={() => startCheckout(returnUrl)}
                  disabled={loading}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    background: loading ? '#e5a07a' : '#c2410c', color: '#fff',
                    padding: '13px', borderRadius: '8px', border: 'none',
                    fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  {loading ? 'Redirecting…' : 'Get the Event Assistant — $14.99/mo'}
                </button>
              ) : (
                <Link
                  href={`/texas/san-antonio/subscribe?next=/upgrade?from=${encodeURIComponent(returnUrl)}`}
                  style={{
                    display: 'block', textAlign: 'center',
                    background: '#c2410c', color: '#fff',
                    padding: '13px', borderRadius: '8px',
                    fontSize: '15px', fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  Sign Up Free First
                </Link>
              )}

              <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '10px', marginBottom: 0 }}>
                Secure checkout via Stripe · Cancel anytime
              </p>
            </div>
          </div>
        )}

        {/* Trust line */}
        {!isPremium && SHOW_EVENT_ASSISTANT && (
          <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '32px' }}>
            Already subscribed on the old calendar?{' '}
            <a href="mailto:michael@localbusinesscalendars.com" style={{ color: '#c2410c', textDecoration: 'none' }}>
              Email us
            </a>{' '}
            and we'll transfer your account.
          </p>
        )}
      </main>

      <Footer variant="homepage" />
    </div>
  );
}
