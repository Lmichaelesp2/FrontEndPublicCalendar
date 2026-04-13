'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Landmark, Users, Clock, CalendarDays, Building2, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import type { Event } from '../../lib/supabase';

const STATS = [
  { number: '500+', label: 'Chamber members subscribed' },
  { number: '25+', label: 'Chambers & associations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Between the SA Chamber, Hispanic Chamber, and North SA Chamber, I was checking three different websites every week. Now it's all in one calendar.",
    name: 'Patricia H.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The weekly chamber events email is exactly what I needed. I show up to more ribbon cuttings and luncheons than ever before.",
    name: 'Robert D.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a chamber ambassador, having every chamber event across San Antonio in one view has been incredibly valuable for planning my week.",
    name: 'Angela S.',
    location: 'San Antonio, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of chamber events are listed?',
    answer: 'We track chamber luncheons, ribbon cuttings, Business After Hours mixers, ambassador meetings, legislative updates, annual galas, and more from chambers and business associations across San Antonio.',
  },
  {
    question: 'Is this calendar free?',
    answer: 'Yes! The San Antonio chamber events calendar and weekly email are completely free — no credit card required.',
  },
  {
    question: 'How is this different from the main San Antonio calendar?',
    answer: 'The main San Antonio calendar shows all business and networking events. This page focuses exclusively on chamber of commerce and business association events, making it easier to track the organizations that matter most to you.',
  },
  {
    question: 'Which chambers do you track?',
    answer: 'We monitor the San Antonio Chamber of Commerce, North SA Chamber, Hispanic Chamber, African American Chamber, Asian Chamber, Women\'s Chamber, and many more regional and industry-specific chambers in the area.',
  },
  {
    question: 'Can I submit a chamber event?',
    answer: 'Yes! Use our Submit Event page to add your chamber event to the calendar for free. Just make sure to categorize it as a chamber event.',
  },
  {
    question: 'Do you cover Business After Hours events?',
    answer: 'Absolutely. Business After Hours, luncheons, ribbon cuttings, and all regularly scheduled chamber events are tracked from every major San Antonio chamber we monitor.',
  },
];

const EVENT_TYPES = [
  'Chamber luncheons & breakfasts',
  'Business After Hours mixers',
  'Ribbon cuttings & grand openings',
  'Ambassador committee meetings',
  'Legislative update sessions',
  'Annual galas & award ceremonies',
  'New member orientations',
  'Multi-chamber joint events',
];

const ORGS = [
  'SA Chamber of Commerce',
  'North SA Chamber',
  'Hispanic Chamber SA',
  'African American Chamber',
  'Asian Chamber SA',
  'Women\'s Chamber SA',
  'Alamo City Chamber',
  'Randolph Metrocom Chamber',
  'South SA Chamber',
  'Boerne Chamber',
  'New Braunfels Chamber',
  '... and many more',
];

function FaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-trigger" onClick={onToggle} aria-expanded={open}>
        <span>{question}</span>
        {open ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

function SanAntonioChamberContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="San Antonio Chamber Events Calendar | Free Weekly Chamber Events Email"
        description="Find chamber luncheons, Business After Hours, ribbon cuttings, and business association events in San Antonio, Texas. Updated weekly."
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Chamber Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="dot" style={{ background: '#10b981' }}></span>
            San Antonio Chamber Calendar
          </div>
          <h1>
            Chamber Events in
            <br />
            the <em>San Antonio</em> area
          </h1>
          <p className="hero-subtext">
            Stop missing the events that grow your network and your business.
          </p>
          <div className="hero-category-tags">
            Chamber &middot; Networking &middot; Business Mixers &middot; Ribbon Cuttings &middot; Luncheons &middot; and more
          </div>
          <div className="hero-cta-group">
            <Link href="/texas/san-antonio/subscribe" className="btn btn-white">
              Get My Free San Antonio Chamber Events Newsletter
            </Link>
            <p className="hero-subtext-below">
              Browse the calendar anytime between newsletters. Always free.
            </p>
          </div>
        </div>
      </section>

      <section className="benefits-bar">
        <div className="benefits-bar-inner">
          <div className="benefit-item">
            <div className="benefit-icon">
              <CalendarDays size={20} strokeWidth={2} />
            </div>
            <span>Events aggregated every week</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <Mail size={20} strokeWidth={2} />
            </div>
            <span>Delivered every Monday morning</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <span>Access calendar anytime</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-inner">
          <h2>We Do the Searching So You Don't Have To</h2>
          <p className="features-subtitle">We aggregate chamber event sources across San Antonio so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Chamber Events</h3>
              <p>Click subscribe above. Enter your email address. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's chamber luncheons, Business After Hours, and ribbon cuttings in San Antonio.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events & show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Chamber Event</h2>
          <p>Browse luncheons, Business After Hours, ribbon cuttings, and more</p>
        </div>
        <EventGate forcedCity="San Antonio" groupType="chamber" initialEvents={initialEvents} />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>San Antonio Chambers & Associations We Track</h2>
          <p>We monitor events from San Antonio's chambers and business associations so nothing slips through the cracks.</p>
          <div className="sa-orgs-grid">
            {ORGS.map((org, i) => (
              <div key={i} className="sa-org-tag">
                <Users size={14} strokeWidth={2} />
                {org}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss a Chamber Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Building2 size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for San Antonio chamber events and get that week's luncheons, Business After Hours, and ribbon cuttings in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse San Antonio's chamber and association events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what's coming up in the chamber community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by San Antonio Chamber Members</h2>
          <p className="sp-subtitle">San Antonio Chamber Calendar — By the Numbers</p>
          <div className="sp-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="sp-stat">
                <span className="sp-stat-number">{stat.number}</span>
                <span className="sp-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="sp-testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="sp-card">
                <div className="sp-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="sp-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="sp-author">
                  <span className="sp-name">&mdash; {t.name}</span>
                  <span className="sp-location">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhySection
        heading="Why San Antonio Chamber Professionals Use This Calendar"
        subtitle="San Antonio chamber events are spread across too many platforms and websites. Here's how Local Business Calendars helps San Antonio chamber professionals keep up."
        problemText="Chamber events in San Antonio are scattered across chamber websites, Eventbrite, LinkedIn, Facebook, and individual association pages. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track chamber event hosts across San Antonio and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get San Antonio Chamber Events Every Monday — Free</h2>
          <p>A curated digest of that week's chamber events in San Antonio, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-accent">Submit a Chamber Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/san-antonio">See all San Antonio business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={i}
                question={item.question}
                answer={item.answer}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer
        citySlug="san-antonio"
        cityName="San Antonio"
        categoryNav={{
          cityLabel: "Also in San Antonio:",
          links: [
            { label: "Technology Events", href: "/texas/san-antonio/technology" },
            { label: "Real Estate Events", href: "/texas/san-antonio/real-estate" },
            { label: "Small Business Events", href: "/texas/san-antonio/small-business" },
            { label: "Networking Events", href: "/texas/san-antonio/networking" }
          ]
        }}
      />
    </div>
  );
}

export function SanAntonioChamberPage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioChamberContent initialEvents={initialEvents} />;
}
