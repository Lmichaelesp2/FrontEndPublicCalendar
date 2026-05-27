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
          <div className="sponsor-hero-badge">One Sponsorship · Two Properties</div>
          <h1>Reach Local Business Professionals Every Week</h1>
          <p>
            A single sponsorship covers both <strong>Local Business Calendars</strong> and <strong>Local Business Organizations</strong> — in your city, in your category. Your brand reaches the same professionals across both platforms every week: the calendar they browse for events and the directory they use to find organizations.
          </p>
          <a href="mailto:sponsors@localbusinesscalendars.com?subject=Sponsorship Inquiry" className="sponsor-hero-cta">
            Get in Touch <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="sponsor-audience-bar">
        <div className="sponsor-audience-inner">
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">2</span>
            <span className="sponsor-stat-label">Properties Covered</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">4</span>
            <span className="sponsor-stat-label">Texas Cities</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">16</span>
            <span className="sponsor-stat-label">Total Slots Available</span>
          </div>
          <div className="sponsor-audience-divider" />
          <div className="sponsor-audience-stat">
            <span className="sponsor-stat-number">1</span>
            <span className="sponsor-stat-label">Sponsor Per Slot</span>
          </div>
        </div>
      </div>

      {/* ── One sponsorship two properties callout ── */}
      <div className="sponsor-section">
        <div className="sponsor-section-inner">
          <div className="sponsor-section-label">How It Works</div>
          <h2>One Sponsorship. Two Properties. One Audience.</h2>
          <p className="sponsor-section-desc">
            Each sponsorship slot is defined by a city and a category. The <strong>San Antonio Technology</strong> sponsor, for example, is featured on the San Antonio events calendar <em>and</em> the San Antonio technology organizations directory — giving you consistent, ongoing visibility with the exact audience you're trying to reach. You don't have to buy both separately.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '2rem' }}>
            {[
              { title: 'Local Business Calendars', desc: 'Featured in your city\'s weekly events newsletter and on the live calendar page under your category.' },
              { title: 'Local Business Organizations', desc: 'Featured in your city\'s organization directory under your category — browsed by professionals researching who\'s active in the market.' },
              { title: 'Weekly Email Newsletter', desc: 'Included in the Monday events digest sent to subscribers in your city and category.' },
              { title: 'Consistent Placement', desc: 'No rotation — your slot is yours for the duration of your sponsorship.' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.4rem' }}>{title}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* City × Category grid */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: '0.75rem' }}>Available Slots — Texas</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)' }}>
                    <th style={{ textAlign: 'left', padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>Category</th>
                    {['San Antonio', 'Houston', 'Dallas', 'Austin'].map(c => (
                      <th key={c} style={{ textAlign: 'center', padding: '0.6rem 0.75rem', fontWeight: 700, color: 'var(--text-3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Chamber & Networking', 'Technology', 'Real Estate', 'Small Business'].map((cat, i) => (
                    <tr key={cat} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                      <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--text-1)', borderBottom: '1px solid var(--border)' }}>{cat}</td>
                      {['San Antonio', 'Houston', 'Dallas', 'Austin'].map(city => (
                        <td key={city} style={{ textAlign: 'center', padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c2410c', background: '#fff7ed', padding: '2px 8px', borderRadius: '4px' }}>Open</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.75rem', lineHeight: 1.6 }}>
              16 total slots across Texas. Sponsors don't rotate — you own your slot for the duration of your sponsorship. Cross-city packages available.
            </p>
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


      {/* ── What sponsorship looks like ── */}
      <div className="sponsor-section">
        <div className="sponsor-section-inner sponsor-mockup-inner">
          <div className="sponsor-section-label">What It Looks Like</div>
          <h2>See How Your Brand Appears Across the Network</h2>
          <p className="sponsor-section-desc">
            Each city calendar has one exclusive sponsor slot. Your brand appears at the top of the weekly newsletter and on the live calendar page — the only sponsor your audience sees, every week.
          </p>

          <div className="sponsor-mockup-grid">
            {CALENDARS.map(({ city, subs }) => (
              <div key={city} className="sponsor-mockup-card">
                <div className="sponsor-mockup-city-label">{city}</div>
                <div className="sponsor-mockup-slot">
                  <div className="sponsor-mockup-slot-tag">CITY CALENDAR SPONSOR</div>
                  <div className="sponsor-mockup-calendar-name">{city} Business Calendar</div>
                  <div className="sponsor-mockup-brand">Your Brand Here</div>
                </div>
                <div className="sponsor-mockup-subs">
                  {subs.map(s => (
                    <div key={s} className="sponsor-mockup-sub-row">
                      <span className="sponsor-mockup-sub-cat">{s}</span>
                      <span className="sponsor-mockup-sub-brand">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="sponsor-mockup-note">
            City calendar sponsors receive the strongest placement. Sub-calendar sponsors appear within their specific industry newsletter — focused reach for a focused audience.
          </p>
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
