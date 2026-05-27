'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Plus, Minus } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { WhySection } from './WhySection';
import { EventNetworkingMethodSection } from './EventNetworkingMethodSection';

const STATS = [
  { number: '500+', label: 'Events every week' },
  { number: '5,000+', label: 'Professionals subscribed' },
  { number: '800+', label: 'Organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: 'Finally, all the networking events in one place. No more missing out because I didn\'t know something was happening.',
    name: 'Sarah M.',
    location: 'San Antonio, TX',
  },
  {
    quote: 'This calendar has become essential for growing my professional network. The weekly email alone saves me hours.',
    name: 'Marcus T.',
    location: 'Houston, TX',
  },
  {
    quote: 'I used to check Meetup, Eventbrite, and Facebook separately. Now I just check one site.',
    name: 'Jennifer L.',
    location: 'Austin, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Which cities do you currently cover?',
    answer: 'We currently cover San Antonio, Austin, Dallas, and Houston. Each city has its own dedicated calendar with locally sourced business and networking events.',
  },
  {
    question: 'Are the city business calendars free?',
    answer: 'Yes — each city calendar and its weekly newsletter are completely free. Whether you\'re in San Antonio, Austin, Dallas, or Houston, there\'s no credit card, no trial period, no catch.',
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer: 'Those platforms only show events posted on their own site. We gather networking and business events from all major platforms and local organizations into one calendar per city, giving you a complete picture of what\'s happening.',
  },
  {
    question: 'How do I subscribe to a city calendar?',
    answer: 'Choose your state, pick your city, and create your free account. Takes 30 seconds — no credit card, no setup.',
  },
  {
    question: 'Will you be adding more cities?',
    answer: 'Yes! We\'re actively expanding to more cities and states. If you\'d like to see your city added, let us know — we prioritize cities with the most demand.',
  },
];

// ── Dynamic week/newsletter helper ───────────────────────────────────────────
function getWeekInfo() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const sun = new Date(today);
  sun.setDate(today.getDate() - day);
  const sat = new Date(sun);
  sat.setDate(sun.getDate() + 6);

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

  return { weekRange: `${sunStr} – ${satStr}`, nextMonStr, vol: weekNum };
}

function HomepageFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
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

