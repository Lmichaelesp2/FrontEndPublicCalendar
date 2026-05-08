'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';

const PHASES = [
  {
    num: '1',
    label: 'People',
    question: 'Who do you want in your network?',
    intro:
      'Most business owners go to events hoping to meet someone useful. The Event Networking Method starts differently — before you walk into any room, you get clear on exactly who you are trying to meet and why.',
    items: [
      { heading: 'Define your ideal connection', body: 'What industry are they in? What role do they hold? What size company? The more specific you are, the easier it becomes to spot them in any room.' },
      { heading: 'Map the organizations they belong to', body: 'Your ideal connections already gather in chambers, associations, referral groups, and industry communities. Knowing which ones tells you where to invest your time.' },
      { heading: 'Understand what they care about', body: 'What are their goals, challenges, and frustrations? When you know what matters to them, every conversation you have feels relevant — not random.' },
      { heading: 'Know what success looks like', body: 'Be honest about what you are trying to accomplish. Clients? Referral partners? Collaborators? Your goal shapes every decision that follows.' },
    ],
    callout: 'Clarity on people is what separates intentional networking from showing up and hoping for the best.',
  },
  {
    num: '2',
    label: 'Content',
    question: 'What will you share to stay top-of-mind?',
    intro:
      'Meeting someone once is not networking — it is an introduction. The Event Networking Method uses content to keep your name in front of the right people between every event, so when an opportunity arises, you are already the person they think of.',
    items: [
      { heading: 'Share what is happening locally', body: 'Forwarding a relevant event, sharing a local business story, or tagging someone in a community post costs almost nothing and keeps you visible in a genuinely useful way.' },
      { heading: 'Show up consistently — not constantly', body: 'You do not need to post every day. You need a simple rhythm that keeps you present. One useful touchpoint per week is enough to stay top-of-mind with the right people.' },
      { heading: 'Use events as content fuel', body: 'Every event you attend gives you something to share — a takeaway, a connection, a photo, a recommendation. Events are not just networking opportunities. They are content opportunities.' },
      { heading: 'Let your content do the warm-up work', body: 'When someone has been seeing your name, reading your posts, and receiving your emails before they meet you — that first conversation starts at a completely different level of trust.' },
    ],
    callout: 'Content is not marketing. It is how you stay in the relationship between every event.',
  },
  {
    num: '3',
    label: 'Events',
    question: 'Where do those people show up?',
    intro:
      'The calendar shows you what is happening. The Event Networking Method helps you decide which events are worth your time — and how to make the most of the ones you attend.',
    items: [
      { heading: 'Find the events your people already attend', body: 'The right event is not always the biggest event. It is the event most likely to put you in the room with the specific people you identified in step one.' },
      { heading: 'Read the signals in every event listing', body: 'The host organization, the event title, the industry category, the format, the location — these details tell you whether the room will be worth your time before you register.' },
      { heading: 'Show up with a plan', body: 'Know why you are attending. Have a few conversation starters ready. Set a simple goal — two or three real conversations is more valuable than collecting a stack of business cards.' },
      { heading: 'Go beyond attending', body: 'Volunteer. Sponsor. Speak. Moderate a panel. Host your own gathering. The more you contribute to the events in your community, the more visible and trusted you become.' },
    ],
    callout: 'The calendar is your starting point. The method is how you turn an event listing into a room full of the right people.',
  },
  {
    num: '4',
    label: 'Relationships',
    question: 'How do you keep every connection alive?',
    intro:
      'The meeting is just the beginning. Most networking fails here — people meet, exchange cards, and never follow up. The Event Networking Method gives you a simple system for turning first meetings into real, ongoing professional relationships.',
    items: [
      { heading: 'Follow up within 24–48 hours', body: 'A brief message while the conversation is still fresh is worth ten follow-ups a week later. Reference something specific from your conversation to make it personal, not generic.' },
      { heading: 'Stay engaged between events', body: 'Comment on their posts. Share something relevant. Send a quick note when you see news from their industry. Small, consistent touchpoints keep relationships warm without being intrusive.' },
      { heading: 'Invite them into your world', body: 'Share event invitations. Introduce them to someone they should know. Feature them in your content. The most powerful thing you can do for a relationship is help the other person — before you ever ask for anything.' },
      { heading: 'Use event content to reconnect', body: 'Every event you attend gives you a natural reason to reach back out — a takeaway you thought they would find useful, an event they might want to attend, a person you met who they should know.' },
    ],
    callout: 'Relationships are not built at events. They are built in everything that happens after.',
  },
];

