import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, Search, Mail, Users, Clock, CalendarDays, Building2, AlertTriangle, Target } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';

const STATS = [
  { number: '500+', label: 'Chamber members subscribed' },
  { number: '30+', label: 'Chambers & associations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Between the Greater Houston Partnership, the Hispanic Chamber, and the Black Chamber, I was checking three different websites every week. Now it's all in one calendar.",
    name: 'Patricia H.',
    location: 'Houston, TX',
  },
  {
    quote: "The weekly chamber events email is exactly what I needed. I show up to more ribbon cuttings and luncheons than ever before.",
    name: 'Robert D.',
    location: 'Houston, TX',
  },
  {
    quote: "As a chamber ambassador, having every chamber event across Houston in one view has been incredibly valuable for planning my week.",
    name: 'Angela S.',
    location: 'Houston, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Which Houston chambers are included in this calendar?',
    answer: 'We track the Greater Houston Partnership, Houston Hispanic Chamber of Commerce, Houston Black Chamber of Commerce, Fort Bend Chamber of Commerce, Cy-Fair Houston Chamber, and many more area chambers across the Houston metro.',
  },
  {
    question: 'Is this the same as the main Houston Business Calendar?',
    answer: 'No. The main Houston calendar shows all business and networking events. This page focuses exclusively on chamber of commerce and business association events, making it easier to track the organizations that matter most to you.',
  },
  {
    question: 'What types of chamber events are listed?',
    answer: 'We track chamber luncheons, ribbon cuttings, Business After Hours mixers, ambassador meetings, legislative updates, annual galas, and more from chambers and business associations across Houston.',
  },
  {
    question: 'Do I need to be a chamber member to attend these events?',
    answer: 'Many chamber events are open to non-members and prospective members. Check the individual event listing for details. Most chambers welcome guests at select events to give you a feel for membership.',
  },
  {
    question: 'Do you cover chambers across the entire Houston metro area?',
    answer: 'Yes. We cover chambers from across the Houston metro — Downtown, the Woodlands, Sugar Land, Katy, Pearland, Cy-Fair, Fort Bend, and beyond.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Houston chamber events every Monday morning.',
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
  'Greater Houston Partnership',
  'Houston Hispanic Chamber',
  'Houston Black Chamber',
  'Fort Bend Chamber',
  'Cy-Fair Houston Chamber',
  'Houston Asian Chamber',
  'Houston LGBT+ Chamber',
  'Pearland Chamber of Commerce',
  'Katy Area Chamber',
  'The Woodlands Chamber',
  'Sugar Land Chamber',
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

function HoustonChamberContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Houston Chamber Events Calendar | Free Weekly Chamber Events Email"
        description="Find Houston Chamber of Commerce events, chamber mixers, ribbon cuttings, and chamber networking in Houston. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/houston/chamber/"
        robots="noindex"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Houston', href: '/texas/houston' },
        { label: 'Chamber Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            HOUSTON CHAMBER CALENDAR
          </div>
          <h1>
            Chamber of Commerce Events in the
            <br />
            <em>Houston</em> Area
          </h1>
          <p className="hero-subtext">
            Stop missing the chamber events that connect you to Houston's business community.
          </p>
          <div className="hero-category-tags">
            Chamber &middot; Networking &middot; Business Mixers &middot; Ribbon Cuttings &middot; Luncheons &middot; and more
          </div>
          <div className="hero-cta-group">
            <Link to="/texas/houston/subscribe" className="btn btn-white">
              Get My Free Houston Chamber Events Newsletter
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
          <p className="features-subtitle">We aggregate chamber event sources across Houston so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Chamber Events</h3>
              <p>Click subscribe above. Enter your email address. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's chamber luncheons, Business After Hours, and ribbon cuttings in Houston.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events &amp; show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Houston's Chamber Community</h2>
          <p className="why-subtitle">Houston has one of the most extensive and diverse chamber of commerce networks in Texas. The Greater Houston Partnership, Houston Hispanic Chamber of Commerce, Houston Black Chamber of Commerce, Fort Bend Chamber of Commerce, Cy-Fair Houston Chamber of Commerce, and dozens of additional area chambers serve the broader Houston metro — each running consistent networking events, luncheons, mixers, ribbon cuttings, and speaker series throughout the year. Houston's chamber community reflects the city's extraordinary diversity and provides business professionals with consistent opportunities to connect with the region's business leadership across every industry sector.</p>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon"><AlertTriangle size={26} strokeWidth={2} /></div>
              <h3>The problem</h3>
              <p>Each chamber has its own website, newsletter list, and event calendar. If you belong to multiple chambers, you're checking multiple places every week.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Target size={26} strokeWidth={2} /></div>
              <h3>What we do</h3>
              <p>We monitor every major chamber and business association in the Houston area and consolidate their events into one unified calendar.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Star size={26} strokeWidth={2} /></div>
              <h3>What you get</h3>
              <p>A single source for chamber events in Houston — from ribbon cuttings to Business After Hours to annual galas.</p>
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
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for Houston chamber events and get that week's luncheons, Business After Hours, and ribbon cuttings in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse Houston's chamber and association events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what's coming up in the chamber community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next Houston Chamber Event</h2>
          <p>Browse luncheons, Business After Hours, ribbon cuttings, and more</p>
        </div>
        <EventGate forcedCity="Houston" eventCategory="chamber" />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>Houston Chambers &amp; Associations We Track</h2>
          <p>We monitor events from Houston's chambers and business associations so nothing slips through the cracks.</p>
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
          <h2>Trusted by Houston Chamber Members</h2>
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
          <h2>Get Houston Chamber Events Every Monday — Free</h2>
          <p>A curated digest of that week's chamber events in Houston, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit a Chamber Event</Link>
            <Link to="/texas/houston/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Houston business events</p>
        </div>
      </section>

      <section className="sa-category-nav">
        <div className="sa-category-nav-inner">
          <span className="sa-category-nav-label">Also in Houston:</span>
          <div className="sa-category-nav-links">
            <Link to="/texas/houston/technology" className="sa-category-link">Technology Events</Link>
            <Link to="/texas/houston/real-estate" className="sa-category-link">Real Estate Events</Link>
            <Link to="/texas/houston/networking" className="sa-category-link">Networking Events</Link>
            <Link to="/texas/houston/small-business" className="sa-category-link">Small Business Events</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link to="/texas/houston">See all Houston business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Houston Chamber Events</h2>
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

export function HoustonChamberPage() {
  return <HoustonChamberContent />;
}
