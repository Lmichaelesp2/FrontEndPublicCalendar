'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';

const STEPS = [
  {
    num: '1',
    title: 'Goal',
    question: 'What are you trying to accomplish?',
    items: [
      'Meet potential clients',
      'Build referral relationships',
      'Learn something useful',
      'Increase local visibility',
      'Reconnect with existing contacts',
      'Find speaking or partnership opportunities',
    ],
  },
  {
    num: '2',
    title: 'People',
    question: 'Who do you want in your network?',
    items: [
      'Business owners',
      'Executives and founders',
      'Industry professionals',
      'Local community leaders',
      'Referral partners',
      'Decision-makers',
    ],
  },
  {
    num: '3',
    title: 'Event',
    question: 'What kind of event are those people likely to attend?',
    items: [
      'Look at the event title and host',
      'Check the industry and category',
      'Read the description and format',
      'Notice the location and recurring vs one-time',
    ],
    note: 'The right event is not always the biggest event. It is the event most likely to put you in the room with the people you need to meet.',
  },
  {
    num: '4',
    title: 'Attend',
    question: 'Show up with intention.',
    items: [
      'Know why you are attending',
      'Have a few conversation starters ready',
      'Aim for a few quality conversations',
      'Follow up within 24–48 hours',
    ],
  },
];

const GUIDE_STEPS = [
  'Pick one networking goal for the week.',
  'Decide who you want to meet.',
  'Scan the calendar for events that match those people.',
  'Use the event title, host, category, and description as clues.',
  'Choose one or two events worth attending.',
  'Show up with a purpose.',
  'Follow up after the event.',
];

export function EventNetworkingMethodPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const { error } = await supabase
      .from('event_assistant_waitlist')
      .insert({ email, name: name || null, city: city || null });
    if (error) {
      if (error.code === '23505') {
        setStatus('success'); // already on list
      } else {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
      }
    } else {
      setStatus('success');
    }
  }

  return (
    <div className="enm-page">
      <SEOHead
        title="The Event Networking Method | Local Business Calendars"
        description="A simple way to use the calendar to find better business events and meet the right people. Goal, People, Event, Attend."
      />
      <Navigation />

      {/* ── Hero ── */}
      <section className="enm-hero">
        <div className="enm-hero-inner">
          <p className="enm-overline">FREE RESOURCE</p>
          <h1>The Event Networking Method</h1>
          <p className="enm-subtitle">
            A simple way to use the calendar to find better business events and meet the right people.
          </p>
          <div className="enm-steps-line">
            Goal &nbsp;·&nbsp; People &nbsp;·&nbsp; Event &nbsp;·&nbsp; Attend
          </div>
          <p className="enm-hero-body">
            Most people choose events randomly. The Event Networking Method helps you choose with intention. Start with who you want to meet, find the events they are most likely to attend, then show up prepared to build real business relationships.
          </p>
          <div className="enm-hero-ctas">
            <Link href="/subscribe" className="btn btn-gold">Sign Up for Your City's Calendar</Link>
            <a href="#event-assistant" className="btn btn-outline-dark">Get Weekly Event Matches</a>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="enm-intro">
        <div className="enm-intro-inner">
          <h2>Choose Events With a Purpose</h2>
          <p>The calendar shows you what is happening. The Event Networking Method helps you decide which events are worth your time.</p>
          <p className="enm-intro-ask">Before you choose an event, ask four questions:</p>
        </div>
      </section>

      {/* ── Four steps ── */}
      <section className="enm-steps">
        <div className="enm-steps-inner">
          {STEPS.map((step) => (
            <div key={step.num} className="enm-step-card">
              <div className="enm-step-num">{step.num}</div>
              <div className="enm-step-content">
                <h3>{step.title}</h3>
                <p className="enm-step-question">{step.question}</p>
                <ul className="enm-step-list">
                  {step.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {step.note && <p className="enm-step-note">{step.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formula ── */}
      <section className="enm-formula">
        <div className="enm-formula-inner">
          <p className="enm-formula-label">THE METHOD</p>
          <h2>Right Event = Goal + People + Event + Attend</h2>
          <p>Start with your goal. Know who you want to meet. Find the events they are likely to attend. Then show up prepared to connect.</p>
        </div>
      </section>

      {/* ── Calendar guide ── */}
      <section className="enm-guide">
        <div className="enm-guide-inner">
          <h2>How to Use This Method With the Calendar</h2>
          <ol className="enm-guide-list">
            {GUIDE_STEPS.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <Link href="/subscribe" className="btn btn-gold enm-guide-cta">
            Sign Up for Your City's Calendar
          </Link>
        </div>
      </section>

      {/* ── Event Assistant bridge ── */}
      <section className="enm-assistant" id="event-assistant">
        <div className="enm-assistant-inner">
          <div className="enm-assistant-text">
            <p className="enm-overline" style={{color:'rgba(255,255,255,.5)'}}>COMING SOON</p>
            <h2>Want Event Assistant to Do This for You?</h2>
            <p>
              The Event Networking Method shows you how to choose events manually. Event Assistant will apply the method for you — matching your goals, ideal connections, location, and schedule with upcoming local business events.
            </p>
            <p>
              Instead of sorting through every event yourself, you will receive weekly event matches based on who you want to meet and what you are trying to accomplish.
            </p>
          </div>
          <div className="enm-assistant-form-wrap">
            {status === 'success' ? (
              <div className="enm-assistant-success">
                <p className="enm-success-headline">You're on the list.</p>
                <p className="enm-success-sub">We'll reach out when Event Assistant is ready.</p>
              </div>
            ) : (
              <form className="enm-assistant-form" onSubmit={handleWaitlist}>
                <p className="enm-form-label">Join the Event Assistant Waitlist</p>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="enm-form-input"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="enm-form-input"
                />
                <select value={city} onChange={e => setCity(e.target.value)} className="enm-form-input enm-form-select">
                  <option value="">Your city (optional)</option>
                  <option>San Antonio</option>
                  <option>Austin</option>
                  <option>Dallas</option>
                  <option>Houston</option>
                </select>
                <button type="submit" className="enm-form-btn" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Joining…' : 'Join the Waitlist'}
                </button>
                {status === 'error' && <p className="enm-form-error">{errorMsg}</p>}
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer variant="homepage" />
    </div>
  );
}
