'use client';

import { useCity } from '../contexts/CityContext';
import { SEOHead } from './SEOHead';
import { HOME_SEO, CITY_CONFIGS } from '../lib/cities';
import Link from 'next/link';

// Event counts per city — update weekly or wire to live data
const CITY_EVENT_COUNTS: Record<string, number> = {
  'San Antonio': 14,
  'Austin': 18,
  'Dallas': 9,
  'Houston': 6,
};

const TOTAL_EVENTS = Object.values(CITY_EVENT_COUNTS).reduce((a, b) => a + b, 0);

function getWeekRange(): string {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diffToMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`;
}

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntil = day === 0 ? 1 : 8 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntil);
  return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function Hero() {
  const { selectedCity } = useCity();

  const cityConfig = selectedCity !== 'All'
    ? CITY_CONFIGS.find((c) => c.name === selectedCity) ?? null
    : null;

  const seo = cityConfig
    ? { title: cityConfig.title, description: cityConfig.description }
    : { title: HOME_SEO.title, description: HOME_SEO.description };

  const weekRange = getWeekRange();
  const nextMonday = getNextMonday();
  const cityCount = cityConfig ? (CITY_EVENT_COUNTS[cityConfig.name] ?? 0) : TOTAL_EVENTS;
  const cityLabel = cityConfig ? cityConfig.name.toUpperCase() : 'TEXAS';

  return (
    <>
      <SEOHead title={seo.title} description={seo.description} />

      <section className="hero">
        <div className="hero-inner">

          {/* ── Left column ── */}
          <div className="hero-left">

            <div className="hero-badge">
              <span className="hero-badge-dot" />
              THIS WEEK IN {cityLabel} &middot; {cityCount} EVENTS
            </div>

            {cityConfig ? (
              <h1>
                Find the rooms where {cityConfig.name} business{' '}
                <em>actually</em> happens.
              </h1>
            ) : (
              <h1>
                Find the rooms where business{' '}
                <em>actually</em> happens.
              </h1>
            )}

            <p className="hero-sub">
              {cityConfig
                ? cityConfig.heroSub
                : 'Networking mixers, chamber events, real-estate gatherings, tech meetups — every public business event in your city, organized into one calendar and one Monday email.'}
            </p>

            <div className="hero-cta-group">
              <Link
                href={cityConfig ? `/texas/${cityConfig.slug}/subscribe` : '/subscribe'}
                className="btn btn-gold"
              >
                Sign Up Free — See This Week's Events
              </Link>
              <Link
                href={cityConfig ? `/texas/${cityConfig.slug}` : '/texas'}
                className="btn btn-ghost"
              >
                Browse {cityConfig ? cityConfig.name : 'Texas'} &rarr;
              </Link>
            </div>

            <p className="hero-trust">
              Free forever&nbsp;&middot;&nbsp;Delivered every Monday morning&nbsp;&middot;&nbsp;No credit card
            </p>
          </div>

          {/* ── Right column ── */}
          <div className="hero-right">
            <div className="hero-city-panel">
              <div className="hero-city-panel-header">
                {cityConfig ? 'EVENT TYPES' : 'THIS WEEK, BY CITY'}
              </div>

              {!cityConfig ? (
                <ul className="hero-city-panel-list">
                  {CITY_CONFIGS.map((c) => (
                    <li key={c.slug} className="hero-city-panel-row">
                      <Link href={`/texas/${c.slug}`} className="hero-city-panel-link">
                        <span className="hero-city-panel-name">{c.name}</span>
                        <span className="hero-city-panel-count">
                          {CITY_EVENT_COUNTS[c.name] ?? 0} events
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="hero-city-panel-list">
                  {['Networking', 'Chamber', 'Technology', 'Real Estate', 'Small Business', 'Healthcare', 'and many more'].map((tag) => (
                    <li key={tag} className="hero-city-panel-row">
                      <span className="hero-city-panel-tag">{tag}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>

        {/* ── Bottom editorial strip ── */}
        <div className="hero-strip">
          <span>VOL. 3 &middot; {weekRange}</span>
          <span className="hero-strip-divider">|</span>
          <span>NEXT NEWSLETTER: MONDAY, {nextMonday.toUpperCase()} &middot; 6:00 A.M. CT</span>
          <span className="hero-strip-divider">|</span>
          <span>TRACKED ORGANIZATIONS: 800+</span>
        </div>
      </section>
    </>
  );
}
