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
  { number: '500+', label: 'Chamber members subscribed' },
  { number: '30+', label: 'Chambers & associations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Between the Greater Houston Partnership, the Hispanic Chamber, and the Black Chamber, I was checking three different websites every week. Now it's all in one calendar.",
    name: 'Patricia H.',
    location: 'Houston, TX',
  },
  {
    quote: "The weekly chamber events email is exactly what I needed. I show up to more ribbon cuttings and luncheons than ever before.",
    name: 'Robert D.',
    location: 'Houston, TX',
  },
  {
    quote: "As a chamber ambassador, having every chamber event across Houston in one view has been incredibly valuable for planning my week.",
    name: 'Angela S.',
    location: 'Houston, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Which Houston chambers are included in this calendar?',
    answer: 'We track the Greater Houston Partnership, Houston Hispanic Chamber of Commerce, Houston Black Chamber of Commerce, Fort Bend Chamber of Commerce, Cy-Fair Houston Chamber, and many more area chambers across the Houston metro.',
  },
  {
    question: 'Is this the same as the main Houston Business Calendar?',
    answer: 'No. The main Houston calendar shows all business and networking events. This page focuses exclusively on chamber of commerce and business association events, making it easier to track the organizations that matter most to you.',
  },
  {
    question: 'What types of chamber events are listed?',
    answer: 'We track chamber luncheons, ribbon cuttings, Business After Hours mixers, ambassador meetings, legislative updates, annual galas, and more from chambers and business associations across Houston.',
  },
  {
    question: 'Do I need to be a chamber member to attend these events?',
    answer: 'Many chamber events are open to non-members and prospective members. Check the individual event listing for details. Most chambers welcome guests at select events to give you a feel for membership.',
  },
  {
    question: 'Do you cover chambers across the entire Houston metro area?',
    answer: 'Yes. We cover chambers from across the Houston metro — Downtown, the Woodlands, Sugar Land, Katy, Pearland, Cy-Fair, Fort Bend, and beyond.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Houston chamber events every Monday morning.',
  },
];

const EVENT_TYPES = [
  'Chamber luncheons & breakfasts',
  'Business After Hours mixers',
  'Ribbon cuttings & grand openings',
  'Ambassador committee meetings',
  'Legislative update sessions',
  'Annual galas & award ceremonies',
  'New member orientations',
  'Multi-chamber joint events',
];

const ORGS = [
  'Greater Houston Partnership',
  'Houston Hispanic Chamber',
  'Houston Black Chamber',
  'Fort Bend Chamber',
  'Cy-Fair Houston Chamber',
  'Houston Asian Chamber',
  'Houston LGBT+ Chamber',
  'Pearland Chamber of Commerce',
  'Katy Area Chamber',
  'The Woodlands Chamber',
  'Sugar Land Chamber',
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

function HoustonChamberContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Houston Chamber Events Calendar | Free Weekly Chamber Events Email"
        description="Find Houston Chamber of Commerce events, chamber mixers, ribbon cuttings, and chamber networking in Houston. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/houston/chamber/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Houston', href: '/texas/houston' },
        { label: 'Chamber Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            HOUSTON CHAMBER CALENDAR
          </div>
          <h1>
            Chamber of Commerce Events in the
            <br />
            <em>Houston</em> Area
          </h1>
          <p className="hero-sub">
            Business luncheons, ribbon cuttings, member mixers, and chamber networking events — Houston chamber events tracked and delivered every week.
          </p>
          <p className="se-hero-tags">Chamber &middot; Networking &middot; Business Mixers &middot; Ribbon Cuttings &middot; Luncheons &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/houston/chamber/subscribe" className="btn btn-primary">
              Get the Free Houston Chamber Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
      </section>

      <SponsorPatronSection city="Houston" category="Chamber" />

      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Houston Chamber Events So You Don't Have To</h2>
          <p className="features-subtitle">Houston chamber events are spread across multiple chamber and association websites. We bring them together into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Houston chamber events.</p>
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
          <h2>Find Your Next Houston Chamber Event</h2>
          <p>Browse luncheons, Business After Hours, ribbon cuttings, and more</p>
        </div>
        <EventGate
          forcedCity="Houston"
          groupType="chamber"
          initialEvents={initialEvents}
          newsletterHeading="Get Houston Chamber Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's chamber events in Houston, delivered to your inbox every Monday morning."
          subscribeHref="/texas/houston/chamber/subscribe"
        />
      </section>


            <WhySection
        heading="Why Houston Chamber Professionals Use This Calendar"
        subtitle="Houston chamber events are spread across too many platforms and websites. Here's how Local Business Calendars helps Houston chamber professionals keep up."
        problemText="Chamber events in Houston are scattered across chamber websites, Eventbrite, LinkedIn, Facebook, and individual association pages. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track chamber event hosts across Houston and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <EventNetworkingMethodSection city="Houston" category="Chamber" />


      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Houston Chamber Events Every Monday — Free</h2>
          <p>A curated digest of that week's chamber events in Houston, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/houston/chamber/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Houston business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Chamber Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/houston">See all Houston business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Houston Chamber Events</h2>
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
            { label: "Small Business Events", href: "/texas/houston/small-business" },
            { label: "Networking Events", href: "/texas/houston/networking" }
          ]
        }}
      />
    </div>
  );
}

export function HoustonChamberPage({ initialEvents }: { initialEvents: Event[] }) {
  return <HoustonChamberContent initialEvents={initialEvents} />;
}
