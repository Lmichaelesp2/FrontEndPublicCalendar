'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import {
  Users, Mail, MapPin, TrendingUp, Award, Megaphone,
  Building2, Briefcase, ArrowRight, CheckCircle
} from 'lucide-react';

// ─── Who benefits from sponsoring ────────────────────────────────────────────

const WHO_BENEFITS = [
  {
    icon: Building2,
    title: 'Local Businesses',
    desc: 'Banks, insurance agencies, coworking spaces, commercial real estate firms, and any business whose clients are other businesses. Your audience is already here — active, local, and engaged.',
  },
  {
    icon: Briefcase,
    title: 'Professional Services',
    desc: 'Attorneys, CPAs, consultants, financial advisors, HR firms, and staffing agencies. The people reading this newsletter are decision-makers who regularly hire professional services.',
  },
  {
    icon: TrendingUp,
    title: 'Event Venues & Hosts',
    desc: 'Hotels, conference centers, restaurants, and clubs that host business events. Be front-of-mind when planners and organizers are looking for the right space.',
  },
  {
    icon: Megaphone,
    title: 'Startups & Tech Companies',
    desc: 'Companies looking to build brand recognition inside the local professional community before expanding. Sponsoring a sub-calendar like Technology or Networking puts you directly in front of early adopters.',
  },
  {
    icon: Award,
    title: 'Chambers & Associations',
    desc: 'Trade associations, chambers of commerce, and professional organizations looking to grow membership. Your message goes directly to the people most likely to join.',
  },
  {
    icon: Users,
    title: 'Recruiters & Staffing Firms',
    desc: 'Companies that need to build name recognition with local professionals in specific industries. Networking, Technology, and Small Business sub-calendars give you laser-focused reach.',
  },
];

// ─── What sponsors get ────────────────────────────────────────────────────────

const WHAT_YOU_GET = [
  'Exclusive sponsor placement in the weekly newsletter — one sponsor per calendar, no competition',
  'Your name and message in front of subscribers who opted in specifically for that city or industry',
  'Brand presence on the live calendar page at localbusinesscalendars.com (sub-calendar sponsors)',
  'A short sponsor intro written to fit naturally alongside the content — not an intrusive ad',
  'Direct association with a trusted local resource professionals rely on every week',
  'Option to sponsor a single city-wide calendar or a specific sub-calendar (Technology, Networking, Real Estate, Chamber, Small Business)',
];

// ─── Calendars available ──────────────────────────────────────────────────────

const CALENDARS = [
  { city: 'San Antonio',  subs: ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'] },
  { city: 'Austin',       subs: ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'] },
  { city: 'Dallas',       subs: ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'] },
  { city: 'Houston',      subs: ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'] },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SponsorPage() {
  return (
    <div className="sponsor-page">
      <SEOHead
        title="Sponsor a Local Business Calendar — Reach Texas Professionals Every Week"
        description="Become a founding sponsor of Local Business Calendars. Reach thousands of active business professionals in San Antonio, Austin, Dallas, and Houston through our weekly newsletter."
      />
      <Navigation />

      {/* ── Hero ── */}
      <div className="sponsor-hero">
        <div className="sponsor-hero-inner">
          <div className="sponsor-hero-badge">Founding Sponsorship</div>
          <h1>Reach Local Business Professionals Every Week</h1>
          <p>
            Local Business Calendars delivers a free weekly newsletter to thousands of professionals
            across Texas — people who actively attend networking events, chamber meetings, and industry
            gatherings. A sponsorship puts your brand directly in front of that audience, every Monday morning.
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
            <span className="sponsor-stat-label">Texas Cities</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">20+</span>
            <span className="sponsor-stat-label">Industry-Specific Calendars</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">Weekly</span>
            <span className="sponsor-stat-label">Newsletter Delivery</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">1</span>
            <span className="sponsor-stat-label">Sponsor Per Calendar</span>
          </div>
        </div>
      </div>

      {/* ── Who benefits ── */}
      <div className="sponsor-section sponsor-section-alt">
        <div className="sponsor-section-inner">
          <div className="sponsor-section-label">Who Should Sponsor</div>
          <h2>Built for Businesses That Serve Other Businesses</h2>
          <p className="sponsor-section-desc">
            Our subscribers are active members of the local business community — they show up, they make buying decisions,
            and they talk to other professionals. If your business depends on local visibility and trust, this audience is for you.
          </p>
          <div className="sponsor-who-grid">
            {WHO_BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="sponsor-who-card">
                <div className="sponsor-who-icon"><Icon size={24} strokeWidth={1.6} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── What you get ── */}
      <div className="sponsor-section">
        <div className="sponsor-section-inner">
          <div className="sponsor-section-label">What's Included</div>
          <h2>Exclusive, Low-Noise Placement</h2>
          <p className="sponsor-section-desc">
            Each calendar has one sponsor slot — not a rotating ad unit, not a banner shared with three other brands.
            One business, one calendar, one audience. That exclusivity is the point.
          </p>
          <div className="sponsor-benefits-list">
            {WHAT_YOU_GET.map((item, i) => (
              <div key={i} className="sponsor-benefit-row">
                <CheckCircle size={18} className="sponsor-benefit-check" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Calendars available ── */}
      <div className="sponsor-section sponsor-section-alt">
        <div className="sponsor-section-inner">
          <div className="sponsor-section-label">Available Calendars</div>
          <h2>Sponsor the Calendar That Fits Your Audience</h2>
          <p className="sponsor-section-desc">
            Each city has a city-wide calendar and five industry-specific sub-calendars. You can sponsor
            the one that best fits your target audience, or reach out to discuss multi-calendar options.
          </p>
          <div className="sponsor-cal-grid">
            {CALENDARS.map(({ city, subs }) => (
              <div key={city} className="sponsor-cal-card">
                <div className="sponsor-cal-city">
                  <MapPin size={14} />
                  {city}
                </div>
                <div className="sponsor-cal-citywide">City-Wide Calendar</div>
                <div className="sponsor-cal-subs">
                  {subs.map(s => (
                    <span key={s} className="sponsor-cal-tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why now / founding sponsor ── */}
      <div className="sponsor-section">
        <div className="sponsor-section-inner sponsor-founding-inner">
          <div className="sponsor-founding-text">
            <div className="sponsor-section-label">Why Now</div>
            <h2>Be a Founding Sponsor</h2>
            <p>
              Local Business Calendars is growing. Founding sponsors get in early — before rates change,
              before slots fill, and while your brand gets to be the name professionals associate with
              their go-to local resource. This is an opportunity to build real recognition inside a
              community that values consistency and local commitment.
            </p>
            <p>
              There's no long-term contract required to get started. Reach out and we'll have a
              straightforward conversation about fit, audience, and what a sponsorship would look like for your business.
            </p>
          </div>
          <div className="sponsor-founding-visual">
            <div className="sponsor-founding-card">
              <div className="sponsor-founding-card-label">Founding Sponsor Slot</div>
              <div className="sponsor-founding-card-name">Your Business Here</div>
              <div className="sponsor-founding-card-desc">
                This spot reaches active local professionals in your city every Monday morning.
              </div>
              <div className="sponsor-founding-card-cta">One sponsor per calendar — exclusive placement</div>
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
