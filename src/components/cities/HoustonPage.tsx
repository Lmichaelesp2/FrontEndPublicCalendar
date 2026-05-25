'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Users, Clock, Monitor, Home, Landmark, Briefcase, Search, Building2, Star, Mail } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { Breadcrumb } from '../Breadcrumb';
import { WhySection } from '../WhySection';
import { EventNetworkingMethodSection } from '../EventNetworkingMethodSection';
import type { Event } from '../../lib/supabase';
import { SponsorPatronSection } from '../SponsorPatronSection';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumCityView } from '../PremiumCityView';

const STATS = [
  { number: '1,000+', label: 'Houston professionals subscribed' },
  { number: '300+', label: 'Houston business organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Houston's business community is massive. This calendar is the only way I can keep up with everything happening.",
    name: 'Angela M.',
    location: 'Houston, TX',
  },
  {
    quote: "Finally a weekly email that shows me what's actually worth attending in Houston each week.",
    name: 'James C.',
    location: 'Houston, TX',
  },
  {
    quote: "As an energy sector professional, the Houston business events calendar keeps me connected to the right communities.",
    name: 'Lisa R.',
    location: 'Houston, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is this really free?',
    answer: 'Yes! The Houston calendar and weekly email are completely free — no credit card required. The full calendar is free and open to everyone. Give us your email and we deliver every upcoming event straight to your inbox every Monday morning.',
  },
  {
    question: 'What kinds of events are listed for Houston?',
    answer: 'We track business networking mixers, chamber events (Greater Houston Partnership, Hispanic Chamber, Minority Chamber, and more), SCORE workshops, professional development sessions, entrepreneur meetups, energy sector events, and industry-specific gatherings across Houston.',
  },
  {
    question: 'How do you find Houston events?',
    answer: "We monitor top Houston business organizations, chambers of commerce, Meetup, Eventbrite, Facebook, and dozens of local sources — so you don't have to check multiple sites.",
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer: "Those platforms only show events posted on their own site. We gather networking and business events from all major platforms and local Houston organizations into one calendar, giving you a complete picture.",
  },
  {
    question: 'What do I get when I sign up free?',
    answer: "Free signup gives you access to the full week of Houston business events on the calendar — not just today's events. You also get the Monday morning newsletter with that week's curated digest.",
  },
  {
    question: 'Can I add my own Houston event?',
    answer: 'Yes! Use our Submit Event page to add your networking or business event to the Houston calendar for free.',
  },
];

const ORGS = [
  'Greater Houston Partnership',
  'Houston Hispanic Chamber',
  'Houston Minority Chamber',
  'Houston Technology Center',
  'SCORE Houston',
  'Small Business Administration Houston',
  'Houston Young Professionals',
  'Houston Entrepreneurs Association',
  'Houston Women in Technology',
  'Houston Startup Week',
  '... and many more',
];

const CATEGORY_LINKS = [
  { label: 'Chamber Events', href: '/texas/houston/chamber', icon: <Landmark size={20} /> },
  { label: 'Technology Events', href: '/texas/houston/technology', icon: <Monitor size={20} /> },
  { label: 'Real Estate Events', href: '/texas/houston/real-estate', icon: <Home size={20} /> },
  { label: 'Small Business Events', href: '/texas/houston/small-business', icon: <Briefcase size={20} /> },
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

  // ISO week number of the year
  const thu = new Date(sun); thu.setDate(sun.getDate() + 4);
  const yearStart = new Date(thu.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((thu.getTime() - yearStart.getTime()) / 86400000 - 3 + (yearStart.getDay() + 6) % 7) / 7);

  return { count, weekRange: `${sunStr} – ${satStr}`, nextMonStr, vol: weekNum };
}


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

function HoustonContent({ initialEvents }: { initialEvents: Event[] }) {
  const { profile } = useAuth();
  const isPremium = profile?.subscription_tier === 'premium';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const weekInfo = getWeekInfo(initialEvents);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isPremium) {
    return <PremiumCityView city="Houston" citySlug="houston" initialEvents={initialEvents} />;
  }

  return (
    <div className="sa-page">
      <SEOHead
        title="Houston Business Calendar | Free Networking & Business Events Newsletter"
        description="Find networking events, business mixers, chamber meetings, and professional development opportunities in Houston, Texas. Updated weekly with the latest events."
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Houston' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              THIS WEEK IN HOUSTON &middot; {weekInfo.count} EVENTS
            </div>
            <h1>
              Find the events where Houston business{' '}
              <em>actually</em> happens.
            </h1>
            <p className="hero-sub">
              Energy sector events, chamber meetings, real estate networking, and business mixers — Houston's professional events in one calendar and one weekly email.
            </p>
            <div className="hero-cta-group">
              <Link href="/texas/houston/subscribe" className="btn btn-primary">
                Sign Up Free — See This Week's Events
              </Link>
              <a href="#calendar" className="btn btn-ghost">
                Browse Houston &rarr;
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
                  const href = slug[tag as keyof typeof slug] ? `/texas/houston/${slug[tag as keyof typeof slug]}` : null;
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
          <span>TRACKED ORGANIZATIONS: 300+</span>
        </div>
      </section>


      <SponsorPatronSection city="Houston" citySlug="houston" />
      <EventNetworkingMethodSection city="Houston" />



      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Houston Business Events So You Don't Have To</h2>
          <p className="features-subtitle">Houston business events are scattered across chambers, Eventbrite, Meetup, LinkedIn, and energy industry networks. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access to the full Houston business events calendar. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top networking and business events in Houston.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events and show up</h3>
              <p>Scan the list, choose what fits your schedule, and walk in ready to meet the right Houston professionals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next Houston Event</h2>
          <p>Browse networking events, business mixers, lunch-and-learns, and more</p>
        </div>
        <EventGate forcedCity="Houston" initialEvents={initialEvents} showMonthCalendar={true} />
      </section>


            <WhySection
        heading="Why Houston Professionals Use This Calendar"
        subtitle="Houston business events are spread across too many platforms and websites. Here's how Local Business Calendars helps Houston professionals keep up."
        problemText="Business events in Houston are spread across Eventbrite, Meetup, LinkedIn, chambers, and association websites. Finding the right ones takes time."
        whatWeDoText="We track local business event hosts and organize their public events into one simple Houston calendar and weekly newsletter."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />
      <section className="sa-subscribe-section" id="houston-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free • Takes 30 Seconds
          </div>
          <h2>Get the Full Week of Houston Events</h2>
          <p>Get Houston business events delivered to your inbox every Monday — free, no account needed.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/houston/subscribe" className="btn btn-primary">Sign Up Free — Unlock the Full Week</Link>
          </div>
        </div>
      </section>
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

      <Footer showIndustryCalendars={true} citySlug="houston" cityName="Houston" />
    </div>
  );
}

export function HoustonPage({ initialEvents }: { initialEvents: Event[] }) {
  return <HoustonContent initialEvents={initialEvents} />;
}
