import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, CalendarDays, Mail, Users, Clock, Monitor, Home, Landmark, Briefcase, Search, Building2 } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { Breadcrumb } from '../Breadcrumb';

const STATS = [
  { number: '200+', label: 'Events added monthly' },
  { number: '1,500+', label: 'Dallas professionals subscribed' },
  { number: '250+', label: 'Dallas business organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "DFW has so many networking events but they're impossible to track. This calendar changed everything for me.",
    name: 'Robert A.',
    location: 'Dallas, TX',
  },
  {
    quote: "The weekly Dallas business events email is the first thing I read every Monday morning.",
    name: 'Sandra T.',
    location: 'Plano, TX',
  },
  {
    quote: "I've made more meaningful connections in Dallas since subscribing than I did in three years of searching on my own.",
    name: 'Marcus W.',
    location: 'Dallas, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is this really free?',
    answer: 'Yes! The Dallas calendar and weekly email are completely free — no credit card required. Sign up free to unlock the full week of events and get the Monday newsletter.',
  },
  {
    question: 'What kinds of events are listed for Dallas?',
    answer: 'We track business networking mixers, chamber events (Dallas Regional Chamber, Hispanic Chamber, Women\'s Chamber, and more), SCORE workshops, professional development sessions, entrepreneur meetups, startup events, and industry-specific events across the DFW metroplex.',
  },
  {
    question: 'How do you find Dallas events?',
    answer: "We monitor top Dallas business organizations, chambers of commerce, Meetup, Eventbrite, Facebook, and dozens of local sources across DFW — so you don't have to check multiple sites.",
  },
  {
    question: 'How is this different from Eventbrite or Meetup?',
    answer: "Those platforms only show events posted on their own site. We gather networking and business events from all major platforms and local Dallas-Fort Worth organizations into one calendar, giving you a complete picture.",
  },
  {
    question: 'What do I get when I sign up free?',
    answer: "Free signup gives you access to the full week of Dallas business events on the calendar — not just today's events. You also get the Monday morning newsletter with that week's curated digest.",
  },
  {
    question: 'Can I add my own Dallas event?',
    answer: 'Yes! Use our Submit Event page to add your networking or business event to the Dallas calendar for free.',
  },
];

const ORGS = [
  'Dallas Regional Chamber',
  'Dallas Fort Worth Hispanic Chamber',
  'Dallas Women\'s Chamber',
  'Greater Dallas Hispanic Chamber',
  'Dallas Startup Week',
  'SCORE Dallas',
  'North Texas SBDC',
  'Dallas Entrepreneur Center',
  'DFW Nonprofit',
  'Dallas Young Professionals',
  '... and many more',
];

const CATEGORY_LINKS = [
  { label: 'Networking Events', href: '/texas/dallas/networking', icon: <Users size={20} /> },
  { label: 'Chamber Events', href: '/texas/dallas/chamber', icon: <Landmark size={20} /> },
  { label: 'Technology Events', href: '/texas/dallas/technology', icon: <Monitor size={20} /> },
  { label: 'Real Estate Events', href: '/texas/dallas/real-estate', icon: <Home size={20} /> },
  { label: 'Small Business Events', href: '/texas/dallas/small-business', icon: <Briefcase size={20} /> },
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

function DallasContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Dallas Business Calendar | Free Networking & Business Events Newsletter"
        description="Find networking events, business mixers, chamber meetings, and professional development opportunities in Dallas, Texas. Updated weekly with the latest events."
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Dallas' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            Dallas Business Calendar
          </div>
          <h1>
            Networking &amp; Business Events
            <br />
            in the <em>Dallas</em> area
          </h1>
          <p className="hero-subtext">
            Stop missing the events that grow your network and your business.
          </p>
          <div className="hero-category-tags">
            Networking &middot; Chamber &middot; Technology &middot; Real Estate &middot; Small Business &middot; Healthcare &middot; Finance &middot; and more
          </div>
          <div className="hero-cta-group">
            <Link to="/texas/dallas/subscribe" className="btn btn-white">
              Sign Up Free — See the Full Week of Dallas Events
            </Link>
            <p className="hero-subtext-below">
              Free access to the full weekly calendar + the Monday newsletter. No credit card. Cancel anytime.
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
          <p className="features-subtitle">We aggregate sources across Dallas so you don't have to — then deliver the best event opportunities straight to your inbox every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free in 10 seconds</h3>
              <p>Enter your email — no account, no credit card, no setup. You're in.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Unlock the full week of events</h3>
              <p>The calendar shows today's events to everyone. Sign up free and instantly see everything happening this week in Dallas — all event types, all days.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning, a curated digest of that week's best business and networking events in Dallas lands in your inbox. We do the research — you show up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Why Dallas Professionals Use This Calendar</h2>
          <p className="why-subtitle">Most Dallas professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>Business events in Dallas are scattered across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and association websites. Most professionals miss events simply because they didn't know they were happening.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We track business event hosts across Dallas and organize their public events into one city-focused calendar — updated every week.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>Today's events are always free to browse. Sign up free to unlock the full week and get the Monday newsletter — faster discovery, fewer missed opportunities, and a weekly reminder that keeps you consistent.</p>
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
              <h3>Browse today's events free</h3>
              <p>The calendar shows today's business and networking events in Dallas to everyone — no signup needed. Come back anytime.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Sign up to unlock the full week</h3>
              <p>Free signup gives you access to the entire week of upcoming events in Dallas, not just today. See what's happening Monday through Sunday and plan ahead.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Get the Monday newsletter</h3>
              <p>Every Monday morning, a curated digest of that week's best events arrives in your inbox. Free subscribers get the full weekly roundup.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next Dallas Event</h2>
          <p>Browse networking events, business mixers, lunch-and-learns, and more</p>
        </div>
        <EventGate forcedCity="Dallas" />
      </section>

      <section className="city-categories-section">
        <div className="city-categories-inner">
          <h2>Browse Dallas Events by Category</h2>
          <p className="city-categories-subtitle">Explore Dallas's business event scene by topic</p>
          <div className="city-categories-grid">
            {CATEGORY_LINKS.map((cat) => (
              <Link key={cat.href} to={cat.href} className="city-category-card">
                <span className="city-category-icon">{cat.icon}</span>
                <span className="city-category-label">{cat.label}</span>
              </Link>
            ))}
          </div>
          <p className="city-categories-note">All events in each category calendar are free to browse — no signup needed. Subscribe to get the weekly category newsletter.</p>
        </div>
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>Dallas Organizations We Track</h2>
          <p>We monitor events from Dallas's top business networks so nothing slips through the cracks.</p>
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
          <h2>Trusted by Dallas Business Professionals</h2>
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

      <section className="sa-subscribe-section" id="dallas-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Don't Want to Check Back Every Week?</h2>
          <p>Get the full week's Dallas events delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit an Event</Link>
            <Link to="/texas/dallas/subscribe" className="btn btn-gold">Sign Up Free — Unlock the Full Week + Newsletter</Link>
          </div>
          <p className="sa-subscribe-note">Also available for San Antonio · Austin · Houston</p>
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

      <Footer showIndustryCalendars={true} citySlug="dallas" cityName="Dallas" />
    </div>
  );
}

export function DallasPage() {
  return <DallasContent />;
}
