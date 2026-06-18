'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navigation } from './Navigation';
import { Breadcrumb } from './Breadcrumb';
import { Hero } from './Hero';
import { Footer } from './Footer';
import { HomepageCities } from './HomepageCities';
import { SEOHead } from './SEOHead';
import { CityProvider } from '../contexts/CityContext';
import type { Event } from '../lib/supabase';
import { Plus, Minus } from 'lucide-react';
import { WhySection } from './WhySection';
import { LBOSection } from './LBOSection';

const CITY_NAMES: Record<string, string> = {
  austin: 'Austin',
  'san-antonio': 'San Antonio',
  dallas: 'Dallas',
  houston: 'Houston',
};

const TEXAS_FAQ_ITEMS = [
  {
    question: 'Which cities does Texas Business Calendars cover?',
    answer: 'We currently cover San Antonio, Austin, Dallas, and Houston. Each city has its own dedicated calendar and weekly email newsletter. Click any city above to browse events or subscribe.',
  },
  {
    question: 'Is this free?',
    answer: 'Yes — the calendar is completely free and open to browse. No account needed. Give us your email and we deliver every upcoming event in your city to your inbox every Monday morning. No credit card, no trial, no catch.',
  },
  {
    question: 'What do I get with the Monday newsletter?',
    answer: 'Every upcoming business event in your city delivered to your inbox every Monday morning — event name, date, time, location, and organizer link. It\'s the easiest way to stay on top of what\'s happening without checking the calendar yourself.',
  },
  {
    question: 'How often are events updated?',
    answer: 'We research and update events every week. New events are added as they\'re published by local organizations, and the weekly newsletter goes out every Monday morning.',
  },
  {
    question: 'How do you find events across Texas?',
    answer: 'We monitor chambers of commerce, professional associations, networking groups, Meetup, Eventbrite, Facebook, LinkedIn, and dozens of individual organization websites across all four cities — so you don\'t have to.',
  },
  {
    question: 'What is the Event Assistant?',
    answer: 'The Event Assistant is a paid upgrade for professionals who want a personalized calendar. It learns your city, industry, and goals — then shows you the events most worth your time and sends a personalized digest every Monday. It\'s built for serious networkers, founders, and business development professionals.',
  },
];

function TexasFaqItem({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
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

function MainLayoutInner({ initialEvents, cityCounts }: { initialEvents?: Event[]; cityCounts?: Record<string, number> }) {
  const params = useParams();
  const citySlug = params?.citySlug as string | undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const showIndustryCalendars = citySlug === 'austin' || citySlug === 'dallas' || citySlug === 'houston' || citySlug === 'san-antonio';
  const cityName = citySlug ? (CITY_NAMES[citySlug] ?? citySlug) : undefined;

  const seoTitle = citySlug
    ? `${cityName} Business Calendar | Free Networking & Business Events Newsletter`
    : 'Texas Business Calendars | Free Networking & Business Events Newsletter';

  const seoDescription = citySlug
    ? `Find networking events, business mixers, chamber meetings, and professional development opportunities in ${cityName}, Texas. Updated weekly with the latest events.`
    : 'Explore business calendars for Austin, Dallas, Houston, and San Antonio, Texas. Find networking events, mixers, chamber meetings, and professional opportunities. Free weekly emails.';

  return (
    <div>
      <SEOHead title={seoTitle} description={seoDescription} />
      <Navigation />
      <Breadcrumb items={
        citySlug
          ? [
              { label: 'Local Business Calendars', href: '/' },
              { label: 'Texas', href: '/texas' },
              { label: cityName ?? citySlug },
            ]
          : [
              { label: 'Local Business Calendars', href: '/' },
              { label: 'Texas', href: '/texas' },
            ]
      } />
      <Hero cityCounts={cityCounts} />

      {!citySlug && (
        <section className="hp-intro-section">
          <div className="hp-intro-inner">
            <p>
              Texas Business Calendars is a free network of city-specific event calendars. Browse networking events, chamber meetings, tech meetups, real estate gatherings, and small business events happening in San Antonio, Austin, Dallas, and Houston — updated weekly. The full calendar is free and open. Give us your email and we deliver every upcoming event straight to your inbox every Monday morning.
            </p>
          </div>
        </section>
      )}

      <section className="features-section">
        <div className="features-inner">
          <h2>We Do the Searching So You Don't Have To</h2>
          <p className="features-subtitle">We aggregate sources across Texas so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Pick your city</h3>
              <p>Click your city above and browse the full calendar — every upcoming business event, free, no account needed.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Browse the calendar</h3>
              <p>Give us your email and every Monday we send you every upcoming event in your city — so you never have to remember to check the calendar.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events & show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <HomepageCities initialEvents={initialEvents} />

      <WhySection
        heading="Why Use Texas Business Calendars?"
        subtitle="Most professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly."
        problemText="Events are spread across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and associations. It takes time to find what's worth attending."
        whatWeDoText="We track business event hosts and organize their public events into one simple calendar per city."
        whatYouGetText="The full calendar is free and open anytime. Sign up for the Monday newsletter and every upcoming event in your city arrives in your inbox automatically."
      />

      {!citySlug && (
        <section className="hp-sponsor-teaser">
          <div className="hp-sponsor-teaser-inner">
            <div className="hp-sponsor-teaser-label">Made Possible By Our Sponsors</div>
            <h2>This Calendar Is Free Because of Community Sponsors</h2>
            <p>Like public radio, Local Business Calendars stays free for the business community because local organizations choose to support it. Each city we cover is open for a sponsor — a business or organization that believes professionals deserve free access to what's happening where they work.</p>
            <div className="hp-sponsor-city-list">
              {(['San Antonio', 'Austin', 'Dallas', 'Houston'] as const).map((city) => (
                <div key={city} className="hp-sponsor-city-row">
                  <div className="hp-sponsor-city-left">
                    <span className="hp-sponsor-city-name">{city}</span>
                  </div>
                  <Link href="/sponsor" className="hp-sponsor-city-cta">Sponsorship open →</Link>
                </div>
              ))}
            </div>
            <Link href="/sponsor" className="hp-sponsor-teaser-btn">
              Learn About Sponsorship →
            </Link>
          </div>
        </section>
      )}

      {!citySlug && (
        <section className="faq-section">
          <div className="faq-inner">
            <h2>Frequently Asked Questions About Texas Business Calendars</h2>
            <div className="faq-list">
              {TEXAS_FAQ_ITEMS.map((item, i) => (
                <TexasFaqItem
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
      )}
      <LBOSection city={citySlug ? cityName : undefined} citySlug={citySlug || undefined} />
      <Footer showIndustryCalendars={showIndustryCalendars} citySlug={citySlug} cityName={cityName} isTexasPage={!citySlug} />
    </div>
  );
}

export function TexasMainLayout({ initialEvents, cityCounts }: { initialEvents?: Event[]; cityCounts?: Record<string, number> }) {
  return (
    <CityProvider>
      <MainLayoutInner initialEvents={initialEvents} cityCounts={cityCounts} />
    </CityProvider>
  );
}
