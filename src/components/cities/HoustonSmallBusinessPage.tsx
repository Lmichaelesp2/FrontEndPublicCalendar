'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Users, Clock, CalendarDays, Building2, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import type { Event } from '../../lib/supabase';

const STATS = [
  { number: '500+', label: 'Small business owners subscribed' },
  { number: '35+', label: 'Small business organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "SCORE workshops, SBA seminars, and local entrepreneur meetups — all in one place. This calendar has been a lifeline for my growing business.",
    name: 'Maria G.',
    location: 'Houston, TX',
  },
  {
    quote: "I used to miss free workshops and grant info sessions because I didn't know they existed. Now the weekly email keeps me in the loop every Monday.",
    name: 'Tony R.',
    location: 'Houston, TX',
  },
  {
    quote: "As a solopreneur in Houston, networking events designed for small businesses are where I find clients and partners. This calendar makes finding them effortless.",
    name: 'Keisha B.',
    location: 'Houston, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of organizations are included in this calendar?',
    answer: 'We track SCORE Houston, SBA seminars, University of Houston SBDC, Houston Community College entrepreneurship programs, coworking community events, government-sponsored small business training, and more.',
  },
  {
    question: 'Is this the same as the main Houston Business Calendar?',
    answer: 'No. The main Houston calendar shows all business and networking events. This page focuses exclusively on events designed for small business owners and entrepreneurs, making it easier to find the resources and connections you need.',
  },
  {
    question: 'Do you include SCORE and SBDC events in Houston?',
    answer: 'Absolutely. SCORE Houston and the University of Houston Small Business Development Center events are some of the most valuable free resources for small business owners, and we actively track all of their public workshops and seminars.',
  },
  {
    question: 'Do you include coworking community events in Houston?',
    answer: 'Yes. Houston has a growing coworking community and we track networking events, workshops, and community gatherings from coworking spaces across the city.',
  },
  {
    question: 'How is this different from the Houston Chamber calendar?',
    answer: 'The chamber calendar focuses on chamber of commerce events — luncheons, ribbon cuttings, and chamber mixers. This small business calendar focuses on education, training, government resources, entrepreneurship, and coworking community events designed specifically for small business owners.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Houston small business events every Monday morning.',
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
  'Coworking community events',
];

const ORGS = [
  'SCORE Houston',
  'SBA Houston District',
  'UH Small Business Development Center',
  'Houston Community College Entrepreneurship',
  'Houston Entrepreneurs',
  'Houston Small Business Network',
  'NAWBO Houston',
  'Houston Hispanic Entrepreneurs',
  'Station Houston (Startup Resources)',
  'BioHouston',
  'Houston Public Library Biz Center',
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

function HoustonSmallBusinessContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Houston Small Business Events Calendar | Free Weekly Small Business Events Email"
        description="Find small business workshops, entrepreneur events, coworking community gatherings, and small business networking in Houston. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/houston/small-business/"
        robots="noindex"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Houston', href: '/texas/houston' },
        { label: 'Small Business Events' },
      ]} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            HOUSTON SMALL BUSINESS CALENDAR
          </div>
          <h1>
            Small Business Events in the
            <br />
            <em>Houston</em> Area
          </h1>
          <p className="hero-subtext">
            Stop missing the small business events that help you grow your business.
          </p>
          <div className="hero-category-tags">
            Small Business &middot; Entrepreneur &middot; Workshops &middot; Mentorship &middot; Funding &middot; and more
          </div>
          <div className="hero-cta-group">
            <Link href="/texas/houston/subscribe" className="btn btn-white">
              Get My Free Houston Small Business Events Newsletter
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
          <p className="features-subtitle">We aggregate small business event sources across Houston so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to Small Business Events</h3>
              <p>Click subscribe above. Enter your email address. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's SCORE workshops, SBA seminars, and entrepreneur meetups in Houston.</p>
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
          <h2>Find Your Next Houston Small Business Event</h2>
          <p>Browse SCORE workshops, SBA seminars, entrepreneur meetups, and more</p>
        </div>
        <EventGate forcedCity="Houston" groupType="small_business" initialEvents={initialEvents} />
      </section>

      <section className="sa-orgs-section">
        <div className="sa-orgs-inner">
          <h2>Houston Small Business Organizations We Track</h2>
          <p>We monitor events from Houston's top small business resources so nothing slips through the cracks.</p>
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
          <h2>Never Miss a Small Business Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Building2 size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for Houston small business events and get that week's SCORE workshops, SBA seminars, and entrepreneur meetups in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse Houston's small business events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The newsletter and the calendar work together so you always know what's coming up in the small business community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by Houston Small Business Owners</h2>
          <p className="sp-subtitle">Houston Small Business Calendar — By the Numbers</p>
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
        heading="Why Houston Small Business Professionals Use This Calendar"
        subtitle="Houston small business events are spread across too many platforms and websites. Here's how Local Business Calendars helps Houston professionals keep up."
        problemText="Small business events in Houston are scattered across SCORE, SBA, SBDC, Meetup, and individual organizations. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track small business event hosts across Houston and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Houston Small Business Events Every Monday — Free</h2>
          <p>A curated digest of that week's small business events in Houston, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/houston/subscribe" className="btn btn-gold">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Houston business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-accent">Submit a Small Business Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/houston">See all Houston business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Houston Small Business Events</h2>
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
        citySlug="houston"
        cityName="Houston"
        categoryNav={{
          cityLabel: "Also in Houston:",
          links: [
            { label: "Technology Events", href: "/texas/houston/technology" },
            { label: "Real Estate Events", href: "/texas/houston/real-estate" },
            { label: "Chamber Events", href: "/texas/houston/chamber" },
            { label: "Networking Events", href: "/texas/houston/networking" }
          ]
        }}
      />
    </div>
  );
}

export function HoustonSmallBusinessPage({ initialEvents }: { initialEvents: Event[] }) {
  return <HoustonSmallBusinessContent initialEvents={initialEvents} />;
}
