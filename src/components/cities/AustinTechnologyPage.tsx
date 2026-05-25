'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Monitor, Users, Clock, Star } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Breadcrumb } from '../Breadcrumb';
import { Footer } from '../Footer';
import { SEOHead } from '../SEOHead';
import { EventGate } from '../EventGate';
import { WhySection } from '../WhySection';
import { EventNetworkingMethodSection } from '../EventNetworkingMethodSection';
import type { Event } from '../../lib/supabase';
import { SponsorPatronSection } from '../SponsorPatronSection';

const TECH_STATS = [
  { number: '500+', label: 'Tech professionals subscribed' },
  { number: '50+', label: 'Tech organizations tracked' },
];

const TECH_TESTIMONIALS = [
  {
    quote: "I finally have one place for all the tech meetups and startup events in Austin. No more scrolling through five different platforms.",
    name: 'David R.',
    location: 'Austin, TX',
  },
  {
    quote: "The weekly tech events newsletter is a game-changer. I've attended more meetups in the last month than I did all last year.",
    name: 'Priya K.',
    location: 'Austin, TX',
  },
  {
    quote: "As a startup founder in Silicon Hills, staying plugged into the Austin tech scene is critical. This calendar makes it effortless.",
    name: 'Carlos G.',
    location: 'Austin, TX',
  },
];

const TECH_FAQ = [
  {
    question: 'What types of technology events are listed?',
    answer: 'We track software development meetups, AI/ML workshops, startup pitch nights, tech networking mixers, hackathons, cloud computing sessions, data science events, and more across Austin.',
  },
  {
    question: 'Is this the same as the main Austin Business Calendar?',
    answer: 'No. The main Austin calendar shows all business and networking events. This page focuses exclusively on technology-related events, making it easier for tech professionals to find what matters most to them.',
  },
  {
    question: 'How is this different from just searching Meetup?',
    answer: 'Meetup only shows events posted on their platform. We aggregate Austin tech events from Meetup, Eventbrite, LinkedIn, organization websites, Slack communities, and more — so you get a complete picture in one place.',
  },
  {
    question: 'Do you cover startup events and founder networking?',
    answer: 'Absolutely. Austin has one of the most active startup communities in the country, and we track events from Capital Factory, ATX Startups, and many other startup-focused organizations.',
  },
  {
    question: 'Do you cover AI and machine learning events in Austin?',
    answer: 'Yes. Austin\'s AI and ML community is growing rapidly. We track Austin AI meetups, data science groups, and machine learning workshops across the city.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Austin technology events every Monday morning.',
  },
];

const TECH_ORGS = [
  'Capital Factory',
  'Austin Technology Council',
  'Austin Startups',
  'ATX Hack for Change',
  'Google Developer Group Austin',
  'Austin AI & Machine Learning',
  'Dell Medical School Tech',
  'Women Who Code Austin',
  'Austin Data Science',
  'Austin AWS User Group',
  'React Austin',
  '... and many more',
];

function TechFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
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

function AustinTechnologyContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Austin Technology Events Calendar | Free Weekly Tech Events Email"
        description="Find tech meetups, developer groups, startup events, and technology networking in Austin. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/austin/technology/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Austin', href: '/texas/austin' },
        { label: 'Technology Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="se-hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AUSTIN TECHNOLOGY CALENDAR
          </div>
          <h1>
            Technology Events in the
            <br />
            <em>Austin</em> Area
          </h1>
          <p className="hero-sub">
            Developer meetups, startup events, tech talks, and innovation panels — Austin technology events tracked and delivered every week.
          </p>
          <p className="se-hero-tags">Technology &middot; Software &middot; Startups &middot; Dev Meetups &middot; Tech Talks &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/austin/technology/subscribe" className="btn btn-primary">
              Get the Free Austin Technology Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
          <div className="se-hero-right">
            <SponsorPatronSection city="Austin" citySlug="austin" category="Technology" categorySlug="technology" variant="hero" />
          </div>
        </div>
      </section>

      <EventNetworkingMethodSection city="Austin" category="Technology" />



      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Austin Tech Events So You Don't Have To</h2>
          <p className="features-subtitle">Austin tech events are spread across Meetup, startup community sites, Eventbrite, and accelerator pages. We pull them together into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Enter your email</h3>
              <p>Enter your email and we deliver every upcoming event to your inbox every Monday. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Austin tech events.</p>
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
          <h2>Find Your Next Austin Tech Event</h2>
          <p>Browse developer meetups, startup events, hackathons, and more</p>
        </div>
        <EventGate
          forcedCity="Austin"
          groupType="technology"
          initialEvents={initialEvents}
          newsletterHeading="Get Austin Technology Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's tech events in Austin, delivered to your inbox every Monday morning."
          subscribeHref="/texas/austin/technology/subscribe"
        />
      </section>


            <WhySection
        heading="Austin's Technology Community"
        subtitle="Austin technology events are spread across too many platforms and websites. Here's how Local Business Calendars helps Austin tech professionals keep up."
        problemText="Tech events are buried across Meetup groups, Eventbrite, LinkedIn, Slack channels, and individual org websites. It's impossible to track them all."
        whatWeDoText="We monitor Austin's top tech organizations and platforms, then organize their events into one focused calendar updated weekly."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Austin Tech Events Every Monday — Free</h2>
          <p>A curated digest of that week's technology events in Austin, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/austin/technology/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Austin business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Tech Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/austin">See all Austin business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Austin Technology Events</h2>
          <div className="faq-list">
            {TECH_FAQ.map((item, i) => (
              <TechFaqItem
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
        citySlug="austin"
        cityName="Austin"
        categoryNav={{
          cityLabel: "Also in Austin:",
          links: [
            { label: "Real Estate Events", href: "/texas/austin/real-estate" },
            { label: "Chamber Events", href: "/texas/austin/chamber" },
            { label: "Small Business Events", href: "/texas/austin/small-business" },
          ]
        }}
      />
    </div>
  );
}

export function AustinTechnologyPage({ initialEvents }: { initialEvents: Event[] }) {
  return <AustinTechnologyContent initialEvents={initialEvents} />;
}
