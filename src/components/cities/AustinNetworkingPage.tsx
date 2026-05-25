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

const NETWORKING_STATS = [
  { number: '500+', label: 'Austin professionals subscribed' },
  { number: '25+', label: 'Networking organizations tracked' },
];

const NETWORKING_TESTIMONIALS = [
  {
    quote: "I finally have one place to track every BNI chapter meeting, leads group, and referral network event in Austin. It saves me so much time.",
    name: 'Maria L.',
    location: 'Austin, TX',
  },
  {
    quote: "The Monday networking events newsletter is the first email I open every week. I've made more connections in the last 60 days than in the past year.",
    name: 'James T.',
    location: 'Austin, TX',
  },
  {
    quote: "As a consultant in Austin, referrals are everything. This calendar helped me find the right networking groups without hours of research.",
    name: 'Sandra M.',
    location: 'Austin, TX',
  },
];

const NETWORKING_FAQ = [
  {
    question: 'What types of networking organizations are listed?',
    answer: 'We track BNI chapters, leads groups, referral networking groups, professional associations, business mixers, chamber after-hours events, and structured networking organizations throughout Austin.',
  },
  {
    question: 'Is this the same as the main Austin Business Calendar?',
    answer: 'No. The main Austin calendar shows all business events across every category. This page filters exclusively to networking-focused events — leads groups, referral organizations, and professional networking gatherings.',
  },
  {
    question: 'Do you list BNI chapter meetings in Austin?',
    answer: 'Yes. We track BNI chapters throughout the Austin metro area. BNI meetings are among the most structured and effective referral networking formats, and we include them in the calendar.',
  },
  {
    question: 'How is structured networking different from general business events?',
    answer: 'Structured networking events like BNI chapters or leads groups meet regularly with the specific goal of building referral relationships. General business events may include speakers, education, or social components. This calendar focuses on events where relationship-building and referrals are the primary purpose.',
  },
  {
    question: 'How do I find the right networking group for me in Austin?',
    answer: 'Browse the calendar to see what groups meet near you and at times that work for your schedule. Most networking groups offer a free guest visit — the calendar gives you the event details so you can try one out before committing.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Austin networking events every Monday morning.',
  },
];

const NETWORKING_ORGS = [
  'BNI Austin Chapters',
  'Austin Chamber of Commerce',
  'Austin Hispanic Chamber',
  'Asian Chamber of Commerce Austin',
  'Austin Professionals Network',
  'Austin Business Leads Groups',
  'Women\'s Business Networking Austin',
  'SCORE Austin',
  'Young Professionals Austin',
  'Austin Referral Groups',
  'LeTip Austin',
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

function AustinNetworkingContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Austin Networking Events Calendar | Free Weekly Networking Events Email"
        description="Find BNI chapters, leads groups, referral networks, and professional networking events in Austin. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/austin/networking/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Austin', href: '/texas/austin' },
        { label: 'Networking Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AUSTIN NETWORKING CALENDAR
          </div>
          <h1>
            Networking Events in the
            <br />
            <em>Austin</em> Area
          </h1>
          <p className="hero-sub">
            Business mixers, referral groups, professional happy hours, and networking luncheons — Austin networking events tracked and delivered every week.
          </p>
          
          <div className="hero-cta-group">
            <Link href="/texas/austin/networking/subscribe" className="btn btn-primary">
              Get the Free Austin Networking Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
      </section>

      <SponsorPatronSection city="Austin" category="Networking" />
      <EventNetworkingMethodSection city="Austin" category="Networking" />



      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Austin Networking Events So You Don't Have To</h2>
          <p className="features-subtitle">Austin networking events are spread across Meetup, LinkedIn, startup groups, and association pages. We pull them together into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Enter your email</h3>
              <p>Enter your email and we deliver every upcoming event to your inbox every Monday. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Austin networking events.</p>
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
          <h2>Today's Networking Events in Austin</h2>
          <p>Browse BNI chapters, leads groups, referral networks, and professional mixers</p>
        </div>
        <EventGate
          forcedCity="Austin"
          groupType="networking"
          initialEvents={initialEvents}
          newsletterHeading="Get Austin Networking Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's networking events in Austin, delivered to your inbox every Monday morning."
          subscribeHref="/texas/austin/networking/subscribe"
        />
      </section>


            <WhySection
        heading="Why Austin Networking Professionals Use This Calendar"
        subtitle="Austin networking events are spread across too many platforms and websites. Here's how Local Business Calendars helps Austin professionals keep up."
        problemText="Networking events in Austin are scattered across BNI chapter websites, Meetup groups, LinkedIn, Facebook, and individual organization pages. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track networking event hosts across Austin and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Austin Networking Events Every Monday — Free</h2>
          <p>A curated digest of that week's networking events in Austin, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/austin/networking/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Austin business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Networking Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/austin">See all Austin business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Austin Networking Events</h2>
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

      <Footer
        citySlug="austin"
        cityName="Austin"
        categoryNav={{
          cityLabel: "Also in Austin:",
          links: [
            { label: "Technology Events", href: "/texas/austin/technology" },
            { label: "Real Estate Events", href: "/texas/austin/real-estate" },
            { label: "Chamber Events", href: "/texas/austin/chamber" },
            { label: "Small Business Events", href: "/texas/austin/small-business" }
          ]
        }}
      />
    </div>
  );
}

export function AustinNetworkingPage({ initialEvents }: { initialEvents: Event[] }) {
  return <AustinNetworkingContent initialEvents={initialEvents} />;
}
