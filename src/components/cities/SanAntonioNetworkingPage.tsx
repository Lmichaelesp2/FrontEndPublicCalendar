'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, CalendarDays, Search, Mail, Users, Clock, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import type { Event } from '../../lib/supabase';

const NETWORKING_STATS = [
  { number: '500+', label: 'San Antonio professionals subscribed' },
  { number: '25+', label: 'Networking organizations tracked' },
];

const NETWORKING_TESTIMONIALS = [
  {
    quote: "I finally have one place to track every BNI chapter meeting, leads group, and referral network event in San Antonio. It saves me so much time.",
    name: 'Maria L.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The Monday networking events newsletter is the first email I open every week. I've made more connections in the last 60 days than in the past year.",
    name: 'James T.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a commercial real estate broker, referrals are everything. This calendar helped me find the right networking groups without hours of research.",
    name: 'Sandra M.',
    location: 'San Antonio, TX',
  },
];

const NETWORKING_FAQ = [
  {
    question: 'What types of networking organizations are listed?',
    answer: 'We track BNI chapters, leads groups, referral networking groups, professional associations, business mixers, chamber after-hours events, and structured networking organizations throughout San Antonio.',
  },
  {
    question: 'Is this the same as the main San Antonio Business Calendar?',
    answer: 'No. The main San Antonio calendar shows all business events across every category. This page filters exclusively to networking-focused events — leads groups, referral organizations, and professional networking gatherings.',
  },
  {
    question: 'How is structured networking different from general business events?',
    answer: 'Structured networking events like BNI chapters or leads groups meet regularly with the specific goal of building referral relationships. General business events may include speakers, education, or social components. This calendar focuses on events where relationship-building and referrals are the primary purpose.',
  },
  {
    question: 'Do you list BNI chapter meetings?',
    answer: 'Yes. We track BNI chapters throughout the San Antonio metro area. BNI meetings are among the most structured and effective referral networking formats, and we include them in the calendar.',
  },
  {
    question: 'How do I find the right networking group for me?',
    answer: 'Browse the calendar to see what groups meet near you and at times that work for your schedule. Most networking groups offer a free guest visit — the calendar gives you the event details so you can try one out before committing.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive San Antonio networking events every Monday morning.',
  },
];

const NETWORKING_ORGS = [
  'BNI San Antonio Chapters',
  'San Antonio Chamber of Commerce',
  'North San Antonio Chamber',
  'Hispanic Chamber of Commerce SA',
  'San Antonio Professionals Network',
  'SA Business Leads Groups',
  'Women\'s Business Networking SA',
  'SCORE San Antonio',
  'Young Professionals SA',
  'SA Referral Groups',
  'LeTip San Antonio',
  '... and many more',
];

function NetworkingFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
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

function SanAntonioNetworkingContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="San Antonio Networking Events Calendar | Free Weekly Networking Events Email"
        description="Find BNI chapters, leads groups, referral networks, and professional networking events in San Antonio. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/san-antonio/networking/"
        robots="noindex"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Networking Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            SAN ANTONIO NETWORKING CALENDAR
          </div>
          <h1>
            Networking Events in
            <br />
            the <em>San Antonio</em> Area
          </h1>
          <p className="hero-subtext">
            Stop missing the networking events that grow your referrals and your business.
          </p>
          <p className="hero-category-tags">NETWORKING & REFERRAL GROUPS</p>
          <div className="hero-cta-group">
            <Link href="/texas/san-antonio/subscribe" className="btn btn-white">
              Get My Free San Antonio Networking Events Newsletter
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
          <p className="features-subtitle">We aggregate networking sources across San Antonio so you don't have to — then deliver the best opportunities straight to your inbox every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to San Antonio Networking</h3>
              <p>Click subscribe above. Enter your email. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated list of that week's networking events, leads groups, and referral gatherings in San Antonio.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events &amp; show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to build relationships and grow your referral network.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Today's Networking Events in San Antonio</h2>
          <p>Browse BNI chapters, leads groups, referral networks, and professional mixers</p>
        </div>
        <EventGate forcedCity="San Antonio" groupType="networking" initialEvents={initialEvents} />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>San Antonio Networking Organizations We Track</h2>
          <p>We monitor events from San Antonio's top networking and referral organizations so nothing slips through the cracks.</p>
          <div className="sa-orgs-grid">
            {NETWORKING_ORGS.map((org, i) => (
              <div key={i} className="sa-org-tag">
                <Users size={14} strokeWidth={2} />
                {org}
              </div>
            ))}
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
              <p>Sign up for San Antonio networking events and get that week's opportunities in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse San Antonio's networking events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what networking opportunities are coming up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by San Antonio Networking Professionals</h2>
          <p className="sp-subtitle">San Antonio Networking Calendar — By the Numbers</p>
          <div className="sp-stats">
            {NETWORKING_STATS.map((stat) => (
              <div key={stat.label} className="sp-stat">
                <span className="sp-stat-number">{stat.number}</span>
                <span className="sp-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="sp-testimonials">
            {NETWORKING_TESTIMONIALS.map((t) => (
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

      <WhySection
        heading="Why San Antonio Networking Professionals Use This Calendar"
        subtitle="San Antonio networking events are spread across too many platforms and websites. Here's how Local Business Calendars helps San Antonio professionals keep up."
        problemText="Networking events in San Antonio are scattered across BNI chapter websites, Meetup groups, LinkedIn, Facebook, and individual organization pages. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track networking event hosts across San Antonio and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get San Antonio Networking Events Every Monday — Free</h2>
          <p>A curated digest of that week's networking events in San Antonio, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-accent">Submit a Networking Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/san-antonio">See all San Antonio business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About San Antonio Networking Events</h2>
          <div className="faq-list">
            {NETWORKING_FAQ.map((item, i) => (
              <NetworkingFaqItem
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

      <Footer
        citySlug="san-antonio"
        cityName="San Antonio"
        categoryNav={{
          cityLabel: "Also in San Antonio:",
          links: [
            { label: "Technology Events", href: "/texas/san-antonio/technology" },
            { label: "Real Estate Events", href: "/texas/san-antonio/real-estate" },
            { label: "Chamber Events", href: "/texas/san-antonio/chamber" },
            { label: "Small Business Events", href: "/texas/san-antonio/small-business" }
          ]
        }}
      />
    </div>
  );
}

export function SanAntonioNetworkingPage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioNetworkingContent initialEvents={initialEvents} />;
}