export function Homepage({ cityCounts = {} }: { cityCounts?: Record<string, number> }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const weekInfo = getWeekInfo();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SEOHead
        title="Local Business Calendars | Free Business & Networking Event Calendars by City"
        description="Local Business Calendars is a free network of business event calendars organized by city. Find networking events, chamber meetings, tech meetups, real estate events, and small business gatherings in your city."
      />
      <Navigation />

      <section className="hero">
        <div className="hero-inner">

          {/* Left column */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              THIS WEEK IN TEXAS &middot; {Object.values(cityCounts).reduce((a, b) => a + b, 0)} EVENTS
            </div>

            <h1>
              Find the events where local business <em>actually</em> happens.
            </h1>

            <p className="hero-sub">
              Networking mixers, chamber events, real-estate gatherings, tech meetups — browse the full calendar free and get every event delivered to your inbox every Monday.
            </p>

            <div className="hero-cta-group">
              <Link href="/subscribe" className="btn btn-gold">
                Sign Up Free — Pick Your City
              </Link>
            </div>

            <p className="hero-trust">
              Free forever&nbsp;&middot;&nbsp;No credit card
            </p>
          </div>

          {/* Right column — city panel */}
          <div className="hero-right">
            <div className="hero-city-panel">
              <div className="hero-city-panel-header">THIS WEEK, BY CITY</div>
              <ul className="hero-city-panel-list">
                <li className="hero-city-panel-row">
                  <Link href="/texas/san-antonio" className="hero-city-panel-link">
                    <span className="hero-city-panel-name">San Antonio</span>
                    <span className="hero-city-panel-count">{cityCounts['San Antonio'] ?? 0} events</span>
                  </Link>
                </li>
                <li className="hero-city-panel-row">
                  <Link href="/texas/austin" className="hero-city-panel-link">
                    <span className="hero-city-panel-name">Austin</span>
                    <span className="hero-city-panel-count">{cityCounts['Austin'] ?? 0} events</span>
                  </Link>
                </li>
                <li className="hero-city-panel-row">
                  <Link href="/texas/dallas" className="hero-city-panel-link">
                    <span className="hero-city-panel-name">Dallas</span>
                    <span className="hero-city-panel-count">{cityCounts['Dallas'] ?? 0} events</span>
                  </Link>
                </li>
                <li className="hero-city-panel-row">
                  <Link href="/texas/houston" className="hero-city-panel-link">
                    <span className="hero-city-panel-name">Houston</span>
                    <span className="hero-city-panel-count">{cityCounts['Houston'] ?? 0} events</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom editorial strip */}
        <div className="hero-strip">
          <span>WEEK {weekInfo.vol} &middot; {weekInfo.weekRange}</span>
          <span className="hero-strip-divider">|</span>
          <span>NEXT NEWSLETTER: {weekInfo.nextMonStr} &middot; 6:00 A.M. CT</span>
          <span className="hero-strip-divider">|</span>
          <span>TRACKED ORGANIZATIONS: 800+</span>
        </div>
      </section>


<section className="features-section">
        <div className="features-inner">
          <h2>We Do the Searching So You Don't Have To</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Choose your city</h3>
              <p>Pick your city from our local calendars. We handle all the event research so you don't have to.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning your newsletter arrives with every upcoming networking event and business gathering in your city — delivered straight to your inbox so you never have to remember to check.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events &amp; show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-intro-section">
        <div className="hp-intro-inner">
          <p>
            Local Business Calendars is a free network of city-specific event calendars built for entrepreneurs, connectors, and community leaders. Browse networking events, chamber meetings, tech meetups, real estate gatherings, and small business events happening in your city — updated every week.
          </p>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <p className="sp-overline">BY THE NUMBERS &middot; TEXAS, 2026</p>
          <h2>
            Local Business Calendars is read by professionals across{' '}
            <em>every major Texas metro</em> — and we&rsquo;re just getting started.
          </h2>

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
        heading="Why Use Local Business Calendars?"
        subtitle="Business events are spread across too many platforms and websites. Here's how Local Business Calendars helps you keep up."
        problemText="Business events are spread across Eventbrite, Meetup, LinkedIn, chambers, and associations. Finding the right ones takes time."
        whatWeDoText="We track local business event hosts and organize their public events into one local calendar and weekly newsletter."
        whatYouGetText="The full calendar is free — browse anytime. Sign up for the Monday newsletter and every upcoming event in your city arrives in your inbox automatically."
      />

      <EventNetworkingMethodSection />

      {/* ── Sponsor teaser ── */}
      <section className="hp-sponsor-teaser">
        <div className="hp-sponsor-teaser-inner">
          <div className="hp-sponsor-teaser-label">Community Supported</div>
          <h2>Local Business Calendars Is Free — and Sponsors Make That Possible</h2>
          <p>Every week, thousands of business professionals across Texas use this calendar to find events, stay connected, and grow their network. Sponsors keep it free for everyone. Each city has four category sponsors — Chamber, Real Estate, Technology, and Small Business. Each sponsor owns their category exclusively, with visibility across all city content and a direct connection to the professionals who follow that space.</p>
          <div className="hp-sponsor-city-list">
            {([
              { city: 'San Antonio', cats: 'Chamber · Real Estate · Technology · Small Business' },
              { city: 'Austin',      cats: 'Chamber · Real Estate · Technology · Small Business' },
              { city: 'Dallas',      cats: 'Chamber · Real Estate · Technology · Small Business' },
              { city: 'Houston',     cats: 'Chamber · Real Estate · Technology · Small Business' },
            ] as const).map(({ city, cats }) => (
              <div key={city} className="hp-sponsor-city-row">
                <div className="hp-sponsor-city-left">
                  <span className="hp-sponsor-city-name">{city}</span>
                  <span className="hp-sponsor-city-cats">{cats}</span>
                </div>
                <Link href="/sponsor" className="hp-sponsor-city-cta">4 spots open →</Link>
              </div>
            ))}
          </div>
          <Link href="/sponsor" className="hp-sponsor-teaser-btn">
            Learn About Sponsorship →
          </Link>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Local Business Calendars</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <HomepageFaqItem
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

      <Footer variant="homepage" />
    </div>
  );
}
