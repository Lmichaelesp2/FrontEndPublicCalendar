'use client';

import { useCity } from '../contexts/CityContext';
import { SEOHead } from './SEOHead';
import { HOME_SEO, CITY_CONFIGS } from '../lib/cities';
import Link from 'next/link';



function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntil = day === 0 ? 1 : 8 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntil);
  return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function Hero({ cityCounts }: { cityCounts?: Record<string, number> } = {}) {
  const { selectedCity } = useCity();

  const cityConfig = selectedCity !== 'All'
    ? CITY_CONFIGS.find((c) => c.name === selectedCity) ?? null
    : null;

  const seo = cityConfig
    ? { title: cityConfig.title, description: cityConfig.description }
    : { title: HOME_SEO.title, description: HOME_SEO.description };

  const CITY_EVENT_COUNTS: Record<string, number> = cityCounts ?? {};
  const TOTAL_EVENTS = Object.values(CITY_EVENT_COUNTS).reduce((a, b) => a + b, 0);

  const nextMonday  = getNextMonday();
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
                Find the events where {cityConfig.name} business{' '}
                <em>actually</em> happens.
              </h1>
            ) : (
              <h1>
                Find the events where Texas business{' '}
                <em>actually</em> happens.
              </h1>
            )}

            <p className="hero-sub">
              {cityConfig
                ? cityConfig.heroSub
                : 'Networking mixers, chamber events, real-estate gatherings, tech meetups — browse the full calendar free and get every event delivered to your inbox every Monday.'}
            </p>

            <div className="hero-cta-group">
              <Link
                href={cityConfig ? `/texas/${cityConfig.slug}/subscribe` : '/subscribe'}
                className="btn btn-gold"
              >
                Subscribe Free — Pick Your City
              </Link>
              {cityConfig && (
                <Link
                  href={`/texas/${cityConfig.slug}`}
                  className="btn btn-ghost"
                >
                  Browse {cityConfig.name} &rarr;
                </Link>
              )}
            </div>

            <p className="hero-trust">
              Free forever&nbsp;&middot;&nbsp;No credit card
            </p>
          </div>

          {/* ── Right column ── */}
          <div className="hero-right">
            <div className="hero-city-panel">
              <div className="hero-city-panel-header">
                {cityConfig ? 'EVENT TYPES' : 'BROWSE BY CITY'}
              </div>

              {!cityConfig ? (
                <ul className="hero-city-panel-list">
                  {CITY_CONFIGS.map((c) => (
                    <li key={c.slug} className="hero-city-panel-row">
                      <Link href={`/texas/${c.slug}`} className="hero-city-panel-link">
                        <span className="hero-city-panel-name">{c.name}</span>
                        <span className="hero-city-panel-arrow" aria-hidden="true">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                  <li className="hero-city-panel-row hero-city-panel-more">
                    <span className="hero-city-panel-tag">More cities coming soon</span>
                  </li>
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
          <span>NEXT NEWSLETTER: MONDAY, {nextMonday.toUpperCase()} &middot; 6:00 A.M. CT</span>
          <span className="hero-strip-divider">|</span>
          <span>EVENT SOURCES MONITORED: 800+</span>
        </div>
      </section>
    </>
  );
}
