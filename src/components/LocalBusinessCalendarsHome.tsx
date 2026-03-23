import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, CalendarDays, Mail, MapPin, Search } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { SocialProof } from './SocialProof';

const STATS = [
  { number: '500+', label: 'Events every week' },
  { number: '5,000+', label: 'Professionals subscribed' },
  { number: '800+', label: 'Organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Finally, all the networking events in one place. No more missing out because I didn't know something was happening in my city.",
    name: 'Sarah M.',
    location: 'Texas',
  },
  {
    quote: "This calendar has become essential for growing my professional network. The weekly email alone saves me hours searching multiple sites.",
    name: 'Marcus T.',
    location: 'Texas',
  },
  {
    quote: "I used to check multiple sites separately. Now I just check one place and never miss an event that matters to me.",
    name: 'Jennifer L.',
    location: 'Texas',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Which cities do you currently cover?',
    answer: 'We currently serve San Antonio, Austin, Dallas, and Houston, Texas. More states and cities are coming soon.',
  },
  {
    question: 'Is Local Business Calendars free?',
    answer: 'Yes! The calendars and weekly newsletters are completely free — no credit card required. We\'re building this to help professionals never miss important networking events.',
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer: 'Those platforms only show events posted on their own site. We gather business events from all major platforms and local organizations into one calendar, giving you a complete picture of what\'s happening in your city.',
  },
  {
    question: 'How do I subscribe to a city calendar?',
    answer: 'Click on your state and city, then sign up with your email. You\'ll get a weekly digest every Monday morning with that week\'s best business and networking events.',
  },
  {
    question: 'Will you be adding more cities?',
    answer: 'Yes! We\'re actively expanding to more cities and states. Submit your city through our contact page to let us know where to prioritize next.',
  },
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

export function LocalBusinessCalendarsHome() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="home-page">
      <SEOHead
        title="Local Business Calendars | Free Business & Networking Event Calendars by City"
        description="Local Business Calendars is a free network of business event calendars organized by city. Find networking events, chamber meetings, tech meetups, and more."
      />

      <Navigation />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">YOUR LOCAL BUSINESS EVENTS NETWORK</div>
          <h1>Local Business Calendars — Find Business & Networking Events in Your City</h1>
          <p className="hero-subtext">Stop missing the events that grow your network and your business.</p>

          <nav className="hero-cities" aria-label="Browse by state">
            <div className="hero-cities-row">
              <Link to="/texas" className="hero-state-link">
                <span className="hero-city-name">Texas</span>
                <span className="hero-city-subscribe">Sign up free</span>
              </Link>
            </div>
          </nav>

          <p className="hero-subtext-more">More states coming soon</p>
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
          <p className="features-subtitle">We aggregate business events across cities so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

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
              <h3>Pick events & show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-inner">
          <p>Local Business Calendars is a network of free local business event calendars organized by city. We aggregate networking events, chamber of commerce meetings, technology meetups, real estate gatherings, and small business events — so professionals never miss the events that grow their network and their business. Currently serving San Antonio, Austin, Dallas, and Houston, Texas.</p>
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

      <section className="states-section">
        <div className="states-inner">
          <h2>Choose Your State</h2>
          <div className="states-grid">
            <Link to="/texas" className="state-card">
              <div className="state-card-header">
                <h3>Texas Business Calendars</h3>
                <p>San Antonio · Austin · Dallas · Houston</p>
              </div>
            </Link>
          </div>
          <p className="states-coming-soon">More states coming soon</p>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-inner">
          <div className="stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
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

      <SocialProof testimonials={TESTIMONIALS} />

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Local Business Calendars</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
                open={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
