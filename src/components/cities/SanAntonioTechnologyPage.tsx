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
    quote: "I finally have one place for all the tech meetups and hackathons in San Antonio. No more scrolling through five different platforms.",
    name: 'David R.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The weekly tech events newsletter is a game-changer. I've attended more meetups in the last month than I did all last year.",
    name: 'Priya K.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a startup founder, staying plugged into the SA tech scene is critical. This calendar makes it effortless.",
    name: 'Carlos G.',
    location: 'San Antonio, TX',
  },
];

const TECH_FAQ = [
  {
    question: 'What types of technology events are listed?',
    answer: 'We track software development meetups, cybersecurity events, data science workshops, AI/ML gatherings, startup pitch nights, tech networking mixers, hackathons, cloud computing sessions, and more across San Antonio.',
  },
  {
    question: 'Is this calendar free?',
    answer: 'Yes! The San Antonio technology events calendar and weekly newsletter are completely free — no credit card required.',
  },
  {
    question: 'How is this different from the main San Antonio calendar?',
    answer: 'The main San Antonio calendar shows all business and networking events. This page focuses exclusively on technology-related events, making it easier for tech professionals to find what matters most to them.',
  },
  {
    question: 'How do you find technology events in San Antonio?',
    answer: 'We monitor tech-focused organizations like Tech Bloc, Codeup, SA Developers, local tech Meetup groups, Geekdom, and many more — plus Eventbrite, LinkedIn, and Facebook tech communities in the San Antonio area.',
  },
  {
    question: 'Can I submit a technology event?',
    answer: 'Yes! Use our Submit Event page to add your tech event to the calendar for free. Just make sure to categorize it as a technology event.',
  },
  {
    question: 'Do you cover cybersecurity events?',
    answer: 'Absolutely. San Antonio is one of the nation\'s top cybersecurity hubs, and we actively track events from organizations like CyberTexas, ISSA San Antonio, and military-adjacent tech groups.',
  },
];

const TECH_EVENT_TYPES = [
  'Software development meetups',
  'Cybersecurity conferences & workshops',
  'AI / Machine Learning events',
  'Startup pitch nights & demo days',
  'Tech networking mixers',
  'Hackathons & coding events',
  'Cloud & DevOps workshops',
  'Data science & analytics meetups',
];

const TECH_ORGS = [
  'Tech Bloc',
  'Geekdom',
  'Codeup',
  'SA Developers',
  'CyberTexas Foundation',
  'ISSA San Antonio',
  'Women in Cybersecurity SA',
  'Google Developer Group SA',
  'SA Data Science',
  'Open Cloud Academy',
  'Rivard Report Tech',
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

function SanAntonioTechnologyContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="San Antonio Technology Events Calendar | Free Weekly Tech Events Email"
        description="Find tech meetups, cybersecurity events, hackathons, AI workshops, and developer gatherings in San Antonio, Texas. Updated weekly."
        canonical="https://businesseventscalendars.com/texas/san-antonio/technology/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Technology Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="se-hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            SAN ANTONIO TECHNOLOGY CALENDAR
          </div>
          <h1>
            Technology Events in
            <br />
            the <em>San Antonio</em> area
          </h1>
          <p className="hero-sub">
            Developer meetups, startup events, tech talks, and innovation panels — San Antonio technology events organized and delivered every week.
          </p>
          <p className="se-hero-tags">Technology &middot; Software &middot; Startups &middot; Dev Meetups &middot; Tech Talks &middot; and more</p>
          <div className="hero-cta-group">
            <Link href="/texas/san-antonio/technology/subscribe" className="btn btn-primary">
              Get the Free San Antonio Technology Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
          <div className="se-hero-right">
            <SponsorPatronSection city="San Antonio" citySlug="san-antonio" category="Technology" categorySlug="technology" variant="hero" />
          </div>
        </div>
      </section>

      <EventNetworkingMethodSection city="San Antonio" category="Technology" />



      <section className="features-section">
        <div className="features-inner">
          <h2>We Track San Antonio Tech Events So You Don't Have To</h2>
          <p className="features-subtitle">San Antonio tech events — developer meetups, startup events, tech talks — are scattered across Meetup, Eventbrite, and local tech org sites. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Enter your email</h3>
              <p>Enter your email and we deliver every upcoming event to your inbox every Monday. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top San Antonio tech events.</p>
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
          <h2>Find Your Next San Antonio Tech Event</h2>
          <p>Browse developer meetups, cybersecurity events, hackathons, and more</p>
        </div>
        <EventGate
          forcedCity="San Antonio"
          groupType="technology"
          initialEvents={initialEvents}
          newsletterHeading="Get San Antonio Technology Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's tech events in San Antonio, delivered to your inbox every Monday morning."
          subscribeHref="/texas/san-antonio/technology/subscribe"
        />
      </section>


            <WhySection
        heading="Why San Antonio Tech Professionals Use This Calendar"
        subtitle="San Antonio tech events are spread across too many platforms and websites. Here's how Local Business Calendars helps San Antonio professionals keep up."
        problemText="Tech events in San Antonio are scattered across Meetup groups, Eventbrite, LinkedIn, Slack channels, and individual org websites. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track tech event hosts across San Antonio and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get San Antonio Tech Events Every Monday — Free</h2>
          <p>A curated digest of that week's technology events in San Antonio, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/technology/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Tech Event</Link>
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
        citySlug="san-antonio"
        cityName="San Antonio"
        categoryNav={{
          cityLabel: "Also in San Antonio:",
          links: [
            { label: "Real Estate Events", href: "/texas/san-antonio/real-estate" },
            { label: "Chamber Events", href: "/texas/san-antonio/chamber" },
            { label: "Small Business Events", href: "/texas/san-antonio/small-business" },
            { label: "Networking Events", href: "/texas/san-antonio/networking" }
          ]
        }}
      />
    </div>
  );
}

export function SanAntonioTechnologyPage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioTechnologyContent initialEvents={initialEvents} />;
}
