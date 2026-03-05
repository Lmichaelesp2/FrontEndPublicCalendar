import { useCity } from '../contexts/CityContext';
import { SEOHead } from './SEOHead';
import { HOME_SEO, CITY_CONFIGS } from '../lib/cities';
import { Link } from 'react-router-dom';

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
            {cityConfig
              ? `${cityConfig.name} Business Calendar`
              : 'We Do The Searching \u00b7 You Do The Networking'}
          </div>

          {cityConfig ? (
            <h1>
              Networking &amp; Business Events
              <br />
              in the <em>{cityConfig.name}</em> area
            </h1>
          ) : (
            <h1>
              Networking &amp; Business Events
              <br className="hero-headline-break" />
              in <em>San Antonio, Austin, Dallas, and Houston</em>
            </h1>
          )}

          {cityConfig && (
            <>
              <p className="hero-sub">
                Get your {cityConfig.name} business events delivered to your inbox every Monday — free. Browse the calendar anytime between emails.
              </p>
              <Link to={`/${cityConfig.slug}/subscribe`} className="btn btn-gold">
                Get the FREE Weekly Email
              </Link>
              <p className="hero-note">No credit card required · Unsubscribe anytime</p>
            </>
          )}

          {!cityConfig && (
            <>
              <p className="hero-subtext">
                Get your city's business events delivered to your inbox every Monday.
              </p>
              <nav className="hero-cities" aria-label="Browse by city">
                <div className="hero-cities-row">
                  {CITY_CONFIGS.map((c) => (
                    <Link key={c.slug} to={`/${c.slug}/subscribe`} className="hero-city-link">
                      <span className="hero-city-name">{c.name}</span>
                      <span className="hero-city-subscribe">Subscribe here</span>
                    </Link>
                  ))}
                </div>
              </nav>
              <p className="hero-subtext-below">
                Browse the calendar anytime between emails. Always free.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
