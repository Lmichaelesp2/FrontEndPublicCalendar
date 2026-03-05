import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, Search, Mail, Landmark, Users, Clock, ArrowLeft, CalendarDays, Building2 } from 'lucide-react';
import { Navigation } from '../Navigation';
import { CityLoginBanner } from '../CityLoginBanner';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { Calendar } from '../Calendar';

const STATS = [
  { number: '60+', label: 'Chamber events added monthly' },
  { number: '1,500+', label: 'Chamber members subscribed' },
  { number: '25+', label: 'Chambers & associations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Between the SA Chamber, Hispanic Chamber, and North SA Chamber, I was checking three different websites every week. Now it's all in one calendar.",
    name: 'Patricia H.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The weekly chamber events email is exactly what I needed. I show up to more ribbon cuttings and luncheons than ever before.",
    name: 'Robert D.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a chamber ambassador, having every chamber event across San Antonio in one view has been incredibly valuable for planning my week.",
    name: 'Angela S.',
    location: 'San Antonio, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of chamber events are listed?',
    answer: 'We track chamber luncheons, ribbon cuttings, Business After Hours mixers, ambassador meetings, legislative updates, annual galas, and more from chambers and business associations across San Antonio.',
  },
  {
    question: 'Is this calendar free?',
    answer: 'Yes! The San Antonio chamber events calendar and weekly email are completely free — no credit card required.',
  },
  {
    question: 'How is this different from the main San Antonio calendar?',
    answer: 'The main San Antonio calendar shows all business and networking events. This page focuses exclusively on chamber of commerce and business association events, making it easier to track the organizations that matter most to you.',
  },
  {
    question: 'Which chambers do you track?',
    answer: 'We monitor the San Antonio Chamber of Commerce, North SA Chamber, Hispanic Chamber, African American Chamber, Asian Chamber, Women\'s Chamber, and many more regional and industry-specific chambers in the area.',
  },
  {
    question: 'Can I submit a chamber event?',
    answer: 'Yes! Use our Submit Event page to add your chamber event to the calendar for free. Just make sure to categorize it as a chamber event.',
  },
  {
    question: 'Do you cover Business After Hours events?',
    answer: 'Absolutely. Business After Hours, luncheons, ribbon cuttings, and all regularly scheduled chamber events are tracked from every major San Antonio chamber we monitor.',
  },
];

const EVENT_TYPES = [
  'Chamber luncheons & breakfasts',
  'Business After Hours mixers',
  'Ribbon cuttings & grand openings',
  'Ambassador committee meetings',
  'Legislative update sessions',
  'Annual galas & award ceremonies',
  'New member orientations',
  'Multi-chamber joint events',
];

const ORGS = [
  'SA Chamber of Commerce',
  'North SA Chamber',
  'Hispanic Chamber SA',
  'African American Chamber',
  'Asian Chamber SA',
  'Women\'s Chamber SA',
  'Alamo City Chamber',
  'Randolph Metrocom Chamber',
  'South SA Chamber',
  'Boerne Chamber',
  'New Braunfels Chamber',
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

function SanAntonioChamberContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Chamber of Commerce Events in San Antonio, TX | Texas Business Calendars"
        description="Find chamber luncheons, Business After Hours, ribbon cuttings, and business association events in San Antonio, Texas. Updated weekly."
      />

      <Navigation />
      <CityLoginBanner cityName="San Antonio" />

      <section className="hero">
        <div className="hero-inner">
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
            <span className="dot" style={{ background: '#10b981' }}></span>
            San Antonio Chamber Calendar
          </div>
          <h1>
            Chamber Events in
            <br />
            <em>San Antonio</em>
          </h1>
          <p className="hero-subtext">
            Stop missing the chamber events that grow your network.
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
          <p className="features-subtitle">We aggregate chamber event sources across San Antonio so you don't have to — then deliver the best event opportunities straight to your email every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Chamber Events</h3>
              <p>Click subscribe above. Enter your email. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday email</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's chamber luncheons, Business After Hours, and ribbon cuttings in San Antonio.</p>
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
          <h2>Why a Separate Chamber Calendar?</h2>
          <p className="why-subtitle">San Antonio has one of the most active chamber networks in Texas. With multiple chambers serving different communities and industries, keeping track of all their events can feel like a full-time job.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>Each chamber has its own website, email list, and event calendar. If you belong to multiple chambers, you're checking multiple places every week.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We monitor every major chamber and business association in the San Antonio area and consolidate their events into one unified calendar.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>A single source for chamber events in San Antonio — from ribbon cuttings to Business After Hours to annual galas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss a Chamber Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Building2 size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly email</h3>
              <p>Sign up for San Antonio chamber events and get that week's luncheons, Business After Hours, and ribbon cuttings in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse San Antonio's chamber and association events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The email and the calendar work together so you always know what's coming up in the chamber community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Chamber Event</h2>
          <p>Browse luncheons, Business After Hours, ribbon cuttings, and more</p>
        </div>
        <Calendar forcedCity="San Antonio" eventCategory="chamber" />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>San Antonio Chambers & Associations We Track</h2>
          <p>We monitor events from San Antonio's chambers and business associations so nothing slips through the cracks.</p>
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
          <h2>Trusted by San Antonio Chamber Members</h2>
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
          <p>Get San Antonio's best chamber and association events delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit a Chamber Event</Link>
            <Link to="/san-antonio/subscribe" className="btn btn-gold">Get the Weekly Email — Free</Link>
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

export function SanAntonioChamberPage() {
  return <SanAntonioChamberContent />;
}
