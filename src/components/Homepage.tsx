import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Mail, MapPin, Search, Star, Plus, Minus, Globe } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

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
    answer: 'We currently cover San Antonio, Austin, Dallas, and Houston, Texas. Each city has its own dedicated calendar with locally sourced business and networking events.',
  },
  {
    question: 'Is Local Business Calendars free?',
    answer: 'Yes! The calendar and weekly email are completely free — no credit card required. Browse events anytime or subscribe to get a curated digest every Monday morning.',
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer: 'Those platforms only show events posted on their own site. We gather networking and business events from all major platforms and local organizations into one calendar per city, giving you a complete picture of what\'s happening.',
  },
  {
    question: 'How do I subscribe to a city calendar?',
    answer: 'Choose your state, pick your city, and enter your email. That\'s it — no account, no credit card, no setup. You\'ll receive a curated email every Monday morning with that week\'s best events.',
  },
  {
    question: 'Will you be adding more cities?',
    answer: 'Yes! We\'re actively expanding to more cities and states. If you\'d like to see your city added, let us know — we prioritize cities with the most demand.',
  },
];

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

export function Homepage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <div className="hero-badge">Your Local Business Events Network</div>

          <h1>
            Local Business Calendars — Find Business &amp; Networking Events
            <br />
            in <em>Your City</em>
          </h1>

          <p className="hero-subtext">
            Stop missing the events that grow your network and your business.
          </p>

          <nav className="hero-cities" aria-label="Browse by state">
            <div className="hp-state-cards">
              <Link to="/texas/" className="hp-state-card">
                <div className="hp-state-icon">
                  <Globe size={28} strokeWidth={1.8} />
                </div>
                <span className="hero-city-name">Texas</span>
                <span className="hero-city-subscribe">Sign up free</span>
              </Link>
            </div>
            <p className="hp-coming-soon">More states coming soon</p>
          </nav>

          <p className="hero-subtext-below">Browse the calendar anytime between event newsletters. Always free.</p>
        </div>
      </section>

      <section className="benefits-bar">
        <div className="benefits-bar-inner">
          <div className="benefit-item">
            <div className="benefit-icon">
              <CalendarDays size={20} strokeWidth={2} />
            </div>
            <span>Calendars in multiple cities</span>
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
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Pick your state</h3>
              <p>Choose your state and city. We handle all the event research so you don't have to.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's networking events and business gatherings in your city.</p>
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
            Local Business Calendars is a network of free local business event calendars organized by city.
            We aggregate networking events, chamber of commerce meetings, technology meetups, real estate
            gatherings, and small business events — so professionals never miss the events that grow their
            network and their business. Currently serving San Antonio, Austin, Dallas, and Houston, Texas.
          </p>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Why Use Local Business Calendars?</h2>
          <p className="why-subtitle">Most professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>Business events are spread across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and associations. It takes time to find what's worth attending.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We track business event hosts and organize their public events into one simple calendar per city — updated weekly.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>Faster discovery, fewer missed opportunities, and a weekly reminder that keeps you consistent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-states-section">
        <div className="hp-states-inner">
          <h2>Choose Your State</h2>
          <div className="hp-states-grid">
            <Link to="/texas/" className="hp-state-feature-card">
              <div className="hp-state-feature-bg">
                <img
                  src="https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Texas city skyline"
                />
                <div className="hp-state-feature-overlay" />
              </div>
              <div className="hp-state-feature-content">
                <h3>Texas Business Calendars</h3>
                <p>San Antonio &middot; Austin &middot; Dallas &middot; Houston</p>
              </div>
            </Link>
          </div>
          <p className="hp-more-states">More states coming soon</p>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss an Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><MapPin size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for your city and get that week's business events in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse your city's business events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The email and the calendar work together so you always know what's coming up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by Business Professionals Across Texas</h2>

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
