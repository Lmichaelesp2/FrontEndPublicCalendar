'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

const MODULES = [
  {
    num: '01',
    title: 'Start With Your Goal',
    body: 'Before picking an event, decide why you are going. Most people skip this step — and end up at events that don\'t move the needle.',
    examples: [
      'I want to meet new people.',
      'I want referral partners.',
      'I want to learn about AI, real estate, finance, etc.',
      'I want to build visibility.',
      'I want to find speaking opportunities.',
    ],
    prompt: 'Before you choose an event this week, write down your main goal.',
  },
  {
    num: '02',
    title: 'Think About the People',
    body: 'The event title matters less than who is likely to attend. A "Business Networking Happy Hour" at a chamber has a very different room than one at a startup incubator.',
    examples: [
      'Chamber events often attract local business owners and service providers.',
      'Startup events tend to attract founders, investors, and tech professionals.',
      'Real estate events pull agents, lenders, title companies, and investors.',
      'Workshops attract people who are actively learning about a specific topic.',
    ],
    prompt: 'Who do you want to meet this week?',
  },
  {
    num: '03',
    title: 'Evaluate the Room',
    body: 'The format shapes the value. A mixer gives you breadth. A workshop gives you depth. Knowing what you need changes which events are worth your time.',
    examples: [
      'Mixers are good for meeting many people quickly.',
      'Workshops are good for learning and creating conversation starters.',
      'Panels are good for topic-focused rooms with shared interest.',
      'Recurring groups are good for building long-term relationships.',
    ],
    prompt: 'Does this room match how you want to connect?',
  },
  {
    num: '04',
    title: 'Apply It to This Week\'s Calendar',
    body: 'Once you know your goal, the people you want to meet, and the format that works for you — use the calendar intentionally.',
    examples: [
      'Goal: referrals → Look for recurring networking events, chamber events, and industry-specific rooms with business owners or service providers.',
      'Goal: learning → Look for workshops, panels, and educational events in your field.',
      'Goal: visibility → Look for recurring groups where you can show up consistently and be known.',
    ],
    prompt: null,
  },
];

export function RightRoomMethodPage() {
  return (
    <div>
      <SEOHead
        title="The Right Room Method | Local Business Calendars"
        description="A simple 3-step method to help you choose better business networking events. Learn how to use the Goal, People, and Room framework before picking your next event."
      />
      <Navigation />

      {/* Hero / intro */}
      <section className="rrm-hero">
        <div className="rrm-hero-inner">
          <p className="rrm-overline">FREE RESOURCE</p>
          <h1>
            The Right Room Method
          </h1>
          <p className="rrm-subtitle">
            A simple 3-step method to help you choose better business events.
          </p>
          <div className="rrm-intro-block">
            <p>
              The free business calendar helps you find events.<br />
              The Right Room Method helps you choose which ones are worth your time.
            </p>
            <p>
              Before you attend another event, ask three questions:
            </p>
            <ol className="rrm-three-qs">
              <li><strong>Goal</strong> — Why am I going?</li>
              <li><strong>People</strong> — Who is likely to be there?</li>
              <li><strong>Room</strong> — Is this the right environment?</li>
            </ol>
            <p>
              Most people go to events randomly. The results are random too.<br />
              This method helps you choose more intentionally.
            </p>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="rrm-pillars">
        <div className="rrm-pillars-inner">
          <div className="rrm-pillar">
            <div className="rrm-pillar-icon">🎯</div>
            <h3>Goal</h3>
            <p>Why are you going?</p>
          </div>
          <div className="rrm-pillar-divider">+</div>
          <div className="rrm-pillar">
            <div className="rrm-pillar-icon">👥</div>
            <h3>People</h3>
            <p>Who will be there?</p>
          </div>
          <div className="rrm-pillar-divider">+</div>
          <div className="rrm-pillar">
            <div className="rrm-pillar-icon">🏛️</div>
            <h3>Room</h3>
            <p>Is the format right?</p>
          </div>
        </div>
      </section>

      {/* Training modules */}
      <section className="rrm-modules">
        <div className="rrm-modules-inner">
          <p className="rrm-modules-label">THE METHOD</p>
          <h2>Four Modules</h2>

          {MODULES.map((mod) => (
            <div key={mod.num} className="rrm-module">
              <div className="rrm-module-num">{mod.num}</div>
              <div className="rrm-module-content">
                <h3>{mod.title}</h3>
                <p className="rrm-module-body">{mod.body}</p>
                <ul className="rrm-module-examples">
                  {mod.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
                {mod.prompt && (
                  <div className="rrm-module-prompt">
                    <span className="rrm-prompt-label">Before you choose:</span>
                    <span className="rrm-prompt-text">{mod.prompt}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rrm-cta-section">
        <div className="rrm-cta-inner">
          <h2>Ready to put it into practice?</h2>
          <p>Use the calendar to find what's happening this week. Use the Right Room Method to decide where to show up.</p>
          <div className="rrm-cta-group">
            <Link href="/texas" className="btn btn-gold">
              View This Week's Events →
            </Link>
            <Link href="/subscribe" className="btn btn-white">
              Get the Weekly Email — Free
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="homepage" />
    </div>
  );
}
