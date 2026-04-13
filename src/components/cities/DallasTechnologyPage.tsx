'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, CalendarDays, Search, Mail, Monitor, Users, Clock, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import type { Event } from '../../lib/supabase';

const STATS = [
  { number: '500+', label: 'Tech professionals subscribed' },
  { number: '50+', label: 'Technology organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "I finally have one place for all the tech meetups, developer groups, and startup events in Dallas. No more scrolling through five different platforms.",
    name: 'David R.',
    location: 'Dallas, TX',
  },
  {
    quote: "The weekly tech events newsletter is a game-changer. I've attended more meetups in the last month than I did all last year.",
    name: 'Priya K.',
    location: 'Dallas, TX',
  },
  {
    quote: "As a startup founder, staying plugged into the DFW tech scene is critical. This calendar makes it effortless.",
    name: 'Carlos G.',
    location: 'Dallas, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of technology events are listed?',
    answer: 'We track software development meetups, cybersecurity events, data science workshops, AI/ML gatherings, startup pitch nights, tech networking mixers, hackathons, cloud computing sessions, and more across Dallas-Fort Worth.',
  },
  {
    question: 'Is this the same as the main Dallas Business Calendar?',
    answer: 'No. The main Dallas calendar shows all business and networking events across every category. This page filters exclusively to technology-related events, making it easier for tech professionals to find what matters most to them.',
  },
  {
    question: 'Do you cover cybersecurity and information security events in Dallas?',
    answer: 'Yes. Dallas-Fort Worth has a large and active cybersecurity community. We track events from ISSA North Texas, local DEF CON chapters, and the broader DFW infosec community.',
  },
  {
    question: 'Do you cover startup and founder events in DFW?',
    answer: 'Absolutely. Dallas has a thriving startup ecosystem and we track events from Capital Factory Dallas, Venture Dallas, DFW startup communities, and founder networking groups across the metro.',
  },
  {
    question: 'Do you cover AI and machine learning events in Dallas?',
    answer: 'Yes. AI and data science are among the fastest-growing segments of the DFW tech community. We track events from AI Dallas, data science Meetup groups, and machine learning communities throughout the metro.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Dallas technology events every Monday morning.',
  },
];

const ORGS = [
  'Dallas Software Developers',
  'Capital Factory Dallas',
  'DFW DevOps',
  'Venture Dallas',
  'ISSA North Texas',
  'DFW AI & Machine Learning',
  'Google Developer Group Dallas',
  'DFW Data Science',
  'Dallas Founders Network',
  'DFW Cloud & AWS Users',
  'North Texas .NET Users Group',
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

function DallasTechnologyContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Dallas Technology Events Calendar | Free Weekly Tech Events Email"
        description="Find tech meetups, developer groups, startup events, and technology networking in Dallas. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/dallas/technology/"
        robots="noindex"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Dallas', href: '/texas/dallas' },
        { label: 'Technology Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            DALLAS TECHNOLOGY CALENDAR
          </div>
          <h1>
            Technology Events in
            <br />
            the <em>Dallas</em> Area
          </h1>
          <p className="hero-subtext">
            Stop missing the tech events that grow your network and your career.
          </p>
          <div className="hero-category-tags">
            Technology &middot; Software &middot; Startups &middot; Dev Meetups &middot; Tech Talks &middot; and more
          </div>
          <div className="hero-cta-group">
            <Link href="/texas/dallas/subscribe" className="btn btn-white">
              Get My Free Dallas Technology Events Newsletter
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
          <p className="features-subtitle">We aggregate tech sources across Dallas-Fort Worth so you don't have to — then deliver the best event opportunities straight to your inbox every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Dallas Tech</h3>
              <p>Click subscribe above. Enter your email address. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's tech meetups, developer groups, and startup events in Dallas.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events &amp; show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next Dallas Tech Event</h2>
          <p>Browse developer meetups, cybersecurity events, hackathons, and more</p>
        </div>
        <EventGate forcedCity="Dallas" groupType="technology" initialEvents={initialEvents} />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>Dallas Tech Organizations We Track</h2>
          <p>We monitor events from Dallas-Fort Worth's top technology communities so nothing slips through the cracks.</p>
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

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss a Tech Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Monitor size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for Dallas tech events and get that week's opportunities in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse Dallas's tech events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what's coming up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by Dallas Tech Professionals</h2>
          <p className="sp-subtitle">Dallas Technology Calendar — By the Numbers</p>
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

      <WhySection
        heading="Why Dallas Tech Professionals Use This Calendar"
        subtitle="Dallas tech events are spread across too many platforms and websites. Here's how Local Business Calendars helps Dallas professionals keep up."
        problemText="Tech events in Dallas are scattered across Meetup groups, Eventbrite, LinkedIn, Slack channels, and individual org websites. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track tech event hosts across Dallas and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Dallas Tech Events Every Monday — Free</h2>
          <p>A curated digest of that week's technology events in Dallas, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/dallas/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Dallas business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-accent">Submit a Tech Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/dallas">See all Dallas business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Dallas Technology Events</h2>
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

      <Footer
        citySlug="dallas"
        cityName="Dallas"
        categoryNav={{
          cityLabel: "Also in Dallas:",
          links: [
            { label: "Real Estate Events", href: "/texas/dallas/real-estate" },
            { label: "Chamber Events", href: "/texas/dallas/chamber" },
            { label: "Small Business Events", href: "/texas/dallas/small-business" },
            { label: "Networking Events", href: "/texas/dallas/networking" }
          ]
        }}
      />
    </div>
  );
}

export function DallasTechnologyPage({ initialEvents }: { initialEvents: Event[] }) {
  return <DallasTechnologyContent initialEvents={initialEvents} />;
}
