'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

const FEATURES = [
  {
    icon: 'ti-calendar-event',
    title: '30 days of upcoming events',
    desc: 'See a full month ahead — never miss a key networking event because you found out too late.',
  },
  {
    icon: 'ti-star',
    title: 'My Recommended Events',
    desc: 'Personalized to your goals, industry, and city. We surface the events most relevant to you — not just everything happening.',
  },
  {
    icon: 'ti-map',
    title: 'San Antonio, Austin, Dallas & Houston',
    desc: 'Choose the city that fits your schedule — each with its own dedicated calendar. Perfect if you travel or do business across Texas.',
  },
  {
    icon: 'ti-adjustments-horizontal',
    title: 'Advanced filters',
    desc: 'Filter by city, cost (free vs. paid), time of day, and event category. Find exactly what fits your schedule and budget.',
  },
  {
    icon: 'ti-mail',
    title: 'Personalized event recommendations',
    desc: 'We surface the events most relevant to you based on your industry, city, and goals — personalized to what actually matters to your business.',
  },
  {
    icon: 'ti-sparkles',
    title: 'AI-powered recommendations',
    desc: 'Our AI learns what kinds of events drive results for you and gets smarter over time.',
  },
];

export function EventAssistantPage() {
  return (
    <main className="ea-page">
      <Navigation />

      {/* ── Hero ── */}
      <section className="ea-hero">
        <div className="ea-hero-inner">
          <p className="ea-eyebrow">Event Assistant</p>
          <h1 className="ea-h1">
            Stop guessing which events<br className="ea-br" /> are worth your time.
          </h1>
          <p className="ea-hero-sub">
            Event Assistant is your personal business event planner for Texas. Get personalized recommendations, advanced filters, and a weekly digest — so you always show up to the right room.
          </p>
          <div className="ea-hero-actions">
            <Link href="/upgrade" className="ea-btn-primary">
              Get Event Assistant — $14.99/mo →
            </Link>
            <Link href="/subscribe" className="ea-btn-ghost">
              Browse Free Calendar
            </Link>
          </div>
          <p className="ea-hero-fine">Cancel anytime. No contracts.</p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="ea-section">
        <div className="ea-inner">
          <h2 className="ea-h2">Everything included at $14.99/month</h2>
          <p className="ea-lead">One flat price. No tiers, no add-ons. Everything below is included.</p>
          <div className="ea-features">
            {FEATURES.map(f => (
              <div key={f.title} className="ea-feature" style={{ position: 'relative', overflow: 'hidden' }}>
                <i className={`ti ${f.icon}`} style={{ position: 'absolute', bottom: '-4px', right: '6px', fontSize: '2.25rem', color: 'var(--fg-1)', opacity: 0.07, pointerEvents: 'none' }} aria-hidden="true" />
                <div style={{ position: 'relative' }}>
                  <div className="ea-feature-title">{f.title}</div>
                  <div className="ea-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Free vs Premium comparison ── */}
      <section className="ea-section ea-section--alt">
        <div className="ea-inner">
          <h2 className="ea-h2">Free calendar vs. Event Assistant</h2>
          <div className="ea-compare">
            <div className="ea-compare-col ea-compare-col--free">
              <div className="ea-compare-header">Free Calendar</div>
              <ul className="ea-compare-list">
                {[
                  'This week\'s events only',
                  'All cities and categories',
                  'No personalization',
                  'No filters',
                  'No email digest',
                ].map(item => (
                  <li key={item} className="ea-compare-item ea-compare-item--free">
                    <span className="ea-compare-icon">○</span> {item}
                  </li>
                ))}
              </ul>
              <div className="ea-compare-price">Free</div>
              <Link href="/subscribe" className="ea-compare-btn ea-compare-btn--free">
                Browse Free →
              </Link>
            </div>

            <div className="ea-compare-col ea-compare-col--premium">
              <div className="ea-compare-badge">RECOMMENDED</div>
              <div className="ea-compare-header">Event Assistant</div>
              <ul className="ea-compare-list">
                {[
                  '30 days of upcoming events',
                  'Choose your city — SA, Austin, Dallas, or Houston',
                  'My Recommended Events',
                  'Advanced filters — city, cost, time, category',
                  'Personalized event recommendations',
                  'AI-powered recommendations',
                ].map(item => (
                  <li key={item} className="ea-compare-item ea-compare-item--premium">
                    <span className="ea-compare-icon">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="ea-compare-price">$14.99<span>/mo</span></div>
              <Link href="/upgrade" className="ea-compare-btn ea-compare-btn--premium">
                Get Event Assistant →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="ea-section">
        <div className="ea-inner">
          <h2 className="ea-h2">How it works</h2>
          <div className="ea-steps">
            {[
              { n: '1', title: 'Sign up and tell us about yourself', desc: 'Answer a few quick questions about your industry, city, and networking goals.' },
              { n: '2', title: 'Get your personalized calendar', desc: 'We immediately surface the events most relevant to you — filtered by what matters to your business.' },
              { n: '3', title: 'Get personalized event recommendations', desc: 'We surface the events most relevant to you — filtered and ranked based on your profile and goals.' },
              { n: '4', title: 'Show up to the right rooms', desc: 'Attend with confidence knowing you picked the right events. Build better relationships, faster.' },
            ].map(step => (
              <div key={step.n} className="ea-step">
                <div className="ea-step-num">{step.n}</div>
                <div>
                  <div className="ea-step-title">{step.title}</div>
                  <div className="ea-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ea-cta-section">
        <div className="ea-inner ea-cta-inner">
          <h2 className="ea-cta-h2">Start finding the right events this week.</h2>
          <p className="ea-cta-sub">
            $14.99/month. Cancel anytime. Covers San Antonio, Austin, Dallas, and Houston.
          </p>
          <Link href="/upgrade" className="ea-btn-primary ea-btn-primary--large">
            Get Event Assistant →
          </Link>
          <p className="ea-cta-footer">
            Questions? <a href="mailto:louis@localbusinesscalendars.com" className="ea-cta-link">Email us</a> — we respond same day.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
