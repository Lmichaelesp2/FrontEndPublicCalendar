'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Search, Mail, Users, Clock, Star } from 'lucide-react';
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

const NETWORKING_STATS = [
  { number: '500+', label: 'San Antonio professionals subscribed' },
  { number: '25+', label: 'Networking organizations tracked' },
];

const NETWORKING_TESTIMONIALS = [
  {
    quote: "I finally have one place to track every BNI chapter meeting, leads group, and referral network event in San Antonio. It saves me so much time.",
    name: 'Maria L.',
    location: 'San Antonio, TX',
  },
  {
    quote: "The Monday networking events newsletter is the first email I open every week. I've made more connections in the last 60 days than in the past year.",
    name: 'James T.',
    location: 'San Antonio, TX',
  },
  {
    quote: "As a commercial real estate broker, referrals are everything. This calendar helped me find the right networking groups without hours of research.",
    name: 'Sandra M.',
    location: 'San Antonio, TX',
  },
];

const NETWORKING_FAQ = [
  {
    question: 'What types of networking organizations are listed?',
    answer: 'We track BNI chapters, leads groups, referral networking groups, professional associations, business mixers, chamber after-hours events, and structured networking organizations throughout San Antonio.',
  },
  {
    question: 'Is this the same as the main San Antonio Business Calendar?',
    answer: 'No. The main San Antonio calendar shows all business events across every category. This page filters exclusively to networking-focused events — leads groups, referral organizations, and professional networking gatherings.',
  },
  {
    question: 'How is structured networking different from general business events?',
    answer: 'Structured networking events like BNI chapters or leads groups meet regularly with the specific goal of building referral relationships. General business events may include speakers, education, or social components. This page focuses on events where relationship-building and referrals are the primary purpose.',
  },
  {
    question: 'Do you list BNI chapter meetings?',
    answer: 'Yes. We track BNI chapters throughout the San Antonio metro area. BNI meetings are among the most structured and effective referral networking formats, and we include them here.',
  },
  {
    question: 'How do I find the right networking group for me?',
    answer: 'Browse here to see what groups meet near you and at times that work for your schedule. Most networking groups offer a free guest visit — the listing gives you the event details so you can try one out before committing.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive San Antonio networking events every Monday morning.',
  },
];

const NETWORKING_ORGS = [
  'BNI San Antonio Chapters',
  'San Antonio Chamber of Commerce',
  'North San Antonio Chamber',
  'Hispanic Chamber of Commerce SA',
  'San Antonio Professionals Network',
  'SA Business Leads Groups',
  'Women\'s Business Networking SA',
  'SCORE San Antonio',
  'Young Professionals SA',
  'SA Referral Groups',
  'LeTip San Antonio',
  '... and many more',
];

function NetworkingFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
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

function SanAntonioNetworkingContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="San Antonio Networking Events | Free Weekly Networking Events Email"
        description="Find BNI chapters, leads groups, referral networks, and professional networking events in San Antonio. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/san-antonio/networking/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'San Antonio', href: '/texas/san-antonio' },
        { label: 'Networking Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="se-hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            SAN ANTONIO NETWORKING EVENTS
          </div>
          <h1>
            Networking Events in
            <br />
            the <em>San Antonio</em> Area
          </h1>
          <p className="hero-sub">
            Professional mixers, referral groups, business happy hours, and networking luncheons — San Antonio networking events organized and delivered every week.
          </p>
          
          <div className="hero-cta-group">
            <Link href="/texas/san-antonio/networking/subscribe" className="btn btn-primary">
              Get the Free San Antonio Networking Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
        </div>
      </section>
      <SponsorPatronSection city="San Antonio" citySlug="san-antonio" category="Networking" categorySlug="networking" variant="hero" />





      <section className="features-section">
        <div className="features-inner">
          <h2>We Track San Antonio Networking Events So You Don't Have To</h2>
          <p className="features-subtitle">San Antonio networking events are scattered across BNI chapters, Meetup, LinkedIn, and local group pages. We organize them in one place.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Enter your email</h3>
              <p>Enter your email and we deliver every upcoming event to your inbox every Monday. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top San Antonio networking events.</p>
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
          <h2>Today's Networking Events in San Antonio</h2>
          <p>Browse BNI chapters, leads groups, referral networks, and professional mixers</p>
        </div>
        <EventGate
          forcedCity="San Antonio"
          groupType="networking"
          initialEvents={initialEvents}
          newsletterHeading="Get San Antonio Networking Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's networking events in San Antonio, delivered to your inbox every Monday morning."
          subscribeHref="/texas/san-antonio/networking/subscribe"
          citySlug="san-antonio"
          categorySlug="networking"
        />
      </section>


            <WhySection
        heading="Why San Antonio Networking Professionals Use This"
        subtitle="San Antonio networking events are spread across too many platforms and websites. Here's how Local Business Calendars helps San Antonio professionals keep up."
        problemText="Networking events in San Antonio are scattered across BNI chapter websites, Meetup groups, LinkedIn, Facebook, and individual organization pages. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track networking event hosts across San Antonio and organize their public events in one place — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get San Antonio Networking Events Every Monday — Free</h2>
          <p>A curated digest of that week's networking events in San Antonio, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/san-antonio/networking/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all San Antonio business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Networking Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/san-antonio">See all San Antonio business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About San Antonio Networking Events</h2>
          <div className="faq-list">
            {NETWORKING_FAQ.map((item, i) => (
              <NetworkingFaqItem
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

      <EventNetworkingMethodSection city="San Antonio" category="Networking" />
      <SponsorSubmitSection city="San Antonio" citySlug="san-antonio" category="Networking" categorySlug="networking" />

      <Footer
        citySlug="san-antonio"
        cityName="San Antonio"
        categoryNav={{
          cityLabel: "Also in San Antonio:",
          links: [
            { label: "Technology Events", href: "/texas/san-antonio/technology" },
            { label: "Real Estate Events", href: "/texas/san-antonio/real-estate" },
            { label: "Chamber Events", href: "/texas/san-antonio/chamber" },
            { label: "Small Business Events", href: "/texas/san-antonio/small-business" }
          ]
        }}
      />
    </div>
  );
}

export function SanAntonioNetworkingPage({ initialEvents }: { initialEvents: Event[] }) {
  return <SanAntonioNetworkingContent initialEvents={initialEvents} />;
}
