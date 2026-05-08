'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Landmark, Users, Clock, Building2, Star } from 'lucide-react';
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
  { number: '25+', label: 'Chambers & associations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "Between the Dallas Regional Chamber, Irving Chamber, and Plano Chamber, I was checking three different websites every week. Now it's all in one calendar.",
    name: 'Patricia H.',
    location: 'Dallas, TX',
  },
  {
    quote: "The weekly chamber events email is exactly what I needed. I show up to more ribbon cuttings and luncheons than ever before.",
    name: 'Robert D.',
    location: 'Dallas, TX',
  },
  {
    quote: "As a chamber ambassador, having every chamber event across DFW in one view has been incredibly valuable for planning my week.",
    name: 'Angela S.',
    location: 'Dallas, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Which Dallas chambers are included in this calendar?',
    answer: 'We monitor the Dallas Regional Chamber, Irving Chamber of Commerce, Plano Chamber of Commerce, Frisco Chamber of Commerce, Dallas Black Chamber of Commerce, Dallas Hispanic Chamber of Commerce, and dozens of additional area chambers across the DFW metro.',
  },
  {
    question: 'Is this the same as the main Dallas Business Calendar?',
    answer: 'No. The main Dallas calendar shows all business and networking events across every category. This page focuses exclusively on chamber of commerce and business association events, making it easier to track the organizations that matter most to you.',
  },
  {
    question: 'What types of chamber events are listed?',
    answer: 'We track chamber luncheons, ribbon cuttings, Business After Hours mixers, ambassador meetings, legislative updates, annual galas, new member orientations, and more from chambers and business associations across Dallas-Fort Worth.',
  },
  {
    question: 'Do I need to be a chamber member to attend these events?',
    answer: 'Many chamber events are open to non-members, especially networking mixers and ribbon cuttings. The calendar shows the event details so you can see the requirements. Most chambers also welcome prospective members as guests.',
  },
  {
    question: 'Do you cover chambers across the entire DFW metro?',
    answer: 'Yes. We cover chambers in Dallas, Plano, Irving, Frisco, Allen, McKinney, Garland, Mesquite, Grand Prairie, Arlington, and other cities throughout the Dallas-Fort Worth metro area.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Dallas chamber events every Monday morning.',
  },
];

const ORGS = [
  'Dallas Regional Chamber',
  'Irving Chamber of Commerce',
  'Plano Chamber of Commerce',
  'Frisco Chamber of Commerce',
  'Dallas Black Chamber',
  'Dallas Hispanic Chamber',
  'Allen/Fairview Chamber',
  'McKinney Chamber of Commerce',
  'Garland Chamber of Commerce',
  'Mesquite Chamber of Commerce',
  'Grand Prairie Chamber',
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

function DallasChamberContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Dallas Chamber Events Calendar | Free Weekly Chamber Events Email"
        description="Find Dallas Chamber of Commerce events, chamber mixers, ribbon cuttings, and chamber networking in Dallas. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/dallas/chamber/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Dallas', href: '/texas/dallas' },
        { label: 'Chamber Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            DALLAS CHAMBER CALENDAR
          </div>
          <h1>
            Chamber of Commerce Events in
            <br />
            the <em>Dallas</em> Area
          </h1>
          <p className="hero-sub">
            Member mixers, business luncheons, ribbon cuttings, and chamber networking events — Dallas chamber events organized and delivered every week.
          </p>
          <p className="se-hero-tags">Chamber &middot; Networking &middot; Business Mixers &middot; Ribbon Cuttings &middot; Luncheons &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/dallas/chamber/subscribe" className="btn btn-primary">
              Get the Free Dallas Chamber Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
      </section>

      <SponsorPatronSection city="Dallas" category="Chamber" />

      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Dallas Chamber Events So You Don't Have To</h2>
          <p className="features-subtitle">Dallas chamber events — mixers, luncheons, ribbon cuttings — are scattered across chamber websites. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Dallas chamber events.</p>
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
          <h2>Find Your Next Dallas Chamber Event</h2>
          <p>Browse luncheons, Business After Hours, ribbon cuttings, and more</p>
        </div>
        <EventGate
          forcedCity="Dallas"
          groupType="chamber"
          initialEvents={initialEvents}
          newsletterHeading="Get Dallas Chamber Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's chamber events in Dallas, delivered to your inbox every Monday morning."
          subscribeHref="/texas/dallas/chamber/subscribe"
        />
      </section>


            <WhySection
        heading="Why Dallas Chamber Professionals Use This Calendar"
        subtitle="Dallas chamber events are spread across too many platforms and websites. Here's how Local Business Calendars helps Dallas chamber professionals keep up."
        problemText="Chamber events in Dallas are scattered across chamber websites, Eventbrite, LinkedIn, Facebook, and individual association pages. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track chamber event hosts across Dallas and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <EventNetworkingMethodSection city="Dallas" category="Chamber" />


      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Dallas Chamber Events Every Monday — Free</h2>
          <p>A curated digest of that week's chamber events in Dallas, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/dallas/chamber/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Dallas business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Chamber Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/dallas">See all Dallas business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Dallas Chamber Events</h2>
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
            { label: "Real Estate Events", href: "/texas/dallas/real-estate" },
            { label: "Small Business Events", href: "/texas/dallas/small-business" },
            { label: "Networking Events", href: "/texas/dallas/networking" }
          ]
        }}
      />
    </div>
  );
}

export function DallasChamberPage({ initialEvents }: { initialEvents: Event[] }) {
  return <DallasChamberContent initialEvents={initialEvents} />;
}
