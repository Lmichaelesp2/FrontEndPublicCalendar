'use client';
import { SUB_CALENDARS_ENABLED } from '../../lib/subCalendars';
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
import { SponsorSubmitSection } from '../SponsorSubmitSection';
import { LBOSection } from '../LBOSection';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumCityView } from '../PremiumCityView';
import { SHOW_SPONSOR_SECTIONS, SHOW_ENM_SECTION } from '../../lib/featureFlags';

const STATS = [
  { number: '1,000+', label: 'Austin professionals subscribed' },
  { number: '250+', label: 'Austin business organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Austin's event scene is scattered across so many platforms. This calendar finally pulls it all together.",
    name: 'Jennifer L.',
    location: 'Austin, TX',
  },
  {
    quote: "I've been to more networking events in the last two months than in the past year. The Monday email makes it effortless.",
    name: 'Michael B.',
    location: 'Austin, TX',
  },
  {
    quote: "As a startup founder in Silicon Hills, this calendar is how I stay connected to the Austin tech and business community.",
    name: 'Priya K.',
    location: 'Austin, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is this really free?',
    answer: 'Yes! The Austin calendar and weekly email are completely free — no credit card required. The full calendar is free and open to everyone. Give us your email and we deliver every upcoming event straight to your inbox every Monday morning.',
  },
  {
    question: 'What kinds of events are listed for Austin?',
    answer: 'We track business networking mixers, chamber events (Austin Chamber, Hispanic Chamber, Asian Chamber, and more), SCORE workshops, professional development sessions, entrepreneur meetups, startup events, tech meetups, and industry-specific events across Austin.',
  },
  {
    question: 'How do you find Austin events?',
    answer: "We monitor top Austin business organizations, chambers of commerce, Meetup, Eventbrite, Facebook, and dozens of local sources — so you don't have to check multiple sites.",
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer: "Those platforms only show events posted on their own site. We gather networking and business events from all major platforms and local Austin organizations into one calendar, giving you a complete picture.",
  },
  {
    question: 'What do I get when I sign up free?',
    answer: "Free signup gives you access to the full week of Austin business events on the calendar — not just today's events. You also get the Monday morning newsletter with that week's curated digest.",
  },
  {
    question: 'Can I add my own Austin event?',
    answer: 'Yes! Use our Submit Event page to add your networking or business event to the Austin calendar for free.',
  },
];

const ORGS = [
  'Austin Chamber of Commerce',
  'Austin Young Chamber',
  'Austin Technology Council',
  'Capital Factory',
  'SCORE Austin',
  'Austin Apartment Association',
  'Austin Board of Realtors',
  'Austin Women in Business',
  'Austin Entrepreneurs',
  'Greater Austin Hispanic Chamber',
  'Austin Startup Network',
  '... and many more',
];

const CATEGORY_LINKS = [
  { label: 'Chamber Events', href: '/texas/austin/chamber', icon: <Landmark size={20} /> },
  { label: 'Technology Events', href: '/texas/austin/technology', icon: <Monitor size={20} /> },
  { label: 'Real Estate Events', href: '/texas/austin/real-estate', icon: <Home size={20} /> },
  { label: 'Small Business Events', href: '/texas/austin/small-business', icon: <Briefcase size={20} /> },
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

function AustinContent({ initialEvents }: { initialEvents: Event[] }) {
  const { profile } = useAuth();
  const isPremium = profile?.subscription_tier === 'premium';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const weekInfo = getWeekInfo(initialEvents);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isPremium) {
    return <PremiumCityView city="Austin" citySlug="austin" initialEvents={initialEvents} />;
  }

  return (
    <div className="sa-page">
      <SEOHead
        title="Austin Business Calendar | Free Networking & Business Events Newsletter"
        description="Find networking events, business mixers, chamber meetings, and professional development opportunities in Austin, Texas. Updated weekly with the latest events."
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Austin' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              THIS WEEK IN AUSTIN &middot; {weekInfo.count} EVENTS
            </div>
            <h1>
              Find the events where Austin business{' '}
              <em>actually</em> happens.
            </h1>
            <p className="hero-sub">
              Startup meetups, chamber luncheons, real estate networking, and small business workshops — Austin's business events in one calendar and one weekly email.
            </p>
            <div className="hero-cta-group">
              <Link href="/texas/austin/subscribe" className="btn btn-primary">
                Subscribe Free — Get This Week's Events
              </Link>
              <a href="#calendar" className="btn btn-ghost">
                Browse Austin &rarr;
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
                  const href = (SUB_CALENDARS_ENABLED && slug[tag as keyof typeof slug]) ? `/texas/austin/${slug[tag as keyof typeof slug]}` : null; // SUB-CAL: hidden while paused
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
          <span>NEXT NEWSLETTER: {weekInfo.nextMonStr} &middot; 6:00 A.M. CT</span>
          <span className="hero-strip-divider">|</span>
          <span>TRACKED ORGANIZATIONS: 250+</span>
        </div>
      </section>


      {SHOW_SPONSOR_SECTIONS && (<SponsorPatronSection city="Austin" citySlug="austin" />)}
<section className="features-section">
        <div className="features-inner">
          <h2>We Track Austin Business Events So You Don't Have To</h2>
          <p className="features-subtitle">Austin business events are scattered across chambers, Eventbrite, Meetup, LinkedIn, and startup community sites. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access to the full Austin business events calendar. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top networking and business events in Austin.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events and show up</h3>
              <p>Scan the list, choose what fits your schedule, and walk in ready to meet the right Austin professionals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next Austin Event</h2>
          <p>Browse networking events, business mixers, lunch-and-learns, and more</p>
        </div>
        <EventGate forcedCity="Austin" initialEvents={initialEvents} showMonthCalendar={true} citySlug="austin" />
      </section>


            <WhySection
        heading="Why Austin Professionals Use This Calendar"
        subtitle="Austin business events are spread across too many platforms and websites. Here's how Local Business Calendars helps Austin professionals keep up."
        problemText="Business events in Austin are spread across Eventbrite, Meetup, LinkedIn, chambers, and association websites. Finding the right ones takes time."
        whatWeDoText="We track local business event hosts and organize their public events into one simple Austin calendar and weekly newsletter."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />
      <section className="sa-subscribe-section" id="austin-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free • Takes 30 Seconds
          </div>
          <h2>Get the Full Week of Austin Events</h2>
          <p>Get Austin business events delivered to your inbox every Monday — free, no account needed.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/austin/subscribe" className="btn btn-primary">Subscribe Free — Get the Full Week</Link>
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

      {SHOW_ENM_SECTION && (<EventNetworkingMethodSection city="Austin" />)}
<LBOSection city="Austin" citySlug="austin" />
<SponsorSubmitSection city="Austin" citySlug="austin" />

      <Footer showIndustryCalendars={true} citySlug="austin" cityName="Austin" />
    </div>
  );
}

export function AustinPage({ initialEvents }: { initialEvents: Event[] }) {
  return <AustinContent initialEvents={initialEvents} />;
}
