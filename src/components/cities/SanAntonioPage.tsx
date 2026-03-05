import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, CalendarDays, Search, Mail, Building2, Users, Clock, Monitor, Home, Landmark, Briefcase } from 'lucide-react';
import { Navigation } from '../Navigation';
import { CityLoginBanner } from '../CityLoginBanner';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { Calendar } from '../Calendar';
import SponsorSection from '../SponsorSection';

const SA_STATS = [
  { number: '500+', label: 'Events added monthly' },
  { number: '5,000+', label: 'Professionals subscribed' },
  { number: '800+', label: 'Business organizations tracked' },
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

function SanAntonioContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Networking & Business Events in San Antonio, TX | Texas Business Calendars"
        description="Find networking events, business mixers, chamber meetings, and professional development opportunities in San Antonio, Texas. Updated weekly with the latest events."
      />

      <Navigation />
      <CityLoginBanner cityName="San Antonio" />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            San Antonio Business Calendar
          </div>
          <h1>
            Business Events in
            <br />
            <em>San Antonio</em>
          </h1>
          <p className="hero-subtext">
            Stop missing the networking events that grow your business.
          </p>
          <Link to="/san-antonio/subscribe" className="btn btn-gold">
            Get the FREE Weekly Email
          </Link>
          <p className="hero-note">No credit card required · Unsubscribe anytime</p>
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
          <p className="features-subtitle">We aggregate sources across San Antonio so you don't have to — then deliver the best event opportunities straight to your email every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to San Antonio</h3>
              <p>Click subscribe above. Enter your email. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday email</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's networking events, meetups, and business gatherings in San Antonio.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events & show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="sa-category-nav">
        <div className="sa-category-nav-inner">
          <span className="sa-category-nav-label">Browse by category:</span>
          <div className="sa-category-nav-links">
            <Link to="/san-antonio/technology" className="sa-category-link">
              <Monitor size={16} />
              Technology
            </Link>
            <Link to="/san-antonio/real-estate" className="sa-category-link">
              <Home size={16} />
              Real Estate
            </Link>
            <Link to="/san-antonio/chamber" className="sa-category-link">
              <Landmark size={16} />
              Chamber
            </Link>
            <Link to="/san-antonio/small-business" className="sa-category-link">
              <Briefcase size={16} />
              Small Business
            </Link>
          </div>
        </div>
      </div>

      <section className="why-section">
        <div className="why-inner">
          <h2>Why Use Texas Business Calendars?</h2>
          <p className="why-subtitle">Most San Antonio professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>San Antonio events are spread across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and associations. It takes time to find what's worth attending.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We track San Antonio business event hosts — from the SA Chamber to local entrepreneur groups — and organize their public events into one simple calendar.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>Faster discovery, fewer missed opportunities, and a weekly reminder that keeps your San Antonio networking consistent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss an Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Building2 size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly email</h3>
              <p>Sign up for San Antonio and get that week's business events in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse San Antonio's business events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The email and the calendar work together so you always know what's coming up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Event</h2>
          <p>Browse networking events, business mixers, lunch-and-learns, and more</p>
        </div>
        <Calendar forcedCity="San Antonio" />
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

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Don't Want to Check Back Every Week?</h2>
          <p>Get the full week's San Antonio events delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit an Event</Link>
            <Link to="/san-antonio/subscribe" className="btn btn-gold">Get the Weekly Email — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for Austin · Dallas · Houston</p>
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

      <Footer />
    </div>
  );
}

export function SanAntonioPage() {
  return <SanAntonioContent />;
}
