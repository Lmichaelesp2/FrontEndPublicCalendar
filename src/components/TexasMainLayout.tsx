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
import { SponsorInstitutional } from './SponsorSection';
import { SocialProof } from './SocialProof';
import type { Event } from '../lib/supabase';
import { Plus, Minus } from 'lucide-react';
import { WhySection } from './WhySection';

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
      <Hero />


      <WhySection
        heading="Why Use Texas Business Calendars?"
        subtitle="Most professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly."
        problemText="Events are spread across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and associations. It takes time to find what's worth attending."
        whatWeDoText="We track business event hosts and organize their public events into one simple calendar per city."
        whatYouGetText="Faster discovery, fewer missed opportunities, and a weekly reminder that keeps you consistent."
      />

      {!citySlug && (
        <section className="hp-intro-section">
          <div className="hp-intro-inner">
            <p>
              Texas Business Calendars is a free network of city-specific event calendars. Browse networking events, chamber meetings, tech meetups, real estate gatherings, and small business events happening in San Antonio, Austin, Dallas, and Houston — updated weekly. Sign up free to unlock the full week's calendar and get your city's events delivered to your inbox every Monday morning.
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
      {!citySlug && <SponsorInstitutional />}
      <Footer showIndustryCalendars={showIndustryCalendars} citySlug={citySlug} cityName={cityName} isTexasPage={!citySlug} />
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
