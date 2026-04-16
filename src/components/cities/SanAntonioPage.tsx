'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, CalendarDays, Search, Mail, Building2, Users, Clock, Monitor, Home, Landmark, Briefcase, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { Breadcrumb } from '../Breadcrumb';
import { WhySection } from '../WhySection';
import type { Event } from '../../lib/supabase';
import SponsorSection from '../SponsorSection';

const SA_STATS = [
  { number: '2,500+', label: 'San Antonio professionals subscribed' },
  { number: '250+', label: 'San Antonio business organizations tracked' },
];

const SA_TESTIMONIALS = [
  {
    quote: "Finally, all the networking events in one place. No more missing out because I didn't know something was happening in San Antonio.",
    name: 'Sarah M.',
    location: 'San Antonio, TX',
  },
  {
    quote: "This calendar has become essential for growing my professional network in the Alamo City. The weekly email alone saves me hours.",
    name: 'Marcus T.',
    location: 'San Antonio, TX',
  },
  {
    quote: "I used to check the SA Chamber site, Eventbrite, and Facebook separately. Now I just check one site.",
    name: 'Jennifer L.',
    location: 'San Antonio, TX',
  },
];

const SA_FAQ = [
  {
    question: 'Is this really free?',
    answer: 'Yes! The San Antonio calendar and weekly email are completely free — no credit card required. We also offer a Personal Event Assistant for professionals who want AI-powered event recommendations tailored to their goals.',
  },
  {
    question: 'What kinds of events are listed for San Antonio?',
    answer: 'We track business networking mixers, chamber events (SA Chamber, North SA Chamber, Hispanic Chamber, and more), SCORE workshops, professional development sessions, entrepreneur meetups, and industry-specific events across the city.',
  },
  {
    question: 'How do you find San Antonio events?',
    answer: 'We monitor top San Antonio business organizations, chambers of commerce, Meetup, Eventbrite, Facebook, and dozens of local sources — so you don\'t have to check multiple sites.',
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer: 'Those platforms only show events posted on their own site. We gather networking and business events from all major platforms and local San Antonio organizations into one calendar, giving you a complete picture.',
  },
  {
    question: 'What do I get with the weekly email?',
    answer: 'A curated digest of San Antonio\'s best upcoming networking and business events, delivered to your inbox every Monday morning. The calendar on the site is always free to browse.',
  },
  {
    question: 'What is the Personal Event Assistant?',
    answer: 'An upcoming AI-powered tool that learns your industry, professional goals, and schedule to recommend the best San Antonio events for you personally. Join the waitlist to be first in line.',
  },
  {
    question: 'Can I add my own San Antonio event?',
    answer: 'Yes! Use our Submit Event page to add your networking or business event to the San Antonio calendar for free.',
  },
];

const EVENT_TYPES = [
  'Business networking events',
  'Industry meetups',
  'Professional workshops',
  'Chamber and association events',
  'Educational business sessions',
  'Entrepreneur and startup gatherings',
];

function SAFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
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

function SanAntonioContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="San Antonio Business Calendar | Free Networking & Business Events Newsletter"
        description="Find networking events, business mixers, chamber meetings, and professional development opportunities in San Antonio, Texas. Updated weekly with the latest events."
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            San Antonio Business Calendar
          </div>
          <h1>
            Networking &amp; Business Events in
            <br />
            the <em>San Antonio</em> area
          </h1>
          <p className="hero-subtext">
            Stop missing the events that grow your network and your business.
          </p>
          <div className="hero-category-tags">
            Networking · Chamber · Technology · Real Estate · Small Business · Healthcare · Finance
          </div>
          <div className="hero-cta-group">
            <Link href="/texas/san-antonio/subscribe" className="btn btn-white">
              Sign Up Free — See the Full Week of San Antonio Events
            </Link>
            <p className="hero-subtext-below">
              Free access to the full weekly calendar + the Monday newsletter. No credit card. Cancel anytime.
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
          <p className="features-subtitle">See today's events now, unlock the full weekly calendar when you sign up, and get the Monday email with the week's top networking and business events in San Antonio.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free in 10 seconds</h3>
              <p>Enter your email and get instant access. No credit card, no setup, and no complicated account process.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Unlock the full week of events</h3>
              <p>See more than just today's events. Unlock the full weekly calendar for San Antonio in one quick step.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated email with the week's top networking and business events in San Antonio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Event</h2>
          <p>Browse networking events, business mixers, lunch-and-learns, and more</p>
        </div>
        <EventGate forcedCity="San Antonio" initialEvents={initialEvents} showMonthCalendar={true} />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>San Antonio Organizations We Track</h2>
          <p>We monitor events from San Antonio's top business networks so nothing slips through the cracks.</p>
          <div className="sa-orgs-grid">
            {[
              'San Antonio Chamber of Commerce',
              'North SA Chamber',
              'Hispanic Chamber of Commerce',
              'SCORE San Antonio',
              'SA Young Professionals',
              'Tech Bloc',
              'Venture San Antonio',
              'NAWBO San Antonio',
              'SA Entrepreneurs',
              'SA BizConnect',
              'Small Business Development Center',
              '... and many more',
            ].map((org, i) => (
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
          <h2>Never Miss a Networking or Business Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Building2 size={40} strokeWidth={2} /></div>
              <h3>Start the week with a reminder</h3>
              <p>Start each week with a curated email so upcoming networking and business events do not slip past you.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check events anytime</h3>
              <p>Visit your city calendar anytime to see what's happening today and stay connected to local opportunities.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Plan your week ahead</h3>
              <p>Look ahead at upcoming events so you can choose the right rooms, protect your time, and show up prepared.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by San Antonio Business Professionals</h2>
          <p className="sp-subtitle">Numbers from across the Texas Business Calendars network.</p>
          <div className="sp-stats">
            {SA_STATS.map((stat) => (
              <div key={stat.label} className="sp-stat">
                <span className="sp-stat-number">{stat.number}</span>
                <span className="sp-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="sp-testimonials">
            {SA_TESTIMONIALS.map((t) => (
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
        heading="Why San Antonio Professionals Use This Calendar"
        subtitle="San Antonio business events are spread across too many platforms and websites. Here's how Local Business Calendars helps San Antonio professionals keep up."
        problemText="Business events in San Antonio are spread across Eventbrite, Meetup, LinkedIn, chambers, and association websites. Finding the right ones takes time."
        whatWeDoText="We track local business event hosts and organize their public events into one simple San Antonio calendar and weekly newsletter."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free • Takes 30 Seconds
          </div>
          <h2>Get the Full Week of San Antonio Events</h2>
          <p>Sign up free to unlock the full weekly calendar and get the Monday email with top networking and business events in San Antonio.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/subscribe" className="btn btn-gold">Sign Up Free — Unlock the Full Week</Link>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {SA_FAQ.map((item, i) => (
              <SAFaqItem
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

      <Footer showIndustryCalendars={true} citySlug="san-antonio" cityName="San Antonio" />
    </div>
  );
}

export function SanAntonioPage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioContent initialEvents={initialEvents} />;
}
