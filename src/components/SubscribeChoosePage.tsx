'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

const CITIES = [
  {
    slug: 'san-antonio',
    name: 'San Antonio',
    tagline: 'Chamber events, business mixers & professional networking',
  },
  {
    slug: 'austin',
    name: 'Austin',
    tagline: 'Tech meetups, startup events & professional networking',
  },
  {
    slug: 'dallas',
    name: 'Dallas',
    tagline: 'DFW networking, real estate, finance & business events',
  },
  {
    slug: 'houston',
    name: 'Houston',
    tagline: 'Energy sector, chamber, real estate & professional networking',
  },
];

const SUB_CALENDARS = [
  { slug: 'networking',     label: 'Networking' },
  { slug: 'chamber',        label: 'Chamber' },
  { slug: 'technology',     label: 'Technology' },
  { slug: 'real-estate',    label: 'Real Estate' },
  { slug: 'small-business', label: 'Small Business' },
];

const COMING_SOON = [
  'San Diego, CA',
  'Phoenix, AZ',
  'Denver, CO',
  'Nashville, TN',
  'Atlanta, GA',
  'Chicago, IL',
];

export function SubscribeChoosePage() {
  return (
    <div>
      <SEOHead
        title="Choose Your City — Local Business Calendars"
        description="Select your city to subscribe to free weekly business and networking event newsletters in San Antonio, Austin, Dallas, and Houston, Texas."
      />
      <Navigation />

      {/* ── Hero ── */}
      <div className="scp-hero">
        <div className="scp-hero-inner">
          <p className="scp-overline">
            <span className="scp-overline-dot" />
            FREE WEEKLY NEWSLETTER
          </p>
          <h1>Choose Your City</h1>
          <p className="scp-hero-sub">
            Subscribe to your city's full calendar or pick a specific industry.
            Every Monday morning we deliver the week's best business events straight to your inbox.
          </p>
          <p className="scp-trust">Free forever · No credit card · Unsubscribe anytime</p>
        </div>
      </div>

      {/* ── City Cards ── */}
      <section className="scp-cities">
        <div className="scp-cities-inner">
          {CITIES.map((city) => (
            <div key={city.slug} className="scp-city-card">

              {/* City header */}
              <div className="scp-city-header">
                <div className="scp-city-location">
                  <MapPin size={12} />
                  Texas
                </div>
                <h2 className="scp-city-name">{city.name}</h2>
                <p className="scp-city-tagline">{city.tagline}</p>
              </div>

              {/* All-events CTA */}
              <Link
                href={`/texas/${city.slug}/subscribe`}
                className="scp-city-main-cta"
              >
                <span>
                  <strong>{city.name} Business Calendar</strong>
                  <span className="scp-cta-sub">All industries · Weekly digest</span>
                </span>
                <ArrowRight size={16} className="scp-cta-arrow" />
              </Link>

              {/* Divider */}
              <div className="scp-divider">
                <span>or subscribe to a specific calendar</span>
              </div>

              {/* Sub-calendar links */}
              <div className="scp-sub-list">
                {SUB_CALENDARS.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/texas/${city.slug}/${sub.slug}/subscribe`}
                    className="scp-sub-link"
                  >
                    <span className="scp-sub-label">{city.name} {sub.label}</span>
                    <ArrowRight size={13} className="scp-sub-arrow" />
                  </Link>
                ))}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── Coming Soon ── */}
      <section className="scp-coming-soon">
        <div className="scp-coming-inner">
          <div className="scp-coming-header">
            <Clock size={16} className="scp-coming-icon" />
            <span>More Cities Coming Soon</span>
          </div>
          <p className="scp-coming-sub">
            We're expanding across the country. Here's what's on deck.
          </p>
          <div className="scp-coming-grid">
            {COMING_SOON.map((city) => (
              <div key={city} className="scp-coming-city">
                <MapPin size={12} />
                {city}
              </div>
            ))}
          </div>
          <p className="scp-coming-note">
            Want your city added? <a href="/contact" className="scp-coming-link">Let us know →</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
