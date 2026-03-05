import { useCity } from '../contexts/CityContext';
import { SEOHead } from './SEOHead';
import { HOME_SEO, CITY_CONFIGS } from '../lib/cities';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export function Hero() {
  const { selectedCity } = useCity();

  const cityConfig = selectedCity !== 'All'
    ? CITY_CONFIGS.find((c) => c.name === selectedCity) ?? null
    : null;

  const seo = cityConfig
    ? { title: cityConfig.title, description: cityConfig.description }
    : { title: HOME_SEO.title, description: HOME_SEO.description };

  return (
    <>
      <SEOHead title={seo.title} description={seo.description} />
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="dot"></span>
            {cityConfig
              ? `${cityConfig.name} Business Calendar`
              : '4 Texas Cities \u00b7 Local Events \u00b7 1 Subscription'}
          </div>

          {cityConfig ? (
            <h1>
              Networking &amp; Business Events
              <br />
              in the <em>{cityConfig.name}</em> area
            </h1>
          ) : (
            <h1>
              Networking &amp; Business Events in
              <br className="hero-headline-break" />
              <em>San Antonio, Austin, Dallas, and Houston</em>
            </h1>
          )}

          {cityConfig && (
            <>
              <p className="hero-sub">
                Never miss an event again. We gather {cityConfig.name}'s best networking and business events in one place — and deliver a curated digest to your inbox every Monday.
              </p>
              <Link to={`/${cityConfig.slug}/subscribe`} className="btn btn-gold">
                Get the FREE Weekly Email
              </Link>
              <p className="hero-note">No credit card required · Unsubscribe anytime</p>
            </>
          )}

          {!cityConfig && (
            <nav className="hero-cities" aria-label="Browse by city">
              <span className="hero-cities-label">Pick your city. Get the weekly email.</span>
              <div className="hero-email-banner">
                <Mail size={18} />
                <span>Every Monday you'll receive the weeks Events free no account needed</span>
              </div>
              <div className="hero-cities-row">
                {CITY_CONFIGS.map((c) => (
                  <Link key={c.slug} to={`/${c.slug}/subscribe`} className="hero-city-link">
                    <span className="hero-city-name">{c.name}</span>
                    <span className="hero-city-subscribe">Subscribe here</span>
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
