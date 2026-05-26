'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Building2, Users, Clock, Monitor, Home, Landmark, Briefcase, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { Breadcrumb } from '../Breadcrumb';
import { WhySection } from '../WhySection';
import { EventNetworkingMethodSection } from '../EventNetworkingMethodSection';
import type { Event } from '../../lib/supabase';
import { SponsorPatronSection } from '../SponsorPatronSection';
import { SponsorSubmitSection } from '../SponsorSubmitSection';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumCityView } from '../PremiumCityView';

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


// ── Dynamic week/newsletter helper ───────────────────────────────────────────
function getWeekInfo(events: { start_date?: string }[]) {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const sun = new Date(today);
  sun.setDate(today.getDate() - day);
  const sat = new Date(sun);
  sat.setDate(sun.getDate() + 6);

  const pad = (n: number) => String(n).padStart(2, '0');
  const from = `${sun.getFullYear()}-${pad(sun.getMonth() + 1)}-${pad(sun.getDate())}`;
  const to   = `${sat.getFullYear()}-${pad(sat.getMonth() + 1)}-${pad(sat.getDate())}`;

  const count = events.filter(e => e.start_date && e.start_date >= from && e.start_date <= to).length;

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const sunStr = `${MONTHS[sun.getMonth()]} ${sun.getDate()}`;
  const satStr = `${MONTHS[sat.getMonth()]} ${sat.getDate()}, ${sat.getFullYear()}`;

  // Next Monday = this Sunday + 8 days
  const nextMon = new Date(sun);
  nextMon.setDate(sun.getDate() + 8);
  const nextMonStr = `MONDAY, ${MONTHS[nextMon.getMonth()]} ${nextMon.getDate()}`;

  // ISO week number of the year (Week 1 = week containing Jan 4)
  const thu = new Date(sun); thu.setDate(sun.getDate() + 4);
  const yearStart = new Date(thu.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((thu.getTime() - yearStart.getTime()) / 86400000 - 3 + (yearStart.getDay() + 6) % 7) / 7);

  return { count, weekRange: `${sunStr} – ${satStr}`, nextMonStr, vol: weekNum };
}


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
  const { profile } = useAuth();
  const isPremium = profile?.subscription_tier === 'premium';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const weekInfo = getWeekInfo(initialEvents);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isPremium) {
    return <PremiumCityView city="San Antonio" citySlug="san-antonio" initialEvents={initialEvents} />;
  }

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
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              THIS WEEK IN SAN ANTONIO &middot; {weekInfo.count} EVENTS
            </div>
            <h1>
              Find the events where San Antonio business{' '}
              <em>actually</em> happens.
            </h1>
            <p className="hero-sub">
              Chamber events, business mixers, real estate gatherings, and tech meetups — San Antonio's public business events organized into one calendar and one weekly email.
            </p>
            <div className="hero-cta-group">
              <Link href="/texas/san-antonio/subscribe" className="btn btn-primary">
                Sign Up Free — See This Week's Events
              </Link>
              <a href="#calendar" className="btn btn-ghost">
                Browse San Antonio &rarr;
              </a>
            </div>
            <p className="hero-trust">
              Free forever&nbsp;&middot;&nbsp;No credit card
            </p>
          </div>
          <div className="hero-right">
            <div className="hero-city-panel">
              <div className="hero-city-panel-header">EVENT TYPES</div>
              <ul className="hero-city-panel-list">
                {['Chamber', 'Technology', 'Real Estate', 'Small Business', 'and many more'].map((tag) => {
                  const slug = {'Chamber': 'chamber', 'Technology': 'technology', 'Real Estate': 'real-estate', 'Small Business': 'small-business'};
                  const href = slug[tag as keyof typeof slug] ? `/texas/san-antonio/${slug[tag as keyof typeof slug]}` : null;
                  return (
                    <li key={tag} className="hero-city-panel-row">
                      {href ? (
                        <a href={href} className="hero-city-panel-tag">{tag}</a>
                      ) : (
                        <span className="hero-city-panel-tag">{tag}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="hero-strip">
          <span>WEEK {weekInfo.vol} &middot; {weekInfo.weekRange}</span>
          <span className="hero-strip-divider">|</span>
          <span>NEXT NEWSLETTER: {weekInfo.nextMonStr} &middot; 6:00 A.M. CT</span>
          <span className="hero-strip-divider">|</span>
          <span>TRACKED ORGANIZATIONS: 250+</span>
        </div>
      </section>


      <SponsorPatronSection city="San Antonio" citySlug="san-antonio" />
      <EventNetworkingMethodSection city="San Antonio" />



      <section className="features-section">
        <div className="features-inner">
          <h2>We Track San Antonio Business Events So You Don't Have To</h2>
          <p className="features-subtitle">San Antonio business events are scattered across chambers, Eventbrite, Meetup, LinkedIn, and military/business community sites. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access to the full San Antonio business events calendar. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top networking and business events in San Antonio.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events and show up</h3>
              <p>Scan the list, choose what fits your schedule, and walk in ready to meet the right San Antonio professionals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Event</h2>
          <p>Browse networking events, business mixers, lunch-and-learns, and more</p>
        </div>
        <EventGate forcedCity="San Antonio" initialEvents={initialEvents} showMonthCalendar={true} citySlug="san-antonio" />
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
          <p>Get San Antonio business events delivered to your inbox every Monday — free, no account needed.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/subscribe" className="btn btn-primary">Sign Up Free — Unlock the Full Week</Link>
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

      <SponsorSubmitSection city="San Antonio" citySlug="san-antonio" />

      <Footer showIndustryCalendars={true} citySlug="san-antonio" cityName="San Antonio" />
    </div>
  );
}

export function SanAntonioPage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioContent initialEvents={initialEvents} />;
}
