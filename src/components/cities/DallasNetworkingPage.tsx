import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Target, Star, Plus, Minus, CalendarDays, Search, Mail, Users, Clock } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';

const STATS = [
  { number: '500+', label: 'Dallas professionals subscribed' },
  { number: '25+', label: 'Networking organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "I finally have one place to track every BNI chapter meeting, leads group, and referral network event in Dallas. It saves me so much time.",
    name: 'Maria L.',
    location: 'Dallas, TX',
  },
  {
    quote: "The Monday networking events newsletter is the first email I open every week. I've made more connections in the last 60 days than in the past year.",
    name: 'James T.',
    location: 'Dallas, TX',
  },
  {
    quote: "As a commercial real estate broker, referrals are everything. This calendar helped me find the right networking groups in DFW without hours of research.",
    name: 'Sandra M.',
    location: 'Dallas, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of networking organizations are listed?',
    answer: 'We track BNI chapters, leads groups, referral networking groups, professional associations, business mixers, chamber after-hours events, and structured networking organizations throughout Dallas-Fort Worth.',
  },
  {
    question: 'Is this the same as the main Dallas Business Calendar?',
    answer: 'No. The main Dallas calendar shows all business events across every category. This page filters exclusively to networking-focused events — leads groups, referral organizations, and professional networking gatherings.',
  },
  {
    question: 'Do you list BNI chapter meetings in Dallas?',
    answer: 'Yes. We track BNI chapters throughout the Dallas-Fort Worth metro area. BNI meetings are among the most structured and effective referral networking formats, and we include them in the calendar.',
  },
  {
    question: 'Do you cover networking events across the entire DFW metro?',
    answer: 'Yes. We cover networking events in Dallas proper as well as Plano, Irving, Frisco, Allen, McKinney, Garland, Arlington, and other cities throughout the DFW metro area.',
  },
  {
    question: 'How do I find the right networking group for me in Dallas?',
    answer: 'Browse the calendar to see what groups meet near you and at times that work for your schedule. Most networking groups offer a free guest visit — the calendar gives you the event details so you can try one out before committing.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Dallas networking events every Monday morning.',
  },
];

const ORGS = [
  'BNI Dallas Chapters',
  'BNI North Dallas Chapters',
  'BNI Plano & Frisco Chapters',
  'Dallas Regional Chamber',
  'DFW Professionals Network',
  'Dallas Business Leads Groups',
  'Women\'s Business Networking Dallas',
  'SCORE Dallas',
  'Young Professionals Dallas',
  'DFW Referral Groups',
  'LeTip Dallas',
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

function DallasNetworkingContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Dallas Networking Events Calendar | Free Weekly Networking Events Email"
        description="Find BNI chapters, leads groups, referral networks, and professional networking events in Dallas. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/dallas/networking/"
        robots="noindex"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Dallas', href: '/texas/dallas' },
        { label: 'Networking Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            DALLAS NETWORKING CALENDAR
          </div>
          <h1>
            Networking Events in
            <br />
            the <em>Dallas</em> Area
          </h1>
          <p className="hero-subtext">
            Stop missing the networking events that grow your referrals and your business.
          </p>
          <p className="hero-category-tags">NETWORKING & REFERRAL GROUPS</p>
          <div className="hero-cta-group">
            <Link to="/texas/dallas/subscribe" className="btn btn-white">
              Get My Free Dallas Networking Events Newsletter
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
            <span>Networking events aggregated every week</span>
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
          <p className="features-subtitle">We aggregate networking sources across Dallas-Fort Worth so you don't have to — then deliver the best opportunities straight to your inbox every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Dallas Networking</h3>
              <p>Click subscribe above. Enter your email. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated list of that week's networking events, leads groups, and referral gatherings in Dallas.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events &amp; show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to build relationships and grow your referral network.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Dallas-Fort Worth's Professional Networking Community</h2>
          <p className="why-subtitle">Dallas-Fort Worth has one of the largest and most active professional networking communities in Texas. The region's size and business density has produced a deep ecosystem of BNI chapters, leads groups, referral networking organizations, and mixer series that run consistent weekly and monthly events across the entire DFW metro. Whether you are in Dallas proper, Plano, Irving, Frisco, or anywhere in the DFW area, there are structured networking opportunities designed to help you build the referral relationships that grow your business.</p>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon"><AlertTriangle size={26} strokeWidth={2} /></div>
              <h3>The problem</h3>
              <p>Networking events are scattered across BNI chapter websites, Meetup groups, Facebook events, and individual organization pages. Tracking them all separately takes time most professionals don't have.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Target size={26} strokeWidth={2} /></div>
              <h3>What we do</h3>
              <p>We monitor Dallas-Fort Worth's networking organizations, leads groups, and referral networking groups — then organize their events into one simple updated calendar.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Star size={26} strokeWidth={2} /></div>
              <h3>What you get</h3>
              <p>Every networking event in one place, delivered weekly, so you never miss a meeting that could become your next referral relationship.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss a Networking Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Users size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for Dallas networking events and get that week's opportunities in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse Dallas's networking events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what networking opportunities are coming up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Today's Networking Events in Dallas</h2>
          <p>Browse BNI chapters, leads groups, referral networks, and professional mixers</p>
        </div>
        <EventGate forcedCity="Dallas" eventCategory="networking" />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>Dallas Networking Organizations We Track</h2>
          <p>We monitor events from Dallas-Fort Worth's top networking and referral organizations so nothing slips through the cracks.</p>
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
          <h2>Trusted by Dallas Networking Professionals</h2>
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
          <p>Get Dallas networking events delivered to your inbox every Monday morning — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link to="/submit" className="btn sa-btn-outline">Submit a Networking Event</Link>
            <Link to="/texas/dallas/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Dallas business events</p>
        </div>
      </section>

      <section className="sa-category-nav">
        <div className="sa-category-nav-inner">
          <span className="sa-category-nav-label">Also in Dallas:</span>
          <div className="sa-category-nav-links">
            <Link to="/texas/dallas/technology" className="sa-category-link">Technology Events</Link>
            <Link to="/texas/dallas/real-estate" className="sa-category-link">Real Estate Events</Link>
            <Link to="/texas/dallas/chamber" className="sa-category-link">Chamber Events</Link>
            <Link to="/texas/dallas/small-business" className="sa-category-link">Small Business Events</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link to="/texas/dallas">See all Dallas business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Dallas Networking Events</h2>
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

export function DallasNetworkingPage() {
  return <DallasNetworkingContent />;
}
