'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Mail, ArrowRight } from 'lucide-react';

// ─── Who benefits from sponsoring ────────────────────────────────────────────

const WHO_BENEFITS = [
  {
    icon: 'ti-building',
    title: 'Local Businesses',
    desc: 'Banks, insurance agencies, coworking spaces, commercial real estate firms, and any business whose clients are other businesses. Your audience is already here — active, local, and engaged.',
  },
  {
    icon: 'ti-briefcase',
    title: 'Professional Services',
    desc: 'Attorneys, CPAs, consultants, financial advisors, HR firms, and staffing agencies. The people reading this newsletter are decision-makers who regularly hire professional services.',
  },
  {
    icon: 'ti-trending-up',
    title: 'Event Venues & Hosts',
    desc: 'Hotels, conference centers, restaurants, and clubs that host business events. Be front-of-mind when planners and organizers are looking for the right space.',
  },
  {
    icon: 'ti-speakerphone',
    title: 'Startups & Tech Companies',
    desc: 'Companies looking to build brand recognition across the Texas professional community before expanding city by city. One sponsorship puts you in front of early adopters in all four markets at once.',
  },
  {
    icon: 'ti-award',
    title: 'Chambers & Associations',
    desc: 'Trade associations, chambers of commerce, and professional organizations looking to grow membership across multiple cities. Your message goes directly to the people most likely to join, in every city you serve.',
  },
  {
    icon: 'ti-users',
    title: 'Recruiters & Staffing Firms',
    desc: 'Companies that need to build name recognition with local professionals across multiple Texas markets at once, without running four separate campaigns.',
  },
];

// ─── What sponsors get ────────────────────────────────────────────────────────

const WHAT_YOU_GET = [
  'Your brand featured across all four Texas calendars at once — San Antonio, Austin, Dallas, and Houston — not just one market',
  'One of only four founding sponsor spots on the entire network — exclusive, not shared with competitors',
  'Placement in every city\'s weekly newsletter and on every live calendar page across the network',
  'A short sponsor intro written to fit naturally alongside the content — not an intrusive ad',
  'Direct association with a trusted local resource thousands of Texas professionals rely on every week',
  'If an all-four-cities spot isn\'t the right fit, single-city sponsorships are available too — reach out to discuss',
];

// ─── Calendars available ──────────────────────────────────────────────────────

