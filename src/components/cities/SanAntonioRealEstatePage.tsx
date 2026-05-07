'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Home, Users, Clock, Building2, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import { EventNetworkingCalendarHelper } from '../EventNetworkingCalendarHelper';
import type { Event } from '../../lib/supabase';
import { SponsorCard } from '../SponsorSection';

const STATS = [
  { number: '500+', label: 'Real estate professionals subscribed' },
  { number: '40+', label: 'Real estate organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "I used to miss half the SABOR events and investor meetups. Now everything is in one place and I never fall behind.",
    name: 'Rachel T.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The weekly real estate events newsletter keeps me in the loop on open houses, networking lunches, and CE classes without any effort.",
    name: 'James W.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a commercial broker, staying connected to the SA real estate community is everything. This calendar makes it automatic.",
    name: 'Linda M.',
    location: 'San Antonio, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of real estate events are listed?',
    answer: 'We track investor meetups, SABOR events, broker open houses, real estate networking mixers, continuing education classes, property tours, market update seminars, and more across San Antonio.',
  },
  {
    question: 'Is this calendar free?',
    answer: 'Yes! The San Antonio real estate events calendar and weekly newsletter are completely free — no credit card required.',
  },
  {
    question: 'How is this different from the main San Antonio calendar?',
    answer: 'The main San Antonio calendar shows all business and networking events. This page focuses exclusively on real estate events, making it easier for agents, brokers, investors, and property professionals to find what matters most.',
  },
  {
    question: 'How do you find real estate events in San Antonio?',
    answer: 'We monitor SABOR, local REI groups, CCIM, IREM, real estate Meetup groups, Eventbrite, LinkedIn, and Facebook real estate communities in the San Antonio area.',
  },
  {
    question: 'Can I submit a real estate event?',
    answer: 'Yes! Use our Submit Event page to add your real estate event to the calendar for free. Just make sure to categorize it as a real estate event.',
  },
  {
    question: 'Do you cover investor meetups?',
    answer: 'Absolutely. San Antonio has a very active real estate investment community and we track events from local REI clubs, wholesaler meetups, and multifamily networking groups.',
  },
];

const EVENT_TYPES = [
  'Real estate networking mixers',
  'Investor meetups & REI clubs',
  'SABOR events & CE classes',
  'Broker open houses & tours',
  'Market update seminars',
  'Commercial real estate events',
  'Property management workshops',
  'First-time homebuyer events',
];

const ORGS = [
  'SABOR',
  'SA Real Estate Investors',
  'CCIM South Texas',
  'IREM San Antonio',
  'SA Apartment Association',
  'Women\'s Council of Realtors SA',
  'SA Commercial Brokers Assoc.',
  'Texas Realtors SA Chapter',
  'Keller Williams SA Events',
  'SA REI Meetup Group',
  'Alamo Area Landlords',
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

function SanAntonioRealEstateContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="San Antonio Real Estate Events Calendar | Free Weekly Real Estate Events Email"
        description="Find real estate networking events, investor meetups, SABOR events, broker tours, and CE classes in San Antonio, Texas. Updated weekly."
        canonical="https://businesseventscalendars.com/texas/san-antonio/real-estate/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Real Estate Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            SAN ANTONIO REAL ESTATE CALENDAR
          </div>
          <h1>
            Real Estate Events in
            <br />
            the <em>San Antonio</em> area
          </h1>
          <p className="hero-sub">
            Investor meetups, agent networking events, property tours, and real estate luncheons — San Antonio real estate events organized and delivered every week.
          </p>
          <p className="se-hero-tags">Real Estate &middot; Networking &middot; Property Trends &middot; Investor Meetups &middot; Commercial Deals &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/san-antonio/real-estate/subscribe" className="btn btn-primary">
              Get the Free San Antonio Real Estate Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
      </section>

      <SponsorCard cityName="San Antonio" category="Real Estate" />

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Real Estate Event</h2>
          <p>Browse investor meetups, SABOR events, broker tours, and more</p>
        </div>
        <EventNetworkingCalendarHelper />

        <EventGate
          forcedCity="San Antonio"
          groupType="real_estate"
          initialEvents={initialEvents}
          newsletterHeading="Get San Antonio Real Estate Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's real estate events in San Antonio, delivered to your inbox every Monday morning."
          subscribeHref="/texas/san-antonio/real-estate/subscribe"
        />
      </section>

      <section className="features-section">
        <div className="features-inner">
          <h2>We Track San Antonio Real Estate Events So You Don't Have To</h2>
          <p className="features-subtitle">San Antonio real estate events — investor meetups, agent networking, property tours — are scattered across multiple sites. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top San Antonio real estate events.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events and show up</h3>
              <p>Scan the list, choose what fits your schedule, and show up ready to connect.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by San Antonio Real Estate Professionals</h2>
          <p className="sp-subtitle">San Antonio Real Estate Calendar — By the Numbers</p>
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
        heading="Why San Antonio Real Estate Professionals Use This Calendar"
        subtitle="San Antonio real estate events are spread across too many platforms and websites. Here's how Local Business Calendars helps San Antonio professionals keep up."
        problemText="Real estate events in San Antonio are scattered across SABOR, Meetup groups, Eventbrite, LinkedIn, and individual brokerage websites. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track real estate event hosts across San Antonio and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get San Antonio Real Estate Events Every Monday — Free</h2>
          <p>A curated digest of that week's real estate events in San Antonio, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/real-estate/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Real Estate Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/san-antonio">See all San Antonio business events &rarr;</Link>
      </div>

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

      <Footer
        citySlug="san-antonio"
        cityName="San Antonio"
        categoryNav={{
          cityLabel: "Also in San Antonio:",
          links: [
            { label: "Technology Events", href: "/texas/san-antonio/technology" },
            { label: "Chamber Events", href: "/texas/san-antonio/chamber" },
            { label: "Small Business Events", href: "/texas/san-antonio/small-business" },
            { label: "Networking Events", href: "/texas/san-antonio/networking" }
          ]
        }}
      />
    </div>
  );
}

export function SanAntonioRealEstatePage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioRealEstateContent initialEvents={initialEvents} />;
}
