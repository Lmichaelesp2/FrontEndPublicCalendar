import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, CalendarDays, Search, Mail, Monitor, Users, Clock, ArrowLeft } from 'lucide-react';
import { Navigation } from '../Navigation';
import { CityLoginBanner } from '../CityLoginBanner';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { Calendar } from '../Calendar';

const TECH_STATS = [
  { number: '100+', label: 'Tech events added monthly' },
  { number: '2,500+', label: 'Tech professionals subscribed' },
  { number: '50+', label: 'Tech organizations tracked' },
];

const TECH_TESTIMONIALS = [
  {
    quote: "I finally have one place for all the tech meetups and hackathons in San Antonio. No more scrolling through five different platforms.",
    name: 'David R.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The weekly tech events email is a game-changer. I've attended more meetups in the last month than I did all last year.",
    name: 'Priya K.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a startup founder, staying plugged into the SA tech scene is critical. This calendar makes it effortless.",
    name: 'Carlos G.',
    location: 'San Antonio, TX',
  },
];

const TECH_FAQ = [
  {
    question: 'What types of technology events are listed?',
    answer: 'We track software development meetups, cybersecurity events, data science workshops, AI/ML gatherings, startup pitch nights, tech networking mixers, hackathons, cloud computing sessions, and more across San Antonio.',
  },
  {
    question: 'Is this calendar free?',
    answer: 'Yes! The San Antonio technology events calendar and weekly email are completely free — no credit card required.',
  },
  {
    question: 'How is this different from the main San Antonio calendar?',
    answer: 'The main San Antonio calendar shows all business and networking events. This page focuses exclusively on technology-related events, making it easier for tech professionals to find what matters most to them.',
  },
  {
    question: 'How do you find technology events in San Antonio?',
    answer: 'We monitor tech-focused organizations like Tech Bloc, Codeup, SA Developers, local tech Meetup groups, Geekdom, and many more — plus Eventbrite, LinkedIn, and Facebook tech communities in the San Antonio area.',
  },
  {
    question: 'Can I submit a technology event?',
    answer: 'Yes! Use our Submit Event page to add your tech event to the calendar for free. Just make sure to categorize it as a technology event.',
  },
  {
    question: 'Do you cover cybersecurity events?',
    answer: 'Absolutely. San Antonio is one of the nation\'s top cybersecurity hubs, and we actively track events from organizations like CyberTexas, ISSA San Antonio, and military-adjacent tech groups.',
  },
];

const TECH_EVENT_TYPES = [
  'Software development meetups',
  'Cybersecurity conferences & workshops',
  'AI / Machine Learning events',
  'Startup pitch nights & demo days',
  'Tech networking mixers',
  'Hackathons & coding events',
  'Cloud & DevOps workshops',
  'Data science & analytics meetups',
];

const TECH_ORGS = [
  'Tech Bloc',
  'Geekdom',
  'Codeup',
  'SA Developers',
  'CyberTexas Foundation',
  'ISSA San Antonio',
  'Women in Cybersecurity SA',
  'Google Developer Group SA',
  'SA Data Science',
  'Open Cloud Academy',
  'Rivard Report Tech',
  '... and many more',
];

function TechFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
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

function SanAntonioTechnologyContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Technology Events in San Antonio, TX | Texas Business Calendars"
        description="Find tech meetups, cybersecurity events, hackathons, AI workshops, and developer gatherings in San Antonio, Texas. Updated weekly."
      />

      <Navigation />
      <CityLoginBanner cityName="San Antonio" />

      <section className="sa-hero">
        <div className="sa-hero-inner">
          <Link
            to="/san-antonio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.4rem',
              color: 'rgba(255,255,255,.7)',
              fontSize: '.85rem',
              fontWeight: 500,
              textDecoration: 'none',
              marginBottom: '1rem',
              transition: 'color .2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,.7)'}
          >
            <ArrowLeft size={16} />
            All San Antonio Events
          </Link>
          <div className="hero-badge">
            <span className="dot" style={{ background: '#22d3ee' }}></span>
            San Antonio Technology Calendar
          </div>
          <h1>
            Technology Events
            <br />
            in <em>San Antonio</em>
          </h1>
          <p className="sa-hero-sub">
            Get your San Antonio tech events delivered to your inbox every Monday — free. Browse the calendar anytime between emails.
          </p>
          <Link to="/san-antonio/subscribe" className="btn btn-gold">
            Get the FREE Weekly Email
          </Link>
          <p className="hero-note">No credit card required · Unsubscribe anytime</p>
        </div>
      </section>

      <section className="value-section">
        <div className="value-inner">
          <h2>San Antonio's Tech Scene, One Calendar</h2>
          <p>Tech events in San Antonio are scattered across Meetup, Eventbrite, LinkedIn, Geekdom, and dozens of local groups. We bring them together so you don't miss a thing.</p>
        </div>
      </section>

      <section className="sa-value-strip">
        <div className="sa-value-strip-inner">
          <div className="sa-value-strip-item">
            <div className="sa-strip-icon"><Monitor size={28} strokeWidth={1.8} /></div>
            <div>
              <strong>Tech-Focused</strong>
              <p>Curated specifically for developers, engineers, cybersecurity pros, data scientists, and tech entrepreneurs.</p>
            </div>
          </div>
          <div className="sa-value-strip-item">
            <div className="sa-strip-icon"><Search size={28} strokeWidth={1.8} /></div>
            <div>
              <strong>Easy to Browse</strong>
              <p>Search by keyword, browse by date, and find the right tech events for your schedule.</p>
            </div>
          </div>
          <div className="sa-value-strip-item">
            <div className="sa-strip-icon"><Mail size={28} strokeWidth={1.8} /></div>
            <div>
              <strong>Weekly Tech Roundup</strong>
              <p>Get a Monday email with the week's tech events in San Antonio. Never miss a meetup again.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Why a Separate Tech Calendar?</h2>
          <p className="why-subtitle">San Antonio is one of the fastest-growing tech hubs in Texas. With military cyber operations, a booming startup ecosystem, and major tech employers, there's no shortage of events — but finding them is the hard part.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>Tech events are buried across Meetup groups, Eventbrite, LinkedIn, Slack channels, and individual org websites. It's impossible to track them all.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We monitor San Antonio's top tech organizations and platforms, then organize their events into one focused calendar updated weekly.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>A single source for tech events in San Antonio — from coding meetups to cybersecurity conferences to startup pitch nights.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>How It Works</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Monitor size={40} strokeWidth={2} /></div>
              <h3>Tech events only</h3>
              <p>This calendar filters out everything except technology-related events in San Antonio.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Browse & search</h3>
              <p>Use the calendar or search by keyword to find hackathons, meetups, workshops, and more.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Get weekly reminders</h3>
              <p>Subscribe free and get a Monday email with San Antonio tech opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Tech Event</h2>
          <p>Browse developer meetups, cybersecurity events, hackathons, and more</p>
        </div>
        <Calendar forcedCity="San Antonio" eventCategory="technology" />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>San Antonio Tech Organizations We Track</h2>
          <p>We monitor events from San Antonio's top technology communities so nothing slips through the cracks.</p>
          <div className="sa-orgs-grid">
            {TECH_ORGS.map((org, i) => (
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
          <h2>Trusted by San Antonio Tech Professionals</h2>
          <p className="sp-subtitle">Numbers from across the Texas Business Calendars network.</p>
          <div className="sp-stats">
            {TECH_STATS.map((stat) => (
              <div key={stat.label} className="sp-stat">
                <span className="sp-stat-number">{stat.number}</span>
                <span className="sp-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="sp-testimonials">
            {TECH_TESTIMONIALS.map((t) => (
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
          <p>Get San Antonio's best technology events delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit a Tech Event</Link>
            <Link to="/san-antonio/subscribe" className="btn btn-gold">Get the Weekly Email — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {TECH_FAQ.map((item, i) => (
              <TechFaqItem
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

export function SanAntonioTechnologyPage() {
  return <SanAntonioTechnologyContent />;
}
