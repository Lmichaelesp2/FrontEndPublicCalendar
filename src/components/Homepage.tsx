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

  // Vol number anchored to week starting Sun Apr 12, 2026
  const anchor = new Date('2026-04-12');
  const weekNum = Math.floor((sun.getTime() - anchor.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

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
              Networking mixers, chamber events, real-estate gatherings, tech meetups — sign up free to see full event details and get every event in your Monday newsletter.
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
          <span>VOL. {weekInfo.vol} &middot; {weekInfo.weekRange}</span>
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
              <p>Every Monday morning your newsletter arrives with every upcoming networking event and business gathering in your city. Sign up free and full event details are unlocked on the calendar too.</p>
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
        whatYouGetText="Full event details unlocked on the calendar the moment you sign up, plus every upcoming event in your Monday newsletter."
      />

      <EventNetworkingMethodSection />

      {/* ── Sponsor teaser ── */}
      <section className="hp-sponsor-teaser">
        <div className="hp-sponsor-teaser-inner">
          <div className="hp-sponsor-teaser-left">
            <div className="hp-sponsor-teaser-label">Sponsorship</div>
            <h2>Put Your Brand in Front of Local Business Professionals</h2>
            <p>Each city calendar has one exclusive sponsor slot — your brand in the weekly newsletter, every Monday, to an audience that shows up.</p>
            <Link href="/sponsor" className="hp-sponsor-teaser-btn">
              See How It Works →
            </Link>
          </div>
          <div className="hp-sponsor-teaser-cards">
            {(['San Antonio', 'Austin', 'Dallas', 'Houston'] as const).map((city) => (
              <div key={city} className="hp-sponsor-teaser-card">
                <div className="hp-sponsor-teaser-card-city">{city}</div>
                <div className="hp-sponsor-teaser-card-slot">
                  <div className="hp-sponsor-teaser-card-tag">CITY CALENDAR SPONSOR</div>
                  <div className="hp-sponsor-teaser-card-name">Your Brand Here</div>
                </div>
              </div>
            ))}
          </div>
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
