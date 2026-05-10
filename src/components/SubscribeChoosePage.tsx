'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { ArrowRight, MapPin, Clock, CheckCircle } from 'lucide-react';

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

      {/* ── How It Works ── */}
      <section className="scp-how-section">
        <div className="scp-how-inner">
          <h2>How It Works</h2>
          <p className="scp-how-intro">
            Local Business Calendars is a free weekly newsletter that brings every business event in your city into one place — so you stop missing the networking mixers, chamber meetings, tech meetups, and real estate gatherings that actually move your career forward.
          </p>
          <div className="scp-how-steps">
            <div className="scp-how-step">
              <div className="scp-how-num">1</div>
              <div>
                <h3>Pick your city and calendar</h3>
                <p>Choose from San Antonio, Austin, Dallas, or Houston. Subscribe to the full city calendar or narrow it down to a specific industry — networking, technology, real estate, chamber of commerce, or small business.</p>
              </div>
            </div>
            <div className="scp-how-step">
              <div className="scp-how-num">2</div>
              <div>
                <h3>Get your Monday morning digest</h3>
                <p>Every Monday at 6 a.m. CT, we send a curated list of that week's best business events in your city. No fluff — just events worth showing up to, organized by date and category.</p>
              </div>
            </div>
            <div className="scp-how-step">
              <div className="scp-how-num">3</div>
              <div>
                <h3>Show up and build relationships</h3>
                <p>Pick the events that fit your schedule, walk in prepared, and let consistency do the work. The professionals who show up regularly are the ones who get referrals, partnerships, and opportunities first.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who This Is For ── */}
      <section className="scp-who-section">
        <div className="scp-who-inner">
          <h2>Who This Is For</h2>
          <p className="scp-who-intro">
            If you work in or around the Texas business community and want to stay connected — this newsletter is for you. Here's who gets the most out of it:
          </p>
          <div className="scp-who-grid">
            {[
              { title: 'Business owners & entrepreneurs', body: 'Stay visible in your local market by showing up to the right chambers, mixers, and industry events in San Antonio, Austin, Dallas, or Houston.' },
              { title: 'Sales & business development professionals', body: 'Never miss a networking event where your next client might be in the room. Our weekly digest keeps your pipeline opportunities in sight.' },
              { title: 'Commercial real estate professionals', body: 'Track ULI events, CCIM meetings, real estate roundtables, and investment gatherings across all four Texas markets.' },
              { title: "Tech founders & startup community members", body: "Stay plugged into the Austin startup scene, San Antonio tech ecosystem, Dallas innovation community, and Houston emerging tech sector." },
              { title: 'Chamber & association members', body: 'Get a consolidated view of every chamber of commerce event, ribbon cutting, and member mixer across your city — all in one Monday email.' },
              { title: 'Small business owners', body: 'Find SBDC workshops, co-working events, small business meetups, and local business development opportunities without spending hours searching.' },
            ].map((item) => (
              <div key={item.title} className="scp-who-card">
                <CheckCircle size={16} className="scp-who-icon" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscribe FAQ ── */}
      <section className="scp-faq-section">
        <div className="scp-faq-inner">
          <h2>Frequently Asked Questions</h2>
          <div className="scp-faq-list">
            {[
              {
                q: 'Is the newsletter really free?',
                a: 'Yes — completely free. No credit card, no trial period, no catch. Browse the full calendar and receive the weekly digest at no cost.',
              },
              {
                q: 'How do I choose between the full city calendar and a sub-calendar?',
                a: 'The full city calendar (e.g. San Antonio Business Calendar) covers all industries — networking, technology, real estate, chamber, and small business events in one digest. The sub-calendars (e.g. San Antonio Technology Calendar) are narrower and ideal if you only want events from one specific industry.',
              },
              {
                q: 'Can I subscribe to more than one city or calendar?',
                a: 'Yes. You can subscribe to multiple cities and multiple industry calendars. Many professionals subscribe to both the full city calendar and one or two specific sub-calendars to stay active across their networks.',
              },
              {
                q: 'When does the newsletter go out?',
                a: 'Every Monday morning at 6 a.m. Central Time. You'll have the full week's events in your inbox before your first meeting of the week.',
              },
              {
                q: 'What cities are covered right now?',
                a: 'We currently publish weekly newsletters for San Antonio, Austin, Dallas, and Houston, Texas. We're actively expanding to additional cities — San Diego, Phoenix, Denver, Nashville, Atlanta, and Chicago are next.',
              },
              {
                q: 'How do you find all these events?',
                a: 'We monitor over 800 local organizations — chambers of commerce, trade associations, Meetup groups, Eventbrite organizers, and individual business hosts — across all four Texas cities and consolidate their public events into one calendar each week.',
              },
            ].map((item) => (
              <div key={item.q} className="scp-faq-item">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
