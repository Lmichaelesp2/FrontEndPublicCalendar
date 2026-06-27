'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const STAGES = [
  {
    number: 25,
    pillar: 'People',
    title: 'Know who you\'re looking for before you walk into any room',
    body: 'Before you attend a single event, get specific about who belongs in your network — their role, their industry, and the kinds of events they actually show up to. The more precise your target, the easier it is to scan the calendar and know immediately which events are worth your time and which ones are not. Your first 25 connections are test cases: do they match what you wrote down? Sharpen your target as you go.',
    callout: 'Most people attend events and hope someone useful shows up. The method reverses it — decide who you want to meet first, then find the events where they already are.',
    checks: [
      'Write out your ideal prospect — industry, role, what they do',
      'Identify your best referral partner types',
      'Search the calendar for events where these people are most likely to be in the room',
    ],
  },
  {
    number: 50,
    pillar: 'Participation',
    title: 'Find your consistent rooms and show up every time',
    body: 'By this stage, you have attended enough events to know which ones reliably put you in front of the right people. Those are your rooms. Commit to attending them consistently — not just when it\'s convenient. Showing up to the same events over and over is what turns a handshake into a relationship. Keep scanning the calendar for new events worth testing, but anchor your schedule around the rooms that are already working. The organizations you join will give you your most consistent source of recurring events — that\'s one reason they\'re worth joining.',
    callout: 'One event is a conversation. The same event twelve times in a row is a relationship. Consistency is the whole strategy.',
    checks: [
      'Identify the recurring events you will commit to attending every time',
      'Attend at least one new event per month to discover rooms you haven\'t found yet',
      'Follow up with every new contact within 48 hours — every time, no exceptions',
    ],
  },
  {
    number: 75,
    pillar: 'Content',
    title: 'Turn the events you attend into content that keeps you visible',
    body: 'You are already in the rooms. Now let the rest of your network see it. Every event you attend is content waiting to be shared — a photo at the door, a takeaway from a speaker, a quick recap of what happened. You do not need to create anything from scratch. The events are the content. Post before you go, document while you\'re there, and share what you learned after. The people who couldn\'t attend will remember who did.',
    callout: 'A photo and one sentence from an event you attended is enough. The goal is not to be a content creator — it\'s to be the person your network associates with being in the right rooms.',
    checks: [
      'Post one piece of content per event you attend — a photo, a recap, or one takeaway',
      'Share events you\'re planning to attend before you go',
      'Tag speakers, hosts, and organizations from events you attend',
    ],
  },
  {
    number: 100,
    pillar: 'Relationships',
    title: 'Build the follow-up system that outlasts any single event',
    body: 'Events put you in the room. What happens after the event determines whether anything comes from it. At 100 connections, good intentions are not enough — you need a system. Follow up within 48 hours of every event, then stay in touch across email, social media, and the next time you\'re in the same room. A small percentage of your network is ready to buy or refer at any given moment. Your follow-up system is what makes sure you are the first person they think of when that moment arrives.',
    callout: 'The relationship doesn\'t start at the event — it starts with the follow-up. Keep showing up to the same rooms, and keep following up after every one.',
    checks: [
      'Follow up with every new contact within 48 hours of meeting them',
      'Build a simple system — email, LinkedIn, or a spreadsheet — to stay warm with key connections',
      'Keep showing up to the same events consistently — that is your relationship maintenance',
    ],
  },
];

export default function NetworkingChallengePage() {
  return (
    <>
      <Navigation />
      <main>

        {/* Hero */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem 3.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              The Networking Challenge
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15, marginBottom: '1.25rem', color: '#0a1628' }}>
              Turn the events you attend into real business connections.
            </h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: '#1f2a3d', marginBottom: '2rem' }}>
              Show up consistently, meet people intentionally, follow up every time. Do that long enough and your network becomes a source of real business.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#stage-25" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Start the challenge →
              </a>
              <Link href="/texas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e8e8e4', color: '#1f2a3d', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Find events in your city
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div style={{ background: '#0a1628', padding: '0.85rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>4 STAGES</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>25 · 50 · 75 · 100 CONNECTIONS</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>FREE TO START</span>
          </div>
        </div>

        {/* Stages */}
        {STAGES.map((stage, i) => (
          <section
            key={stage.number}
            id={`stage-${stage.number}`}
            style={{
              background: i % 2 === 0 ? '#fff' : '#f7f7f5',
              borderBottom: '1px solid #e8e8e4',
              padding: '4rem 2rem',
              scrollMarginTop: '80px',
            }}
          >
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

              {/* Stage header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{
                  minWidth: 64, height: 64, borderRadius: 12,
                  background: '#0a1628', color: '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{stage.number}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8', marginTop: '2px' }}>connections</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.2rem' }}>
                    Stage {i + 1} · {stage.pillar}
                  </p>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: 1.2, color: '#0a1628', margin: 0 }}>
                    {stage.title}
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#1f2a3d', marginBottom: '1.5rem' }}>
                {stage.body}
              </p>

              {/* Callout */}
              <div style={{ background: '#eef3fe', border: '1px solid #c7d7fc', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ color: '#1652f0', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {stage.callout}
                </p>
              </div>

              {/* Checklist */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stage.checks.map(check => (
                  <li key={check} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', color: '#1f2a3d', fontSize: '0.95rem' }}>
                    <span style={{ color: '#c2410c', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {check}
                  </li>
                ))}
              </ul>

            </div>
          </section>
        ))}

        {/* The loop */}
        <section style={{ background: '#0a1628', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b82f7', marginBottom: '0.75rem' }}>
              Built on the method
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#fff', marginBottom: '1rem' }}>
              People → Content → Participation → Relationships
            </h2>
            <p style={{ color: '#c7d0dd', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1.05rem' }}>
              The four stages of this challenge map directly to the four pillars of the Local Business Networking Method. It is not a checklist you finish — it is a loop that keeps turning. Each turn makes the next one easier.
            </p>
            <Link href="/local-business-networking-method" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
              See the full method →
            </Link>
          </div>
        </section>

        {/* TBN CTA */}
        <section style={{ background: '#fff', borderTop: '1px solid #e8e8e4', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              Texas Business Network
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '1rem', color: '#0a1628' }}>
              Want to do this with expert guidance and an AI assistant behind you?
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#1f2a3d', marginBottom: '1.75rem' }}>
              The Texas Business Network is an exclusive membership for professionals committed to growing their business through the right relationships in Texas. We tell you which events to attend, which organizations to join, and what to do when you get there. An AI assistant checks in weekly to keep you on pace. Limited to a select number of members per city.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="mailto:themobilecoach@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0a1628', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Apply to the Texas Business Network →
              </a>
              <Link href="/texas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e8e8e4', color: '#1f2a3d', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Find events in your city
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
