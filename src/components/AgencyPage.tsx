'use client';

import Link from 'next/link';

export function AgencyPage() {
  return (
    <main className="agency-page">

      {/* ── Hero ── */}
      <section className="agency-hero">
        <div className="agency-hero-inner">
          <p className="agency-eyebrow">Event Networking Studio</p>
          <h1 className="agency-h1">
            Find the right rooms.<br />
            Build the right relationships.<br />
            Turn events into business growth.
          </h1>
          <p className="agency-hero-sub">
            We work with Texas professionals and organizations who want to get more out of the events they attend — and the relationships they build there.
          </p>
          <div className="agency-hero-actions">
            <a href="mailto:louis@localbusinesscalendars.com" className="agency-btn-primary">
              Get in Touch →
            </a>
            <Link href="/event-networking-method" className="agency-btn-ghost">
              See the Method
            </Link>
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="agency-section">
        <div className="agency-inner">
          <h2 className="agency-h2">What We Do</h2>
          <p className="agency-lead">
            Most professionals show up to events and hope something happens. We help you show up with a strategy.
          </p>
          <div className="agency-cards">
            <div className="agency-card">
              <div className="agency-card-icon">🎯</div>
              <h3 className="agency-card-title">Event Strategy</h3>
              <p className="agency-card-body">
                We help you identify which events are actually worth your time — by city, industry, and goal. Stop attending everything. Start attending the right things.
              </p>
            </div>
            <div className="agency-card">
              <div className="agency-card-icon">🤝</div>
              <h3 className="agency-card-title">Relationship Building</h3>
              <p className="agency-card-body">
                Attending is the easy part. We coach you on how to follow up, stay top of mind, and build genuine relationships that lead to referrals and business.
              </p>
            </div>
            <div className="agency-card">
              <div className="agency-card-icon">📅</div>
              <h3 className="agency-card-title">Calendar Intelligence</h3>
              <p className="agency-card-body">
                Powered by Local Business Calendars — we track the Texas business event landscape so your team always knows what&apos;s happening, in every city and industry.
              </p>
            </div>
            <div className="agency-card">
              <div className="agency-card-icon">🏢</div>
              <h3 className="agency-card-title">Organization Partnerships</h3>
              <p className="agency-card-body">
                We partner with chambers, associations, and networking groups to help them grow attendance, improve member engagement, and create events worth showing up for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Method ── */}
      <section className="agency-section agency-section--alt">
        <div className="agency-inner agency-method-wrap">
          <div className="agency-method-text">
            <p className="agency-eyebrow">Our Framework</p>
            <h2 className="agency-h2">Built on the Event Networking Method</h2>
            <p className="agency-body">
              Everything we do is built on the Event Networking Method — a proven framework for turning business events into measurable growth. It covers four pillars:
            </p>
            <ul className="agency-pillars">
              <li><strong>People</strong> — who to connect with, and how</li>
              <li><strong>Content</strong> — how to show up as a resource, not just an attendee</li>
              <li><strong>Events</strong> — which rooms are worth your time</li>
              <li><strong>Relationships</strong> — how to turn conversations into lasting business connections</li>
            </ul>
            <Link href="/event-networking-method" className="agency-btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              Learn the Method →
            </Link>
          </div>
          <div className="agency-method-visual">
            <div className="agency-method-card">
              <div className="agency-method-card-label">The Event Networking Method</div>
              <div className="agency-method-pillars">
                {['People', 'Content', 'Events', 'Relationships'].map(p => (
                  <div key={p} className="agency-method-pillar">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Help ── */}
      <section className="agency-section">
        <div className="agency-inner">
          <h2 className="agency-h2">Who We Work With</h2>
          <div className="agency-who-grid">
            {[
              { label: 'Business Professionals', desc: 'Executives, consultants, and salespeople who want to network with intention and stop wasting time at the wrong events.' },
              { label: 'Small Business Owners', desc: 'Owners who know events are valuable but struggle to find the right ones, follow up consistently, or measure the ROI.' },
              { label: 'Chambers & Associations', desc: 'Organizations that want to grow membership, increase event attendance, and create more value for their communities.' },
              { label: 'Corporate Teams', desc: 'Teams building local market presence across Texas cities through strategic community engagement and event sponsorship.' },
            ].map(item => (
              <div key={item.label} className="agency-who-item">
                <h3 className="agency-who-title">{item.label}</h3>
                <p className="agency-who-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="agency-cta-section">
        <div className="agency-inner agency-cta-inner">
          <h2 className="agency-cta-h2">Ready to make your events work harder?</h2>
          <p className="agency-cta-sub">
            Tell us about your goals and we&apos;ll put together a plan. No pressure — just a conversation about what&apos;s possible.
          </p>
          <div className="agency-hero-actions">
            <a href="mailto:louis@localbusinesscalendars.com?subject=Event Networking Studio — Let's Talk" className="agency-btn-primary agency-btn-primary--light">
              Email Us →
            </a>
            <Link href="/contact" className="agency-btn-ghost agency-btn-ghost--light">
              Contact Form
            </Link>
          </div>
          <p className="agency-cta-footer">
            Based in San Antonio · Serving Texas professionals across SA, Austin, Dallas &amp; Houston
          </p>
        </div>
      </section>

    </main>
  );
}
