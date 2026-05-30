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
    quote: "SCORE workshops, SBA seminars, and local entrepreneur meetups — all in one place. This calendar has been a lifeline for my growing Dallas business.",
    name: 'Maria G.',
    location: 'Dallas, TX',
  },
  {
    quote: "I used to miss free workshops and grant info sessions because I didn't know they existed. Now the weekly email keeps me in the loop every Monday.",
    name: 'Tony R.',
    location: 'Dallas, TX',
  },
  {
    quote: "As a solopreneur in DFW, networking events designed for small businesses are where I find clients and partners. This calendar makes finding them effortless.",
    name: 'Keisha B.',
    location: 'Dallas, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of organizations are included in this calendar?',
    answer: 'We track SCORE Dallas, the SBA North Texas district, the North Texas SBDC, coworking community events, Goldman Sachs 10,000 Small Businesses Dallas program events, and a wide range of entrepreneur development and community education organizations throughout DFW.',
  },
  {
    question: 'Is this the same as the main Dallas Business Calendar?',
    answer: 'No. The main Dallas calendar shows all business and networking events across every category. This page focuses exclusively on events designed for small business owners and entrepreneurs, making it easier to find the resources and connections you need.',
  },
  {
    question: 'Do you include SCORE and SBDC events in Dallas?',
    answer: 'Absolutely. SCORE Dallas and the North Texas Small Business Development Center are among the most valuable free resources for small business owners, and we actively track all of their public workshops and seminars.',
  },
  {
    question: 'Do you include coworking community events in DFW?',
    answer: 'Yes. Dallas-Fort Worth has a vibrant coworking community and many coworking spaces host regular networking events, workshops, and community gatherings. We track these events alongside other small business resources.',
  },
  {
    question: 'How is this different from the Dallas Chamber calendar?',
    answer: 'The chamber calendar focuses on chamber of commerce events — luncheons, ribbon cuttings, and Business After Hours. This small business calendar focuses on resources and events specifically designed for small business owners and entrepreneurs — workshops, mentoring, funding sessions, and entrepreneur communities.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Dallas small business events every Monday morning.',
  },
];

const ORGS = [
  'SCORE Dallas',
  'SBA North Texas District',
  'North Texas SBDC',
  'Goldman Sachs 10KSB Dallas',
  'DFW Entrepreneurs',
  'Dallas Small Business Network',
  'NAWBO Dallas',
  'Dallas Hispanic Entrepreneurs',
  'Capital Factory Dallas',
  'DFW Coworking Communities',
  'Dallas Public Library Biz Center',
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

function DallasSmallBusinessContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Dallas Small Business Events Calendar | Free Weekly Small Business Events Email"
        description="Find small business workshops, entrepreneur events, coworking community gatherings, and small business networking in Dallas. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/dallas/small-business/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Dallas', href: '/texas/dallas' },
        { label: 'Small Business Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="se-hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            DALLAS SMALL BUSINESS CALENDAR
          </div>
          <h1>
            Small Business Events in
            <br />
            the <em>Dallas</em> Area
          </h1>
          <p className="hero-sub">
            Entrepreneur workshops, small business panels, mentorship events, and funding meetups — Dallas small business events organized and delivered every week.
          </p>
          <p className="se-hero-tags">Small Business &middot; Entrepreneur &middot; Workshops &middot; Mentorship &middot; Funding &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/dallas/small-business/subscribe" className="btn btn-primary">
              Get the Free Dallas Small Business Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
        </div>
      </section>
      <SponsorPatronSection city="Dallas" citySlug="dallas" category="Small Business" categorySlug="small-business" variant="hero" />





      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Dallas Small Business Events So You Don't Have To</h2>
          <p className="features-subtitle">Dallas small business events — workshops, panels, funding meetups — are scattered across SBDC, SCORE, and local organization sites. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Enter your email</h3>
              <p>Enter your email and we deliver every upcoming event to your inbox every Monday. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Dallas small business events.</p>
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
          <h2>Find Your Next Dallas Small Business Event</h2>
          <p>Browse SCORE workshops, SBA seminars, entrepreneur meetups, and more</p>
        </div>
        <EventGate
          forcedCity="Dallas"
          groupType="small_business"
          initialEvents={initialEvents}
          newsletterHeading="Get Dallas Small Business Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's small business events in Dallas, delivered to your inbox every Monday morning."
          subscribeHref="/texas/dallas/small-business/subscribe"
          citySlug="dallas"
          categorySlug="small-business"
        />
      </section>


            <WhySection
        heading="Why Dallas Small Business Professionals Use This Calendar"
        subtitle="Dallas small business events are spread across too many platforms and websites. Here's how Local Business Calendars helps Dallas professionals keep up."
        problemText="Small business events in Dallas are scattered across SCORE, SBA, SBDC, Meetup, coworking spaces, and individual organizations. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track small business event hosts across Dallas and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Dallas Small Business Events Every Monday — Free</h2>
          <p>A curated digest of that week's small business events in Dallas, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/dallas/small-business/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Dallas business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Small Business Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/dallas">See all Dallas business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Dallas Small Business Events</h2>
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

      <EventNetworkingMethodSection city="Dallas" category="Small Business" />
      <SponsorSubmitSection city="Dallas" citySlug="dallas" category="Small Business" categorySlug="small-business" />

      <Footer
        citySlug="dallas"
        cityName="Dallas"
        categoryNav={{
          cityLabel: "Also in Dallas:",
          links: [
            { label: "Technology Events", href: "/texas/dallas/technology" },
            { label: "Real Estate Events", href: "/texas/dallas/real-estate" },
            { label: "Chamber Events", href: "/texas/dallas/chamber" },
          ]
        }}
      />
    </div>
  );
}

export function DallasSmallBusinessPage({ initialEvents }: { initialEvents: Event[] }) {
  return <DallasSmallBusinessContent initialEvents={initialEvents} />;
}