const CALENDARS = [
  { city: 'San Antonio' },
  { city: 'Austin' },
  { city: 'Dallas' },
  { city: 'Houston' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SponsorPage() {
  return (
    <div className="sponsor-page">
      <SEOHead
        title="Become a Founding Sponsor — Local Business Calendars"
        description="Only four founding sponsor spots are available, and each one appears across all four Texas markets — San Antonio, Austin, Dallas, and Houston — in every weekly newsletter and on every calendar page."
      />
      <Navigation />

      {/* ── Hero ── */}
      <div className="sponsor-hero">
        <div className="sponsor-hero-inner">
          <div className="sponsor-hero-badge">Founding Sponsorship — 4 Spots Available</div>
          <h1>If Your Customers Are in San Antonio, Austin, Dallas, or Houston — Show Them You Support the Texas Business Community</h1>
          <p>
            We're selecting four founding sponsors for Local Business Calendars — and each one is featured
            across all four Texas markets at once. One sponsorship, four cities, every weekly newsletter,
            every calendar page. It's the simplest way to put your brand in front of thousands of active
            Texas professionals, no matter which of our cities your business serves.
          </p>
          <a href="mailto:sponsors@localbusinesscalendars.com?subject=Sponsorship Inquiry" className="sponsor-hero-cta">
            Get in Touch <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* ── Who reads this ── */}
      <div className="sponsor-audience-bar">
        <div className="sponsor-audience-inner">
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">4</span>
            <span className="sponsor-stat-label">Founding Sponsor Spots</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">4</span>
            <span className="sponsor-stat-label">Texas Cities, Every Spot</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">Weekly</span>
            <span className="sponsor-stat-label">Newsletter Delivery</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">1</span>
            <span className="sponsor-stat-label">Network, Not Just One City</span>
          </div>
        </div>
      </div>

      {/* ── Who benefits ── */}
      <div className="sponsor-section sponsor-section-alt">
        <div className="sponsor-section-inner">
          <div className="sponsor-section-label">Who Should Sponsor</div>
          <h2>Built for Businesses That Serve Texas's Four Largest Cities, Not Just One</h2>
          <p className="sponsor-section-desc">
            Our subscribers are active members of the local business community in every market we serve — they show up,
            they make buying decisions, and they talk to other professionals. If your customers are spread across San Antonio,
            Austin, Dallas, and Houston, a single network sponsorship puts your brand in front of all of them at once.
          </p>
          <div className="sponsor-who-grid">
            {WHO_BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="sponsor-who-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <i className={`ti ${icon}`} style={{ position: 'absolute', bottom: '-4px', right: '6px', fontSize: '2.25rem', color: 'var(--fg-1)', opacity: 0.07, pointerEvents: 'none' }} aria-hidden="true" />
                <h3 style={{ position: 'relative' }}>{title}</h3>
                <p style={{ position: 'relative' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── What you get ── */}
      <div className="sponsor-section">
        <div className="sponsor-section-inner">
          <div className="sponsor-section-label">What's Included</div>
          <h2>One Sponsorship, Featured in Every City</h2>
          <p className="sponsor-section-desc">
            There are only four founding sponsor spots, and each one appears across the entire network —
            not a rotating ad unit, not a banner shared with competitors. Four businesses, four cities each,
            one audience of thousands. That exclusivity is the point.
          </p>
          <div className="sponsor-benefits-list">
            {WHAT_YOU_GET.map((item, i) => (
              <div key={i} className="sponsor-benefit-row">
                <i className="ti ti-check sponsor-benefit-check" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Where your brand shows up ── */}
      <div className="sponsor-section sponsor-section-alt">
        <div className="sponsor-section-inner">
          <div className="sponsor-section-label">Where Your Brand Shows Up</div>
          <h2>One Spot, All Four Cities</h2>
          <p className="sponsor-section-desc">
            A founding sponsorship isn't tied to a single market — your brand appears on every city calendar
            and in every city's weekly newsletter, the same way, every time.
          </p>
          <div className="sponsor-cal-grid">
            {CALENDARS.map(({ city }) => (
              <div key={city} className="sponsor-cal-card">
                <div className="sponsor-cal-city">
                  <i className="ti ti-map-pin" style={{ fontSize: '0.85rem' }} aria-hidden="true" />
                  {city}
                </div>
                <div className="sponsor-cal-citywide">Business Calendar &amp; Weekly Newsletter</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ── What sponsorship looks like ── */}
      <div className="sponsor-section">
        <div className="sponsor-section-inner sponsor-mockup-inner">
          <div className="sponsor-section-label">What It Looks Like</div>
          <h2>See How Your Brand Appears Across the Network</h2>
          <p className="sponsor-section-desc">
            Your brand appears at the top of the weekly newsletter and on the live calendar page in every city — the same placement, the same recognition, four times over.
          </p>

          <div className="sponsor-mockup-grid">
            {CALENDARS.map(({ city }) => (
              <div key={city} className="sponsor-mockup-card">
                <div className="sponsor-mockup-city-label">{city}</div>
                <div className="sponsor-mockup-slot">
                  <div className="sponsor-mockup-slot-tag">FOUNDING SPONSOR</div>
                  <div className="sponsor-mockup-calendar-name">{city} Business Calendar</div>
                  <div className="sponsor-mockup-brand">Your Brand Here</div>
                </div>
              </div>
            ))}
          </div>
          <p className="sponsor-mockup-note">
            Only four founding sponsor spots exist, and each one appears in all four cities — not split up by market.
          </p>
        </div>
      </div>

      {/* ── Why now / founding sponsor ── */}
      <div className="sponsor-section">
        <div className="sponsor-section-inner sponsor-founding-inner">
          <div className="sponsor-founding-text">
            <div className="sponsor-section-label">Why Now</div>
            <h2>Be One of Four Founding Sponsors</h2>
            <p>
              Local Business Calendars is growing across Texas. We're only taking four founding sponsors —
              once those four spots are filled, that's it. Get in early and your brand becomes the name
              thousands of professionals in San Antonio, Austin, Dallas, and Houston associate with their
              go-to local resource, in every one of those cities at once.
            </p>
            <p>
              There's no long-term contract required to get started. Reach out and we'll have a
              straightforward conversation about fit and what a network sponsorship would look like for your business.
              If an all-four-cities spot isn't the right fit, we're also happy to talk about sponsoring a single city.
            </p>
          </div>
          <div className="sponsor-founding-visual">
            <div className="sponsor-founding-card">
              <div className="sponsor-founding-card-label">Founding Sponsor Slot</div>
              <div className="sponsor-founding-card-name">Your Business Here</div>
              <div className="sponsor-founding-card-desc">
                This spot reaches active local professionals in all four Texas cities, every Monday morning.
              </div>
              <div className="sponsor-founding-card-cta">Only 4 spots — exclusive, network-wide placement</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact CTA ── */}
      <div className="sponsor-cta-section">
        <div className="sponsor-cta-inner">
          <h2>Ready to Talk?</h2>
          <p>
            No forms, no sales funnel. Just reach out directly and we'll have a real conversation
            about whether this is a good fit for your business.
          </p>
          <div className="sponsor-cta-contacts">
            <a href="mailto:sponsors@localbusinesscalendars.com?subject=Sponsorship Inquiry" className="sponsor-cta-email">
              <Mail size={18} />
              sponsors@localbusinesscalendars.com
            </a>
          </div>
          <p className="sponsor-cta-note">
            You can also reach us through the <Link href="/contact" className="sponsor-link">Contact page</Link> and select "Sponsorship Inquiry" from the dropdown.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
