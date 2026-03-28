import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, CalendarDays, Search, Mail, Monitor, Users, Clock, AlertTriangle, Target } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';

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
    quote: "The weekly tech events newsletter is a game-changer. I've attended more meetups in the last month than I did all last year.",
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
    answer: 'Yes! The San Antonio technology events calendar and weekly newsletter are completely free — no credit card required.',
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
        title="San Antonio Technology Events Calendar | Free Weekly Tech Events Email"
        description="Find tech meetups, cybersecurity events, hackathons, AI workshops, and developer gatherings in San Antonio, Texas. Updated weekly."
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Technology Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            San Antonio Technology Calendar
          </div>
          <h1>
            Technology Events in
            <br />
            the <em>San Antonio</em> area
          </h1>
          <p className="hero-subtext">
            Stop missing the events that grow your network and your career.
          </p>
          <div className="hero-category-tags">
            Technology &middot; Software &middot; Startups &middot; Dev Meetups &middot; Tech Talks &middot; and more
          </div>
          <div className="hero-cta-group">
            <Link to="/texas/san-antonio/subscribe" className="btn btn-white">
              Get My Free San Antonio Technology Events Newsletter
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
            <span>Tech events aggregated every week</span>
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
          <p className="features-subtitle">We aggregate tech sources across San Antonio so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to San Antonio Tech</h3>
              <p>Click subscribe above. Enter your email address. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's tech meetups, hackathons, and developer gatherings in San Antonio.</p>
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
          <h2>Why a Separate Tech Calendar?</h2>
          <p className="why-subtitle">San Antonio is one of the fastest-growing tech hubs in Texas. With military cyber operations, a booming startup ecosystem, and major tech employers, there's no shortage of events — but finding them is the hard part.</p>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon"><AlertTriangle size={26} strokeWidth={2} /></div>
              <h3>The problem</h3>
              <p>Tech events are buried across Meetup groups, Eventbrite, LinkedIn, Slack channels, and individual org websites. It's impossible to track them all.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Target size={26} strokeWidth={2} /></div>
              <h3>What we do</h3>
              <p>We monitor San Antonio's top tech organizations and platforms, then organize their events into one focused calendar updated weekly.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Star size={26} strokeWidth={2} /></div>
              <h3>What you get</h3>
              <p>A single source for tech events in San Antonio — from coding meetups to cybersecurity conferences to startup pitch nights.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss a Tech Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Monitor size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for San Antonio tech events and get that week's opportunities in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse San Antonio's tech events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what's coming up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Tech Event</h2>
          <p>Browse developer meetups, cybersecurity events, hackathons, and more</p>
        </div>
        <EventGate forcedCity="San Antonio" eventCategory="technology" />
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
            <Link to="/texas/san-antonio/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
        </div>
      </section>

      <section className="sa-category-nav">
        <div className="sa-category-nav-inner">
          <span className="sa-category-nav-label">Also in San Antonio:</span>
          <div className="sa-category-nav-links">
            <Link to="/texas/san-antonio/real-estate" className="sa-category-link">Real Estate Events</Link>
            <Link to="/texas/san-antonio/chamber" className="sa-category-link">Chamber Events</Link>
            <Link to="/texas/san-antonio/small-business" className="sa-category-link">Small Business Events</Link>
            <Link to="/texas/san-antonio/networking" className="sa-category-link">Networking Events</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link to="/texas/san-antonio">See all San Antonio business events &rarr;</Link>
      </div>

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