const QUICK_START = [
  'Pick one person type you want more of in your network.',
  'Find one upcoming local event those people are likely to attend.',
  'Register and show up with one clear conversation goal.',
  'Follow up with everyone you meet within 48 hours.',
  'Share one takeaway from the event on LinkedIn or by email.',
  'Repeat — with intention — every week.',
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
        setStatus('success');
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
        description="A four-step system for turning local business events into lasting professional relationships. People, Content, Events, Relationships."
      />
      <Navigation />

      {/* ── Hero ── */}
      <section className="enm-hero">
        <div className="enm-hero-inner">
          <p className="enm-overline">FREE RESOURCE</p>
          <h1>The Event Networking Method</h1>
          <p className="enm-subtitle">
            A simple system for turning local business events into lasting professional relationships.
          </p>
          <div className="enm-steps-line">
            People &nbsp;·&nbsp; Content &nbsp;·&nbsp; Events &nbsp;·&nbsp; Relationships
          </div>
          <p className="enm-hero-body">
            Most people go to business events and hope something useful happens. The Event Networking Method replaces hope with a system — so every event you attend moves you closer to the people, partnerships, and opportunities you are actually looking for.
          </p>
          <div className="enm-hero-ctas">
            <Link href="/subscribe" className="btn btn-gold">Get Your City's Weekly Calendar</Link>
            <a href="#agency-bridge" className="btn btn-outline-dark">Want Us to Do This for You?</a>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="enm-intro">
        <div className="enm-intro-inner">
          <h2>Networking Without a System Is Just Attending Events</h2>
          <p>
            The calendar shows you what is happening in your city every week. The Event Networking Method shows you how to use it — so you are not just attending events, you are building a network with intention.
          </p>
          <p>
            The method has four parts. Each one builds on the last. Together they create a continuous cycle: you get clearer on who you want to meet, you show up in the right rooms, you create the content that keeps relationships warm, and you turn first meetings into real, ongoing connections.
          </p>
        </div>
      </section>

      {/* ── Four phases ── */}
      <section className="enm-steps">
        <div className="enm-steps-inner">
          {PHASES.map((phase) => (
            <div key={phase.num} className="enm-step-card">
              <div className="enm-step-num">{phase.num}</div>
              <div className="enm-step-content">
                <h3>{phase.label}</h3>
                <p className="enm-step-question">{phase.question}</p>
                <p className="enm-step-intro">{phase.intro}</p>
                <ul className="enm-step-list">
                  {phase.items.map((item, i) => (
                    <li key={i}>
                      <strong>{item.heading}</strong> — {item.body}
                    </li>
                  ))}
                </ul>
                {phase.callout && (
                  <p className="enm-step-note">{phase.callout}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formula ── */}
      <section className="enm-formula">
        <div className="enm-formula-inner">
          <p className="enm-formula-label">THE METHOD</p>
          <h2>People + Content + Events + Relationships</h2>
          <p>
            Know who you want to meet. Create content that keeps you top-of-mind. Show up at the events where those people already gather. Then stay in the relationship long after the event ends.
          </p>
          <p>
            That is the whole system. It works because it is intentional at every step — not random, not reactive, not hopeful.
          </p>
        </div>
      </section>

      {/* ── Quick start guide ── */}
      <section className="enm-guide">
        <div className="enm-guide-inner">
          <h2>How to Start This Week</h2>
          <p className="enm-guide-intro">You do not need to have everything figured out before you begin. Start simple.</p>
          <ol className="enm-guide-list">
            {QUICK_START.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <Link href="/subscribe" className="btn btn-gold enm-guide-cta">
            Get Your City's Free Weekly Calendar
          </Link>
        </div>
      </section>

      {/* ── Agency bridge ── */}
      <section className="enm-assistant" id="agency-bridge">
        <div className="enm-assistant-inner">
          <div className="enm-assistant-text">
            <p className="enm-overline" style={{ color: 'rgba(255,255,255,.5)' }}>THE DONE-FOR-YOU VERSION</p>
            <h2>You Can Do This Yourself — Or We Can Do It for You</h2>
            <p>
              The Event Networking Method is something any business professional can learn and apply on their own. The calendar gives you the events. This page gives you the system. The rest is up to you.
            </p>
            <p>
              But if you have the relationships you want to build and not the time to build them — that is what the Event Networking Agency does. We apply this exact method on your behalf: finding the right local events for your team, creating the content that keeps your network warm, and making sure every connection you make keeps working long after you leave the room.
            </p>
            <p style={{ color: 'rgba(255,255,255,.75)', fontStyle: 'italic' }}>
              "We find the events. We create the content. You just show up."
            </p>
          </div>
          <div className="enm-assistant-form-wrap">
            {status === 'success' ? (
              <div className="enm-assistant-success">
                <p className="enm-success-headline">You're on the list.</p>
                <p className="enm-success-sub">We'll be in touch about how the agency works and whether it's a fit.</p>
              </div>
            ) : (
              <form className="enm-assistant-form" onSubmit={handleWaitlist}>
                <p className="enm-form-label">Learn More About the Agency</p>
                <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  We work with a limited number of B2B companies per city. Drop your info and we will reach out.
                </p>
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
                  {status === 'loading' ? 'Sending…' : 'Get in Touch'}
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
