import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, Plus, Minus, Search, Mail, Briefcase, Users, Clock, ArrowLeft } from 'lucide-react';
import { Navigation } from '../Navigation';
import { CityLoginBanner } from '../CityLoginBanner';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { Calendar } from '../Calendar';

const STATS = [
  { number: '70+', label: 'Small business events added monthly' },
  { number: '2,000+', label: 'Small business owners subscribed' },
  { number: '35+', label: 'Small business organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "SCORE workshops, SBA seminars, and local entrepreneur meetups — all in one place. This calendar has been a lifeline for my growing business.",
    name: 'Maria G.',
    location: 'San Antonio, TX',
  },
  {
    quote: "I used to miss free workshops and grant info sessions because I didn't know they existed. Now the weekly email keeps me in the loop every Monday.",
    name: 'Tony R.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a solopreneur, networking events designed for small businesses are where I find clients and partners. This calendar makes finding them effortless.",
    name: 'Keisha B.',
    location: 'San Antonio, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of small business events are listed?',
    answer: 'We track SCORE workshops, SBA seminars, small business networking events, entrepreneur meetups, funding and grant sessions, marketing workshops, bookkeeping classes, and more across San Antonio.',
  },
  {
    question: 'Is this calendar free?',
    answer: 'Yes! The San Antonio small business events calendar and weekly email are completely free — no credit card required.',
  },
  {
    question: 'How is this different from the main San Antonio calendar?',
    answer: 'The main San Antonio calendar shows all business and networking events. This page focuses exclusively on events designed for small business owners and entrepreneurs, making it easier to find the resources and connections you need.',
  },
  {
    question: 'How do you find small business events in San Antonio?',
    answer: 'We monitor SCORE San Antonio, the SBA district office, LiftFund, small business Meetup groups, SBDC, Eventbrite, LinkedIn, and local entrepreneur communities in the San Antonio area.',
  },
  {
    question: 'Can I submit a small business event?',
    answer: 'Yes! Use our Submit Event page to add your small business event to the calendar for free. Just make sure to categorize it as a small business event.',
  },
  {
    question: 'Do you cover SCORE and SBA events?',
    answer: 'Absolutely. SCORE San Antonio and SBA events are some of the most valuable free resources for small business owners, and we actively track all of their public workshops and seminars.',
  },
];

const EVENT_TYPES = [
  'SCORE workshops & mentoring events',
  'SBA seminars & webinars',
  'Small business networking mixers',
  'Entrepreneur meetups & pitch events',
  'Funding & grant info sessions',
  'Marketing & social media workshops',
  'Bookkeeping & tax planning classes',
  'Small business resource fairs',
];

const ORGS = [
  'SCORE San Antonio',
  'SBA San Antonio District',
  'LiftFund',
  'SBDC at UTSA',
  'SA Entrepreneurs',
  'SA Small Business Network',
  'NAWBO San Antonio',
  'SA Hispanic Entrepreneurs',
  'Geekdom (Startup Resources)',
  'VIA Link (Small Biz)',
  'SA Public Library Biz Center',
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

function SanAntonioSmallBusinessContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Small Business Events in San Antonio, TX | Texas Business Calendars"
        description="Find SCORE workshops, SBA seminars, entrepreneur meetups, and small business networking events in San Antonio, Texas. Updated weekly."
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
            <span className="dot" style={{ background: '#3b82f6' }}></span>
            San Antonio Small Business Calendar
          </div>
          <h1>
            Small Business Events
            <br />
            in <em>San Antonio</em>
          </h1>
          <p className="sa-hero-sub">
            SCORE workshops, SBA seminars, entrepreneur meetups, and networking events built for San Antonio small business owners — all in one place.
          </p>
          <Link to="/san-antonio/subscribe" className="btn btn-gold">
            Get the FREE Weekly Email
          </Link>
          <p className="hero-note">No credit card required · Unsubscribe anytime</p>
        </div>
      </section>

      <section className="value-section">
        <div className="value-inner">
          <h2>San Antonio Small Business Events, One Calendar</h2>
          <p>Small business resources in San Antonio are scattered across SCORE, the SBA, LiftFund, SBDC, and dozens of local groups. We bring them together so you can focus on growing your business.</p>
        </div>
      </section>

      <section className="sa-value-strip">
        <div className="sa-value-strip-inner">
          <div className="sa-value-strip-item">
            <div className="sa-strip-icon"><Briefcase size={28} strokeWidth={1.8} /></div>
            <div>
              <strong>Small Business Focused</strong>
              <p>Curated specifically for small business owners, solopreneurs, side hustlers, and entrepreneurs.</p>
            </div>
          </div>
          <div className="sa-value-strip-item">
            <div className="sa-strip-icon"><Search size={28} strokeWidth={1.8} /></div>
            <div>
              <strong>Easy to Browse</strong>
              <p>Search by keyword, browse by date, and find the right small business events for your schedule.</p>
            </div>
          </div>
          <div className="sa-value-strip-item">
            <div className="sa-strip-icon"><Mail size={28} strokeWidth={1.8} /></div>
            <div>
              <strong>Weekly Small Biz Roundup</strong>
              <p>Get a Monday email with the week's small business events in San Antonio. Never miss a workshop again.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Why a Separate Small Business Calendar?</h2>
          <p className="why-subtitle">San Antonio has a thriving small business ecosystem with dozens of organizations offering free workshops, mentoring, and networking. The challenge is knowing when and where these events are happening.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>Small business events are spread across SCORE, SBA, SBDC, LiftFund, Meetup, and individual organizations. Most small business owners don't have time to check them all.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We monitor San Antonio's top small business organizations and platforms, then organize their events into one focused calendar updated weekly.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>A single source for small business events in San Antonio — from SCORE workshops to entrepreneur meetups to funding sessions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Everything in the free weekly email</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Briefcase size={40} strokeWidth={2} /></div>
              <h3>Small business events only</h3>
              <p>This calendar filters out everything except small business events in San Antonio.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Browse & search</h3>
              <p>Use the calendar or search by keyword to find workshops, meetups, funding sessions, and more.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Get weekly reminders</h3>
              <p>Subscribe free and get a Monday email with San Antonio small business opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Small Business Event</h2>
          <p>Browse SCORE workshops, SBA seminars, entrepreneur meetups, and more</p>
        </div>
        <Calendar forcedCity="San Antonio" eventCategory="small_business" />
      </section>

      <section className="whats-included-section">
        <div className="whats-included-inner">
          <h2>What's Included</h2>
          <p className="whats-included-subtitle">
            The San Antonio small business calendar includes events like:
          </p>
          <div className="event-types-list">
            {EVENT_TYPES.map((type, i) => (
              <div key={i} className="event-type-item">
                <CheckCircle className="check-icon" size={24} strokeWidth={2.5} />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>San Antonio Small Business Organizations We Track</h2>
          <p>We monitor events from San Antonio's top small business resources so nothing slips through the cracks.</p>
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
          <h2>Trusted by San Antonio Small Business Owners</h2>
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
          <p>Get San Antonio's best small business events delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit a Small Business Event</Link>
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

export function SanAntonioSmallBusinessPage() {
  return <SanAntonioSmallBusinessContent />;
}
