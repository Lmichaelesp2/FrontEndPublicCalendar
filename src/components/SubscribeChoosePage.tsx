'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { ArrowRight, MapPin } from 'lucide-react';

const CITIES = [
  {
    slug: 'san-antonio',
    name: 'San Antonio',
    tagline: 'Chamber events, business mixers & professional networking',
    categories: ['Networking', 'Chamber', 'Technology', 'Real Estate', 'Small Business'],
  },
  {
    slug: 'austin',
    name: 'Austin',
    tagline: 'Tech meetups, startup events & professional networking',
    categories: ['Networking', 'Chamber', 'Technology', 'Real Estate', 'Small Business'],
  },
  {
    slug: 'dallas',
    name: 'Dallas',
    tagline: 'DFW networking, real estate, finance & business events',
    categories: ['Networking', 'Chamber', 'Technology', 'Real Estate', 'Small Business'],
  },
  {
    slug: 'houston',
    name: 'Houston',
    tagline: 'Energy sector, chamber, real estate & professional networking',
    categories: ['Networking', 'Chamber', 'Technology', 'Real Estate', 'Small Business'],
  },
];

export function SubscribeChoosePage() {
  return (
    <div>
      <SEOHead
        title="Choose Your City — Local Business Calendars"
        description="Select your city to subscribe to free weekly business and networking event newsletters in San Antonio, Austin, Dallas, and Houston, Texas."
      />
      <Navigation />

      <div className="scp-hero">
        <div className="scp-hero-inner">
          <p className="scp-overline">
            <span className="scp-overline-dot" />
            FREE WEEKLY NEWSLETTER
          </p>
          <h1>Choose Your City</h1>
          <p className="scp-hero-sub">
            Pick your city below and we'll deliver this week's best business and networking events straight to your inbox every Monday morning.
          </p>
          <p className="scp-trust">Free forever · No credit card · Unsubscribe anytime</p>
        </div>
      </div>

      <section className="scp-cities">
        <div className="scp-cities-inner">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/texas/${city.slug}/subscribe`}
              className="scp-city-card"
            >
              <div className="scp-city-top">
                <div className="scp-city-location">
                  <MapPin size={13} />
                  Texas
                </div>
                <h2 className="scp-city-name">{city.name}</h2>
                <p className="scp-city-tagline">{city.tagline}</p>
              </div>
              <div className="scp-city-cats">
                {city.categories.map((cat) => (
                  <span key={cat} className="scp-cat-tag">{cat}</span>
                ))}
              </div>
              <div className="scp-city-cta">
                Subscribe Free <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
