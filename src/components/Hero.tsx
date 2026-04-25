'use client';

import { useCity } from '../contexts/CityContext';
import { SEOHead } from './SEOHead';
import { HOME_SEO, CITY_CONFIGS } from '../lib/cities';
import Link from 'next/link';

export function Hero() {
  const { selectedCity } = useCity();

  const cityConfig = selectedCity !== 'All'
    ? CITY_CONFIGS.find((c) => c.name === selectedCity) ?? null
    : null;

  const seo = cityConfig
    ? { title: cityConfig.title, description: cityConfig.description }
    : { title: HOME_SEO.title, description: HOME_SEO.description };

  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <SEOHead title={seo.title} description={seo.description} />
      <section className="hero">
        <div className="hero-inner">
          {!cityConfig && (
            <div className="hero-date">TODAY</div>
          )}

          {cityConfig ? (
            <div>
              <div className="hero-badge">
                {cityConfig.name} Business Calendar
              </div>
              <h1>
                Networking &amp; Business Events
                <br />
                in the <em>{cityConfig.name}</em> area
              </h1>
            </div>
          ) : (
            <h1>
              Today's Networking &amp; Business Events
              <br />
              Across <em>Texas</em>
            </h1>
          )}

          {cityConfig && (
            <>
              <p className="hero-subtext">
                Stop missing the events that grow your network and your business.
              </p>
              <div className="hero-category-tags">
                Networking &middot; Chamber &middot; Technology &middot; Real Estate &middot; Small Business &middot; Healthcare &middot; Finance &middot; and more
              </div>
              <div className="hero-cta-group">
                <Link href={`/texas/${cityConfig.slug}/subscribe`} className="btn btn-white">
                  Sign up for your free weekly newsletter
                </Link>
                <p className="hero-subtext-below">Browse the calendar anytime between event newsletters. Always free.</p>
              </div>
            </>
          )}

          {!cityConfig && (
            <>
              <p className="hero-subtext">
                Find business, networking, chamber, technology, real estate, and small business events in San Antonio, Austin, Dallas, and Houston — all in one weekly calendar.
              </p>
              <p className="hero-choose">Choose a city to view the full calendar or create your free account.</p>
              <nav className="hero-cities" aria-label="Browse by city">
                <div className="hero-cities-grid">
                  {CITY_CONFIGS.map((c) => (
                    <div key={c.slug} className="hero-city-card">
                      <span className="hero-city-name">{c.name}</span>
                      <div className="hero-city-btns">
                        <Link href={`/texas/${c.slug}`} className="hero-btn-calendar">
                          Full Calendar
                        </Link>
                        <Link href={`/texas/${c.slug}/subscribe`} className="hero-btn-account">
                          Create Account
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </nav>
            </>
          )}
        </div>
      </section>
    </>
  );
}
