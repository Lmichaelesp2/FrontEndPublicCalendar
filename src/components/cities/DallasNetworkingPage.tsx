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
import { EventNetworkingCalendarHelper } from '../EventNetworkingCalendarHelper';
import type { Event } from '../../lib/supabase';
import { SponsorCard } from '../SponsorSection';

const STATS = [
  { number: '500+', label: 'Dallas professionals subscribed' },
  { number: '25+', label: 'Networking organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote: "I finally have one place to track every BNI chapter meeting, leads group, and referral network event in Dallas. It saves me so much time.",
    name: 'Maria L.',
    location: 'Dallas, TX',
  },
  {
    quote: "The Monday networking events newsletter is the first email I open every week. I've made more connections in the last 60 days than in the past year.",
    name: 'James T.',
    location: 'Dallas, TX',
  },
  {
    quote: "As a commercial real estate broker, referrals are everything. This calendar helped me find the right networking groups in DFW without hours of research.",
    name: 'Sandra M.',
    location: 'Dallas, TX',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of networking organizations are listed?',
    answer: 'We track BNI chapters, leads groups, referral networking groups, professional associations, business mixers, chamber after-hours events, and structured networking organizations throughout Dallas-Fort Worth.',
  },
  {
    question: 'Is this the same as the main Dallas Business Calendar?',
    answer: 'No. The main Dallas calendar shows all business events across every category. This page filters exclusively to networking-focused events — leads groups, referral organizations, and professional networking gatherings.',
  },
  {
    question: 'Do you list BNI chapter meetings in Dallas?',
    answer: 'Yes. We track BNI chapters throughout the Dallas-Fort Worth metro area. BNI meetings are among the most structured and effective referral networking formats, and we include them in the calendar.',
  },
  {
    question: 'Do you cover networking events across the entire DFW metro?',
    answer: 'Yes. We cover networking events in Dallas proper as well as Plano, Irving, Frisco, Allen, McKinney, Garland, Arlington, and other cities throughout the DFW metro area.',
  },
  {
    question: 'How do I find the right networking group for me in Dallas?',
    answer: 'Browse the calendar to see what groups meet near you and at times that work for your schedule. Most networking groups offer a free guest visit — the calendar gives you the event details so you can try one out before committing.',
  },
  {
    question: 'Is the newsletter really free?',
    answer: 'Yes, completely free. No credit card, no trial period, no paid tier. Just enter your email and you\'ll receive Dallas networking events every Monday morning.',
  },
];

