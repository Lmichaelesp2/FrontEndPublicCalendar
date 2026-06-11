'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function AgencyPage() {
  return (
    <main className="agency-page">
      <Navigation />

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
            <Link href="/local-business-networking-method" className="agency-btn-ghost">
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
            {[
              { icon: 'ti-users',          title: 'People',        body: 'Get clear on exactly who you want in your network — before you walk into any room. We help you define your ideal connection by role, organization, and the events they already attend.' },
              { icon: 'ti-microphone',     title: 'Content',       body: 'Turn every event you discover into content that keeps your name in front of the right people. Audio, video, text, graphics — the content you produce is the fuel that powers everything that follows.' },
              { icon: 'ti-calendar-event', title: 'Participation',  body: 'Participate narrow, scan wide — go deep in three or four organizations while always watching the wider universe of events for the rooms that matter. We help you advance from showing up to stepping up to building your own rooms.' },
              { icon: 'ti-link',           title: 'Relationships', body: 'Use event content to stay in touch with everyone you meet — consistently, not occasionally. We build the systems that keep your network warm across email, social, and your own events.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="agency-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <i className={`ti ${icon}`} style={{ position: 'absolute', bottom: '-4px', right: '6px', fontSize: '2.25rem', color: 'var(--fg-1)', opacity: 0.07, pointerEvents: 'none' }} aria-hidden="true" />
                <h3 className="agency-card-title" style={{ position: 'relative' }}>{title}</h3>
                <p className="agency-card-body" style={{ position: 'relative' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Method ── */}
      <section className="agency-section agency-section--alt">
        <div className="agency-inner agency-method-wrap">
          <div className="agency-method-text">
            <p className="agency-eyebrow">Our Framework</p>
            <h2 className="agency-h2">Built on the Local Business Networking Method</h2>
            <p className="agency-body">
              Everything we do is built on the Local Business Networking Method — a proven framework for turning business events into measurable growth. It covers four pillars:
            </p>
            <ul className="agency-pillars">
              <li><strong>People</strong> — who to connect with, and how</li>
              <li><strong>Content</strong> — how to show up as a resource, not just an attendee</li>
              <li><strong>Participation</strong> — commit narrow, scan wide, then build your own rooms</li>
              <li><strong>Relationships</strong> — how to turn conversations into lasting business connections</li>
            </ul>
            <Link href="/local-business-networking-method" className="agency-btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              Learn the Method →
            </Link>
          </div>
          <div className="agency-method-visual">
            <div className="agency-method-card">
              <div className="agency-method-card-label">The Local Business Networking Method</div>
              <div className="agency-method-pillars">
                {['People', 'Content', 'Participation', 'Relationships'].map(p => (
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

      <Footer />
    </main>
  );
}
