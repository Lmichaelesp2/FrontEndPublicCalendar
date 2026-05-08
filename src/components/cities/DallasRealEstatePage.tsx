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

const STATS = [
  { number: '500+', label: 'Real estate professionals subscribed' },
  { number: '40+', label: 'Real estate organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "I used to miss investor meetups and TREC events. Now everything is in one place and I never fall behind on what's happening in DFW real estate.",
    name: 'Rachel T.',
    location: 'Dallas, TX',
  },
  {
    quote: "The weekly real estate events newsletter keeps me in the loop on networking lunches and CE classes without any effort.",
    name: 'James W.',
    location: 'Dallas, TX',
  },
  {
    quote: "As a commercial broker, staying connected to the Dallas real estate community is everything. This calendar makes it automatic.",
    name: 'Linda M.',
    location: 'Dallas, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of real estate events are listed?',
    answer: 'We track investor meetups, REIA chapter meetings, broker networking events, real estate mixers, continuing education classes, market update seminars, construction industry events, and design community gatherings across Dallas-Fort Worth.',
  },
  {
    question: 'Do you include construction and design industry events?',
    answer: 'Yes. The Dallas real estate calendar includes construction industry associations, interior design community events, and related trade organizations alongside traditional real estate networking and investor events.',
  },
  {
    question: 'Is this the same as the main Dallas Business Calendar?',
    answer: 'No. The main Dallas calendar shows all business and networking events across every category. This page focuses exclusively on real estate, construction, and design industry events, making it easier for professionals in those fields to find what matters most.',
  },
  {
    question: 'Do you list REIA meetings and real estate investor events in DFW?',
    answer: 'Yes. Dallas-Fort Worth has a very active real estate investment community and we track events from local REIA chapters, wholesaler meetups, multifamily networking groups, and investor organizations throughout the metro.',
  },
  {
    question: 'Do you cover commercial real estate events in Dallas?',
    answer: 'Absolutely. We track CCIM North Texas, NAIOP Dallas-Fort Worth, IREM Dallas, and other commercial real estate organizations that run consistent events across the DFW market.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Dallas real estate events every Monday morning.',
  },
];

const ORGS = [
  'MetroTex Association of Realtors',
  'Dallas REIA',
  'CCIM North Texas',
  'NAIOP Dallas-Fort Worth',
  'IREM Dallas',
  'DFW Real Estate Investors',
  'Women\'s Council of Realtors Dallas',
  'Texas Realtors Dallas Chapter',
  'DFW Apartment Association',
  'Dallas Builders Association',
  'AIA Dallas',
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

function DallasRealEstateContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Dallas Real Estate Events Calendar | Free Weekly Real Estate Events Email"
        description="Find real estate networking, investor meetups, construction events, and design industry gatherings in Dallas. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/dallas/real-estate/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Dallas', href: '/texas/dallas' },
        { label: 'Real Estate Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            DALLAS REAL ESTATE CALENDAR
          </div>
          <h1>
            Real Estate, Construction &amp; Design Events in
            <br />
            the <em>Dallas</em> Area
          </h1>
          <p className="hero-sub">
            Investor meetups, agent networking events, property tours, and real estate luncheons — Dallas real estate events organized and delivered every week.
          </p>
          <p className="se-hero-tags">Real Estate &middot; Networking &middot; Property Trends &middot; Investor Meetups &middot; Commercial Deals &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/dallas/real-estate/subscribe" className="btn btn-primary">
              Get the Free Dallas Real Estate Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
      </section>

      <SponsorPatronSection city="Dallas" category="Real Estate" />

      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Dallas Real Estate Events So You Don't Have To</h2>
          <p className="features-subtitle">Dallas real estate events — investor meetups, agent networking, commercial gatherings — are scattered across multiple sites. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Dallas real estate events.</p>
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
          <h2>Find Your Next Dallas Real Estate Event</h2>
          <p>Browse investor meetups, networking events, CE classes, and more</p>
        </div>
        <EventGate
          forcedCity="Dallas"
          groupType="real_estate"
          initialEvents={initialEvents}
          newsletterHeading="Get Dallas Real Estate Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's real estate events in Dallas, delivered to your inbox every Monday morning."
          subscribeHref="/texas/dallas/real-estate/subscribe"
        />
      </section>


            <WhySection
        heading="Why Dallas Real Estate Professionals Use This Calendar"
        subtitle="Dallas real estate events are spread across too many platforms and websites. Here's how Local Business Calendars helps Dallas professionals keep up."
        problemText="Real estate events in Dallas are scattered across MetroTex, Meetup groups, Eventbrite, LinkedIn, and individual brokerage websites. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track real estate event hosts across Dallas and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <EventNetworkingMethodSection city="Dallas" category="Real Estate" />


      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Dallas Real Estate Events Every Monday — Free</h2>
          <p>A curated digest of that week's real estate events in Dallas, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/dallas/real-estate/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Dallas business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Real Estate Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/dallas">See all Dallas business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Dallas Real Estate Events</h2>
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
            { label: "Technology Events", href: "/texas/dallas/technology" },
            { label: "Chamber Events", href: "/texas/dallas/chamber" },
            { label: "Small Business Events", href: "/texas/dallas/small-business" },
            { label: "Networking Events", href: "/texas/dallas/networking" }
          ]
        }}
      />
    </div>
  );
}

export function DallasRealEstatePage({ initialEvents }: { initialEvents: Event[] }) {
  return <DallasRealEstateContent initialEvents={initialEvents} />;
}
