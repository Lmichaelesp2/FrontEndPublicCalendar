'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Users, Clock, CalendarDays, Building2, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import type { Event } from '../../lib/supabase';

const STATS = [
  { number: '500+', label: 'Real estate professionals subscribed' },
  { number: '40+', label: 'Real estate organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "I used to miss half the HAR events and investor meetups. Now everything is in one place and I never fall behind.",
    name: 'Rachel T.',
    location: 'Houston, TX',
  },
  {
    quote: "The weekly real estate events newsletter keeps me in the loop on networking lunches, CE classes, and investor meetups without any effort.",
    name: 'James W.',
    location: 'Houston, TX',
  },
  {
    quote: "As a commercial broker in Houston, staying connected to the real estate community is everything. This calendar makes it automatic.",
    name: 'Linda M.',
    location: 'Houston, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of real estate events are listed?',
    answer: 'We track investor meetups, HAR events, broker networking events, real estate continuing education classes, property tours, market update seminars, commercial real estate events, and more across Houston.',
  },
  {
    question: 'Do you include construction and design industry events?',
    answer: 'Yes. We track construction, architecture, and design industry events in Houston alongside real estate investor and agent events.',
  },
  {
    question: 'Is this the same as the main Houston Business Calendar?',
    answer: 'No. The main Houston calendar shows all business and networking events. This page focuses exclusively on real estate, construction, and design events, making it easier for agents, brokers, investors, and property professionals to find what matters most.',
  },
  {
    question: 'Do you list REIA meetings and real estate investor events in Houston?',
    answer: 'Absolutely. Houston has a very active real estate investment community and we track events from local REI clubs, wholesaler meetups, and multifamily networking groups.',
  },
  {
    question: 'Do you cover commercial real estate events in Houston?',
    answer: 'Yes. Houston is one of the largest commercial real estate markets in the country and we actively track commercial real estate networking events, CCIM events, and industry gatherings.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Houston real estate events every Monday morning.',
  },
];

const EVENT_TYPES = [
  'Real estate networking mixers',
  'Investor meetups & REI clubs',
  'HAR events & CE classes',
  'Broker open houses & tours',
  'Market update seminars',
  'Commercial real estate events',
  'Property management workshops',
  'Construction & design events',
];

const ORGS = [
  'HAR (Houston Association of Realtors)',
  'Houston REI Meetup',
  'CCIM Houston',
  'IREM Houston',
  'Houston Apartment Association',
  'Women\'s Council of Realtors Houston',
  'Houston Commercial Brokers',
  'Texas Realtors Houston Chapter',
  'Houston Multifamily Investors',
  'Houston REIA',
  'Greater Houston Builders Assoc.',
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

function HoustonRealEstateContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Houston Real Estate Events Calendar | Free Weekly Real Estate Events Email"
        description="Find real estate networking, investor meetups, construction events, and design industry gatherings in Houston. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/houston/real-estate/"
        robots="noindex"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Houston', href: '/texas/houston' },
        { label: 'Real Estate Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            HOUSTON REAL ESTATE CALENDAR
          </div>
          <h1>
            Real Estate, Construction &amp; Design Events in the
            <br />
            <em>Houston</em> Area
          </h1>
          <p className="hero-subtext">
            Stop missing the real estate events that grow your network and your deals.
          </p>
          <div className="hero-category-tags">
            Real Estate &middot; Networking &middot; Property Trends &middot; Investor Meetups &middot; Commercial Deals &middot; and more
          </div>
          <div className="hero-cta-group">
            <Link href="/texas/houston/subscribe" className="btn btn-white">
              Get My Free Houston Real Estate Events Newsletter
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
          <p className="features-subtitle">We aggregate real estate event sources across Houston so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Real Estate Events</h3>
              <p>Click subscribe above. Enter your email address. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's real estate networking events, investor meetups, and property tours in Houston.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events &amp; show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next Houston Real Estate Event</h2>
          <p>Browse investor meetups, HAR events, broker tours, and more</p>
        </div>
        <EventGate forcedCity="Houston" groupType="real_estate" initialEvents={initialEvents} />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>Houston Real Estate Organizations We Track</h2>
          <p>We monitor events from Houston's top real estate communities so nothing slips through the cracks.</p>
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
          <h2>Never Miss a Real Estate Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Building2 size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for Houston real estate events and get that week's investor meetups, HAR events, and tours in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse Houston's real estate events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what's coming up in the real estate community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by Houston Real Estate Professionals</h2>
          <p className="sp-subtitle">Houston Real Estate Calendar — By the Numbers</p>
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
        heading="Why Houston Real Estate Professionals Use This Calendar"
        subtitle="Houston real estate events are spread across too many platforms and websites. Here's how Local Business Calendars helps Houston professionals keep up."
        problemText="Real estate events in Houston are scattered across HAR, Meetup groups, Eventbrite, LinkedIn, and individual brokerage websites. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track real estate event hosts across Houston and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Houston Real Estate Events Every Monday — Free</h2>
          <p>A curated digest of that week's real estate events in Houston, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/houston/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Houston business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-accent">Submit a Real Estate Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/houston">See all Houston business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Houston Real Estate Events</h2>
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
        citySlug="houston"
        cityName="Houston"
        categoryNav={{
          cityLabel: "Also in Houston:",
          links: [
            { label: "Technology Events", href: "/texas/houston/technology" },
            { label: "Chamber Events", href: "/texas/houston/chamber" },
            { label: "Small Business Events", href: "/texas/houston/small-business" },
            { label: "Networking Events", href: "/texas/houston/networking" }
          ]
        }}
      />
    </div>
  );
}

export function HoustonRealEstatePage({ initialEvents }: { initialEvents: Event[] }) {
  return <HoustonRealEstateContent initialEvents={initialEvents} />;
}
