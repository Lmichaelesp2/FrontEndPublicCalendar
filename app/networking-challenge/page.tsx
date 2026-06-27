'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const STAGES = [
  {
    number: 25,
    pillar: 'People',
    title: 'Define who you are looking for',
    body: 'Before you count a single connection, get specific about who belongs in your network — role, industry, the rooms they already gather in. Your first connections should be a mix of test cases: people who match your target so you can sharpen it. The clearer you are about who you want to meet, the more intentional every event becomes.',
    callout: 'Most people go to events hoping to meet someone useful. The method reverses it: decide who you want to meet first, then find the events where they already are.',
    checks: [
      'Write out your ideal prospect — industry, role, what they do',
      'Identify your best referral partner types',
      'List the event types where these people are most likely to show up',
    ],
  },
  {
    number: 50,
    pillar: 'Participation',
    title: 'Commit to your rooms',
    body: 'By this stage you should have picked a handful of organizations to go deep in, while still scanning the wider universe of events for the rooms that matter. Depth in a few places beats a shallow presence everywhere. The events you attend inside your committed organizations are where relationships compound — because you see the same people repeatedly.',
    callout: 'Commit narrow, watch wide: go deep in a few organizations while always scanning the broader event landscape for rooms worth entering.',
    checks: [
      'Pick a few organizations to commit to and attend their events consistently',
      'Attend at least one outside event per month to discover new rooms',
      'Follow up with every new contact within 48 hours — every time',
    ],
  },
  {
    number: 75,
    pillar: 'Content',
    title: 'Stay top of mind between events',
    body: 'As your network grows, your follow-up can no longer stay one-to-one — there are too many people to message individually. Start turning the events you attend and the organizations you are active in into content that keeps you visible to everyone at once. You do not need to create anything from scratch. Re-share what you are already doing: a photo from a chamber breakfast, a recap of a panel, a takeaway from a meeting you attended.',
    callout: 'The content that keeps you top of mind is already happening. You just have to document it. A photo and one sentence from an event you attended is enough to start.',
    checks: [
      'Post one piece of content per event attended — photo, recap, or takeaway',
      'Re-share events you plan to attend before you go',
      'Tag the organizations and speakers you interact with',
    ],
  },
  {
    number: 100,
    pillar: 'Relationships',
    title: 'Build the system that keeps it warm',
    body: 'The finish line is not a number on a list — it is having a real system that keeps every relationship warm over time. Follow up consistently across email, social media, and in-person touchpoints until they buy from you or send you someone who does. At any given moment, a small percentage of your network is ready to buy or refer. The goal of staying top of mind is to make sure that when they reach that moment, you are the first person they think of.',
    callout: 'A warm network produces buyers and referrers on an ongoing basis. The goal of every touchpoint is to make sure you are top of mind when someone is ready — not when it is convenient for you.',
    checks: [
      'Set a follow-up system — email, LinkedIn, or a simple spreadsheet',
      'Check in with your closest relationships at least once a quarter',
      'Keep showing up in the same rooms consistently — that is your relationship maintenance',
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
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
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
            <div style={{ maxWidth: 720, margin: '0 auto' }}>

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
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
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
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
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
