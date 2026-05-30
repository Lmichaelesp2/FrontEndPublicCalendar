'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Briefcase, Users, Clock, Building2, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import { EventNetworkingMethodSection } from '../EventNetworkingMethodSection';
import type { Event } from '../../lib/supabase';
import { SponsorPatronSection } from '../SponsorPatronSection';
import { SponsorSubmitSection } from '../SponsorSubmitSection';

const STATS = [
  { number: '500+', label: 'Small business owners subscribed' },
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

function SanAntonioSmallBusinessContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="San Antonio Small Business Events Calendar | Free Weekly Small Business Events Email"
        description="Find SCORE workshops, SBA seminars, entrepreneur meetups, and small business networking events in San Antonio, Texas. Updated weekly."
        canonical="https://businesseventscalendars.com/texas/san-antonio/small-business/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Small Business Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="se-hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            SAN ANTONIO SMALL BUSINESS CALENDAR
          </div>
          <h1>
            Small Business Events in
            <br />
            the <em>San Antonio</em> area
          </h1>
          <p className="hero-sub">
            Entrepreneur workshops, small business panels, mentorship events, and funding meetups — San Antonio small business events organized and delivered every week.
          </p>
          <p className="se-hero-tags">Small Business &middot; Entrepreneur &middot; Workshops &middot; Mentorship &middot; Funding &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/san-antonio/small-business/subscribe" className="btn btn-primary">
              Get the Free San Antonio Small Business Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
        </div>
      </section>
      <SponsorPatronSection city="San Antonio" citySlug="san-antonio" category="Small Business" categorySlug="small-business" variant="hero" />





      <section className="features-section">
        <div className="features-inner">
          <h2>We Track San Antonio Small Business Events So You Don't Have To</h2>
          <p className="features-subtitle">San Antonio small business events — workshops, panels, mentorship meetups — are scattered across SBDC, SCORE, and local organization pages. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Enter your email</h3>
              <p>Enter your email and we deliver every upcoming event to your inbox every Monday. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top San Antonio small business events.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events and show up</h3>
              <p>Scan the list, choose what fits your schedule, and show up ready to connect.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Find Your Next San Antonio Small Business Event</h2>
          <p>Browse SCORE workshops, SBA seminars, entrepreneur meetups, and more</p>
        </div>
        <EventGate
          forcedCity="San Antonio"
          groupType="small_business"
          initialEvents={initialEvents}
          newsletterHeading="Get San Antonio Small Business Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's small business events in San Antonio, delivered to your inbox every Monday morning."
          subscribeHref="/texas/san-antonio/small-business/subscribe"
          citySlug="san-antonio"
          categorySlug="small-business"
        />
      </section>


            <WhySection
        heading="Why San Antonio Small Business Professionals Use This Calendar"
        subtitle="San Antonio small business events are spread across too many platforms and websites. Here's how Local Business Calendars helps San Antonio professionals keep up."
        problemText="Small business events in San Antonio are scattered across SCORE, SBA, SBDC, LiftFund, Meetup, and individual organizations. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track small business event hosts across San Antonio and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get San Antonio Small Business Events Every Monday — Free</h2>
          <p>A curated digest of that week's small business events in San Antonio, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/small-business/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Small Business Event</Link>
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

      <EventNetworkingMethodSection city="San Antonio" category="Small Business" />
      <SponsorSubmitSection city="San Antonio" citySlug="san-antonio" category="Small Business" categorySlug="small-business" />

      <Footer
        citySlug="san-antonio"
        cityName="San Antonio"
        categoryNav={{
          cityLabel: "Also in San Antonio:",
          links: [
            { label: "Technology Events", href: "/texas/san-antonio/technology" },
            { label: "Real Estate Events", href: "/texas/san-antonio/real-estate" },
            { label: "Chamber Events", href: "/texas/san-antonio/chamber" },
          ]
        }}
      />
    </div>
  );
}

export function SanAntonioSmallBusinessPage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioSmallBusinessContent initialEvents={initialEvents} />;
}
