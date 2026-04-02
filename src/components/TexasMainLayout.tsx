'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from './Navigation';
import { Breadcrumb } from './Breadcrumb';
import { Hero } from './Hero';
import { Footer } from './Footer';
import { HomepageCities } from './HomepageCities';
import { SEOHead } from './SEOHead';
import { CityProvider } from '../contexts/CityContext';
import { SocialProof } from './SocialProof';
import type { Event } from '../lib/supabase';
import { Plus, Minus, AlertTriangle, Target, Star, Mail, CalendarDays } from 'lucide-react';

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
    answer: 'Yes — browsing the calendar and subscribing to the weekly email are both completely free. No credit card, no trial, no catch.',
  },
  {
    question: 'How often are events updated?',
    answer: 'We research and update events every week. New events are added as they\'re published by local organizations, and the weekly newsletter goes out every Monday morning.',
  },
  {
    question: 'How do you find events across Texas?',
    answer: 'We monitor chambers of commerce, local business organizations, Meetup groups, Eventbrite, Facebook, LinkedIn, and dozens of individual organization websites across all four cities — so you don\'t have to.',
  },
  {
    question: 'What do I get with a free subscription?',
    answer: 'Access to your city\'s full events calendar plus a weekly email every Monday with the best upcoming networking and business events in your area.',
  },
  {
    question: 'What is the Personal Event Assistant?',
    answer: 'It\'s an upcoming AI-powered tool that learns your industry, professional goals, and schedule to recommend the best events for you personally — so you spend less time searching and more time networking. Join the waitlist above to be first in line when it launches.',
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

function MainLayoutInner({ initialEvents }: { initialEvents?: Event[] }) {
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
      {citySlug && (
        <Breadcrumb items={[
          { label: 'Local Business Calendars', href: '/' },
          { label: 'Texas', href: '/texas' },
          { label: cityName ?? citySlug },
        ]} />
      )}
      <Hero />

      <section className="benefits-bar">
        <div className="benefits-bar-inner">
          <div className="benefit-item">
            <div className="benefit-icon">
              <CalendarDays size={20} strokeWidth={2} />
            </div>
            <span>Events aggregated every week</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <Mail size={20} strokeWidth={2} />
            </div>
            <span>Delivered every Monday morning</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <span>Access calendar anytime</span>
          </div>
        </div>
      </section>

      {!citySlug && (
        <section className="hp-intro-section">
          <div className="hp-intro-inner">
            <p>
              Texas Business Calendars aggregates networking events, chamber of commerce meetings, technology meetups, real estate investor gatherings, and small business events across San Antonio, Austin, Dallas, and Houston — researched weekly and delivered free to your inbox every Monday morning.
            </p>
          </div>
        </section>
      )}

      <section className="why-section">
        <div className="why-inner">
          <h2>Why Use Texas Business Calendars?</h2>
          <p className="why-subtitle">Most professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly.</p>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon"><AlertTriangle size={26} strokeWidth={2} /></div>
              <h3>The problem</h3>
              <p>Events are spread across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and associations. It takes time to find what's worth attending.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Target size={26} strokeWidth={2} /></div>
              <h3>What we do</h3>
              <p>We track business event hosts and organize their public events into one simple calendar per city.</p>
            </div>
            <div className="why-card">
              <div className="why-card-icon"><Star size={26} strokeWidth={2} /></div>
              <h3>What you get</h3>
              <p>Faster discovery, fewer missed opportunities, and a weekly reminder that keeps you consistent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-inner">
          <h2>We Do the Searching So You Don't Have To</h2>
          <p className="features-subtitle">We aggregate sources across Texas so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to your city</h3>
              <p>Click your city above. Create your free account in 30 seconds. No credit card, no setup.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's networking events, meetups, and business gatherings in your city.</p>
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
      <SocialProof />
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
      <Footer showIndustryCalendars={showIndustryCalendars} citySlug={citySlug} cityName={cityName} />
    </div>
  );
}

export function TexasMainLayout({ initialEvents }: { initialEvents?: Event[] }) {
  return (
    <CityProvider>
      <MainLayoutInner initialEvents={initialEvents} />
    </CityProvider>
  );
}