const ORGS = [
  'BNI Dallas Chapters',
  'BNI North Dallas Chapters',
  'BNI Plano & Frisco Chapters',
  'Dallas Regional Chamber',
  'DFW Professionals Network',
  'Dallas Business Leads Groups',
  'Women\'s Business Networking Dallas',
  'SCORE Dallas',
  'Young Professionals Dallas',
  'DFW Referral Groups',
  'LeTip Dallas',
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

function DallasNetworkingContent({ initialEvents }: { initialEvents: Event[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sa-page">
      <SEOHead
        title="Dallas Networking Events Calendar | Free Weekly Networking Events Email"
        description="Find BNI chapters, leads groups, referral networks, and professional networking events in Dallas. Free weekly email every Monday."
        canonical="https://businesseventscalendars.com/texas/dallas/networking/"
      />

      <Navigation />

      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: 'Dallas', href: '/texas/dallas' },
        { label: 'Networking Events' },
      ]} />

            <section className="se-hero">
        <div className="se-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            DALLAS NETWORKING CALENDAR
          </div>
          <h1>
            Networking Events in
            <br />
            the <em>Dallas</em> Area
          </h1>
          <p className="hero-sub">
            Professional mixers, referral groups, business happy hours, and networking luncheons — Dallas networking events organized and delivered every week.
          </p>
          
          <div className="hero-cta-group">
            <Link href="/texas/dallas/networking/subscribe" className="btn btn-primary">
              Get the Free Dallas Networking Events Newsletter
            </Link>
            <a href="#calendar" className="btn btn-ghost">Browse the Calendar &rarr;</a>
          </div>
          <p className="hero-trust">Free forever&nbsp;&middot;&nbsp;No credit card</p>
        </div>
      </section>

      <SponsorCard cityName="Dallas" category="Networking" />

      <section className="sa-calendar-section" id="calendar">
        <div className="sa-calendar-header">
          <h2>Today's Networking Events in Dallas</h2>
          <p>Browse BNI chapters, leads groups, referral networks, and professional mixers</p>
        </div>
        <EventNetworkingCalendarHelper />

        <EventGate
          forcedCity="Dallas"
          groupType="networking"
          initialEvents={initialEvents}
          newsletterHeading="Get Dallas Networking Events Every Monday — Free"
          newsletterSubtext="A curated digest of that week's networking events in Dallas, delivered to your inbox every Monday morning."
          subscribeHref="/texas/dallas/networking/subscribe"
        />
      </section>

      <section className="features-section">
        <div className="features-inner">
          <h2>We Track Dallas Networking Events So You Don't Have To</h2>
          <p className="features-subtitle">Dallas networking events are scattered across BNI chapters, LinkedIn, Meetup, and local professional groups. We organize them into one weekly calendar.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Sign up free</h3>
              <p>Enter your email and get instant access. No credit card, no setup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday, get a curated digest of that week's top Dallas networking events.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events and show up</h3>
              <p>Scan the list, choose what fits your schedule, and show up ready to connect.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-inner">
          <h2>Trusted by Dallas Networking Professionals</h2>
          <p className="sp-subtitle">Dallas Networking Calendar — By the Numbers</p>
          <div className="sp-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="sp-stat">
                <span className="sp-stat-number">{stat.number}</span>
                <span className="sp-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="sp-testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="sp-card">
                <div className="sp-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="sp-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="sp-author">
                  <span className="sp-name">&mdash; {t.name}</span>
                  <span className="sp-location">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhySection
        heading="Why Dallas Networking Professionals Use This Calendar"
        subtitle="Dallas networking events are spread across too many platforms and websites. Here's how Local Business Calendars helps Dallas professionals keep up."
        problemText="Networking events in Dallas are scattered across BNI chapter websites, Meetup groups, LinkedIn, Facebook, and individual organization pages. Most professionals miss events simply because they didn't know they were happening."
        whatWeDoText="We track networking event hosts across Dallas and organize their public events into one city-focused calendar — updated every week."
        whatYouGetText="Less searching, better event discovery, and a weekly event newsletter that helps you stay up to date."
      />

      <section className="sa-subscribe-section" id="sa-subscribe">
        <div className="sa-subscribe-inner">
          <div className="sa-subscribe-badge">
            <Clock size={14} />
            Free · Takes 30 seconds
          </div>
          <h2>Get Dallas Networking Events Every Monday — Free</h2>
          <p>A curated digest of that week's networking events in Dallas, delivered to your inbox every Monday morning. No spam, no fluff — just the events worth your time.</p>
          <div className="sa-subscribe-actions">
            <Link href="/texas/dallas/networking/subscribe" className="btn btn-primary">Get the Weekly Newsletter — Free</Link>
          </div>
          <p className="sa-subscribe-note">Also available for all Dallas business events</p>
          <div className="sa-subscribe-secondary-cta">
            <Link href="/submit" className="btn btn-ghost">Submit a Networking Event</Link>
          </div>
        </div>
      </section>

      <div className="sa-back-link">
        <Link href="/texas/dallas">See all Dallas business events &rarr;</Link>
      </div>

      <section className="faq-section">
        <div className="faq-inner">
          <h2>Frequently Asked Questions About Dallas Networking Events</h2>
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
            { label: "Chamber Events", href: "/texas/dallas/chamber" },
            { label: "Small Business Events", href: "/texas/dallas/small-business" }
          ]
        }}
      />
    </div>
  );
}

export function DallasNetworkingPage({ initialEvents }: { initialEvents: Event[] }) {
  return <DallasNetworkingContent initialEvents={initialEvents} />;
}
