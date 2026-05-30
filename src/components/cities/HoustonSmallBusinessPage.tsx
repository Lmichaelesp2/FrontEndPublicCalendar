'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Users, Clock, Building2, Star } from 'lucide-react';
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
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Houston', href: '/texas/houston' },
        { label: 'Small Business Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="se-hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            HOUSTON SMALL BUSINESS CALENDAR
          </div>
          <h1>
            Small Business Events in the
            <br />
            <em>Houston</em> Area
          </h1>
          <p className="hero-sub">
            Entrepreneur workshops, small business panels, mentorship events, and funding meetups — Houston small business events tracked and delivered every week.
          </p>
          <p className="se-hero-tags">Small Business &middot; Entrepreneur &middot; Workshops &middot; Mentorship &middot; Funding &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/houston/small-business/subscribe" className="btn btn-primary">
              Get the Free Houston Small Business Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
        </div>
      </section>
      <SponsorPatronSection city="Houston" citySlug="houston" category="Small Business" categorySlug="small-business" variant="hero" />





      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Houston Small Business Events So You Don't Have To</h2>
          <p className="features-subtitle">Houston small business events are spread across SBDC, SCORE, and local business organization pages. We bring them together into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Enter your email</h3>
              <p>Enter your email and we deliver every upcoming event to your inbox every Monday. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Houston small business events.</p>
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
          <h2>Find Your Next Houston Small Business Event</h2>
          <p>Browse SCORE workshops, SBA seminars, entrepreneur meetups, and more</p>
        </div>
        <EventGate
          forcedCity="Houston"
          groupType="small_business"
          initialEvents={initialEvents}
          newsletterHeading="Get Houston Small Business Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's small business events in Houston, delivered to your inbox every Monday morning."
          subscribeHref="/texas/houston/small-business/subscribe"
          citySlug="houston"
          categorySlug="small-business"
        />
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
            <Link href="/texas/houston/small-business/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Houston business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Small Business Event</Link>
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

      <EventNetworkingMethodSection city="Houston" category="Small Business" />
      <SponsorSubmitSection city="Houston" citySlug="houston" category="Small Business" categorySlug="small-business" />

      <Footer
        citySlug="houston"
        cityName="Houston"
        categoryNav={{
          cityLabel: "Also in Houston:",
          links: [
            { label: "Technology Events", href: "/texas/houston/technology" },
            { label: "Real Estate Events", href: "/texas/houston/real-estate" },
            { label: "Chamber Events", href: "/texas/houston/chamber" },
          ]
        }}
      />
    </div>
  );
}

export function HoustonSmallBusinessPage({ initialEvents }: { initialEvents: Event[] }) {
  return <HoustonSmallBusinessContent initialEvents={initialEvents} />;
}
