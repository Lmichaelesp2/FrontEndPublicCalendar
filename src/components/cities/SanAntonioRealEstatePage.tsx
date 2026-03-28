import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, Search, Mail, Home, Users, Clock, CalendarDays, Building2 } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';

const STATS = [
  { number: '80+', label: 'Real estate events added monthly' },
  { number: '1,800+', label: 'Real estate professionals subscribed' },
  { number: '40+', label: 'Real estate organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "I used to miss half the SABOR events and investor meetups. Now everything is in one place and I never fall behind.",
    name: 'Rachel T.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The weekly real estate events newsletter keeps me in the loop on open houses, networking lunches, and CE classes without any effort.",
    name: 'James W.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a commercial broker, staying connected to the SA real estate community is everything. This calendar makes it automatic.",
    name: 'Linda M.',
    location: 'San Antonio, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of real estate events are listed?',
    answer: 'We track investor meetups, SABOR events, broker open houses, real estate networking mixers, continuing education classes, property tours, market update seminars, and more across San Antonio.',
  },
  {
    question: 'Is this calendar free?',
    answer: 'Yes! The San Antonio real estate events calendar and weekly newsletter are completely free — no credit card required.',
  },
  {
    question: 'How is this different from the main San Antonio calendar?',
    answer: 'The main San Antonio calendar shows all business and networking events. This page focuses exclusively on real estate events, making it easier for agents, brokers, investors, and property professionals to find what matters most.',
  },
  {
    question: 'How do you find real estate events in San Antonio?',
    answer: 'We monitor SABOR, local REI groups, CCIM, IREM, real estate Meetup groups, Eventbrite, LinkedIn, and Facebook real estate communities in the San Antonio area.',
  },
  {
    question: 'Can I submit a real estate event?',
    answer: 'Yes! Use our Submit Event page to add your real estate event to the calendar for free. Just make sure to categorize it as a real estate event.',
  },
  {
    question: 'Do you cover investor meetups?',
    answer: 'Absolutely. San Antonio has a very active real estate investment community and we track events from local REI clubs, wholesaler meetups, and multifamily networking groups.',
  },
];

const EVENT_TYPES = [
  'Real estate networking mixers',
  'Investor meetups & REI clubs',
  'SABOR events & CE classes',
  'Broker open houses & tours',
  'Market update seminars',
  'Commercial real estate events',
  'Property management workshops',
  'First-time homebuyer events',
];

const ORGS = [
  'SABOR',
  'SA Real Estate Investors',
  'CCIM South Texas',
  'IREM San Antonio',
  'SA Apartment Association',
  'Women\'s Council of Realtors SA',
  'SA Commercial Brokers Assoc.',
  'Texas Realtors SA Chapter',
  'Keller Williams SA Events',
  'SA REI Meetup Group',
  'Alamo Area Landlords',
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

function SanAntonioRealEstateContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Real Estate Events in San Antonio, TX | Texas Business Calendars"
        description="Find real estate networking events, investor meetups, SABOR events, broker tours, and CE classes in San Antonio, Texas. Updated weekly."
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Real Estate Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="dot" style={{ background: '#f59e0b' }}></span>
            San Antonio Real Estate Calendar
          </div>
          <h1>
            Real Estate Events in
            <br />
            the <em>San Antonio</em> area
          </h1>
          <p className="hero-subtext">
            Stop missing the events that grow your network and your business.
          </p>
          <div className="hero-cta-group">
            <Link to="/texas/san-antonio/subscribe" className="btn btn-white">
              Get My Free San Antonio Real Estate Events Newsletter
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
          <p className="features-subtitle">We aggregate real estate event sources across San Antonio so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Real Estate Events</h3>
              <p>Click subscribe above. Enter your email address. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's real estate networking events, investor meetups, and property tours in San Antonio.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events & show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Why a Separate Real Estate Calendar?</h2>
          <p className="why-subtitle">San Antonio is one of the hottest real estate markets in Texas. With military relocations, explosive population growth, and active investor communities, there's no shortage of events — but finding them is the hard part.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>Real estate events are buried across SABOR, Meetup groups, Eventbrite, LinkedIn, and individual brokerage websites. It's impossible to track them all.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We monitor San Antonio's top real estate organizations and platforms, then organize their events into one focused calendar updated weekly.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>A single source for real estate events in San Antonio — from investor meetups to SABOR classes to broker networking events.</p>
            </div>
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
              <p>Sign up for San Antonio real estate events and get that week's investor meetups, SABOR events, and tours in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse San Antonio's real estate events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what's coming up in the real estate community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Real Estate Event</h2>
          <p>Browse investor meetups, SABOR events, broker tours, and more</p>
        </div>
        <EventGate forcedCity="San Antonio" eventCategory="real_estate" />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>San Antonio Real Estate Organizations We Track</h2>
          <p>We monitor events from San Antonio's top real estate communities so nothing slips through the cracks.</p>
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

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by San Antonio Real Estate Professionals</h2>
          <p className="sp-subtitle">Numbers from across the Texas Business Calendars network.</p>
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

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Don't Want to Check Back Every Week?</h2>
          <p>Get San Antonio's best real estate events delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit a Real Estate Event</Link>
            <Link to="/texas/san-antonio/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
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

      <Footer />
    </div>
  );
}

export function SanAntonioRealEstatePage() {
  return <SanAntonioRealEstateContent />;
}
