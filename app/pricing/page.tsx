import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Navigation } from '../../src/components/Navigation';
import { Footer } from '../../src/components/Footer';

export const metadata: Metadata = {
  title: 'Pricing | Local Business Calendars',
  description: 'The full calendar is free. Get the Event Assistant when you want personalized events, advanced filters, and a weekly digest built for your goals.',
};

const FREE_FEATURES = [
  '14 days of upcoming events',
  'Full event details — address, organizer, description',
  'Chamber, networking, real estate & more',
  'Monday newsletter — just give us your email',
  'Free forever — no credit card',
];

const PREMIUM_FEATURES = [
  '30 days of upcoming events',
  'My Recommended Events — personalized to your goals',
  'Choose your city — SA, Austin, Dallas, or Houston',
  'Advanced filters — city, cost, time, category',
  'Personalized event recommendations',
  'AI-powered event recommendations',
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f7f4' }}>
      <Navigation />

      <main style={{ flex: 1, padding: '64px 24px 80px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 14px', lineHeight: 1.2 }}>
            Free calendar. Event Assistant when you're ready.
          </h1>
          <p style={{ color: '#666', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            The full calendar is open to everyone. When you want events picked for you, the Event Assistant personalizes your view and builds a weekly digest around your goals.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'stretch' }}>

          {/* Free card — leading card */}
          <div style={{
            background: '#fff',
            border: '2px solid #111',
            borderRadius: '16px',
            padding: '36px 32px',
            width: '300px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#111', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111' }}>$0</span>
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>Forever. No credit card.</div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
              {FREE_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#444', lineHeight: 1.4 }}>
                  <Check size={15} style={{ color: '#111', flexShrink: 0, marginTop: '1px' }} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/subscribe"
              style={{
                display: 'block', textAlign: 'center',
                background: '#111', color: '#fff',
                padding: '13px', borderRadius: '8px',
                fontSize: '15px', fontWeight: 700, textDecoration: 'none',
              }}
            >
              Start Free →
            </Link>
          </div>

          {/* Premium card — secondary */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: '16px',
            padding: '36px 32px',
            width: '300px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#c2410c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Event Assistant</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111' }}>$14.99</span>
              <span style={{ fontSize: '14px', color: '#888' }}>/month</span>
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>Cancel anytime.</div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
              {PREMIUM_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', fontSize: '14px', color: '#444', lineHeight: 1.4 }}>
                  <Check size={15} style={{ color: '#c2410c', flexShrink: 0, marginTop: '1px' }} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/upgrade"
              style={{
                display: 'block', textAlign: 'center',
                background: '#fff', color: '#c2410c',
                padding: '12px', borderRadius: '8px',
                fontSize: '15px', fontWeight: 700, textDecoration: 'none',
                border: '1.5px solid #c2410c',
              }}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '40px', lineHeight: 1.6 }}>
          Already a subscriber from the old calendar?{' '}
          <a href="mailto:michael@localbusinesscalendars.com" style={{ color: '#c2410c', textDecoration: 'none' }}>
            Email us
          </a>{' '}
          and we'll get your account set up.
        </p>

      </main>

      <Footer variant="homepage" />
    </div>
  );
}
