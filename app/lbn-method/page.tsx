'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const PILLARS = [
  {
    number: '1',
    name: 'People',
    tagline: 'Know who you\'re looking for before you walk into any room.',
    body: 'Most people go to events and hope someone useful shows up. The method starts before the event — with a written profile of exactly who belongs in your network. Your ideal prospect. Your best referral partner types. The connectors who open doors to many. Once you have that profile, the calendar becomes a targeting tool: you are not looking for interesting events, you are looking for the rooms where your people already gather.',
    insight: 'The clearer your target, the easier every other step becomes. A sharp persona turns the event calendar from noise into signal.',
    actions: [
      'Write out your ideal prospect — industry, role, what they do',
      'Identify two or three referral partner types worth building toward',
      'Use the calendar to find event types where these people show up consistently',
    ],
  },
  {
    number: '2',
    name: 'Content',
    tagline: 'Turn every event you attend into something that keeps you visible.',
    body: 'Every event you attend is raw material. A photo at the registration table. A one-line takeaway from the speaker. A short recap of who was in the room and what was discussed. You are not creating content from scratch — you are documenting what you are already doing. The people who could not attend will see who did. The people who were there will share it. Done consistently, your event attendance becomes a content engine that keeps your name in front of the right people between the times you are in the room.',
    insight: 'One post per event — a photo and one sentence — is all it takes to start. The goal is not to be a content creator. It\'s to be the person your network associates with being in the right rooms.',
    actions: [
      'Post once per event — a photo, a recap, or one takeaway',
      'Share events you plan to attend before you go',
      'Tag speakers, hosts, and organizations you interact with',
    ],
  },
  {
    number: '3',
    name: 'Participation',
    tagline: 'Commit to a few rooms. Keep scanning the rest.',
    body: 'Participation has two modes: deep and wide. Deep means you identify a small number of events — usually tied to the organizations you belong to — that you attend every time without exception. These are your rooms. Wide means you keep scanning the full calendar for new rooms worth testing: a mixer with a new crowd, an industry panel, a one-time event that puts you in front of the right people. Commit narrow, scan wide. The organizations you join are your most reliable source of recurring events — that is one reason why finding the right ones matters.',
    insight: 'Consistent presence at the same events builds familiarity. Familiarity is what turns a business card exchange into a relationship.',
    actions: [
      'Identify the recurring events you will commit to attending every time',
      'Attend at least one new event each month outside your committed rooms',
      'Follow up with every new contact within 48 hours — every time',
    ],
  },
  {
    number: '4',
    name: 'Relationships',
    tagline: 'Build the system that keeps every connection warm.',
    body: 'Events put you in the room. What happens after the event determines whether anything comes from it. Follow up within 48 hours — reference something specific from the conversation, not a generic "great meeting you." Then maintain contact over time across email, LinkedIn, and the next event you both attend. At any given moment, a small percentage of your network is ready to buy or refer. Your follow-up system is what makes sure you are the first person they think of when that moment arrives.',
    insight: 'The relationship does not start at the event. It starts with the follow-up. Keep showing up to the same rooms and keep following up after every one.',
    actions: [
      'Follow up with every new contact within 48 hours of meeting them',
      'Build a simple system — email, LinkedIn, or a spreadsheet — to stay warm with key contacts',
      'Keep showing up to the same events consistently — presence is your relationship maintenance',
    ],
  },
];

export default function LBNMethodPage() {
  return (
    <>
      <Navigation />
      <main>

        {/* Hero */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem 3.5rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              The LBN Method
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15, marginBottom: '1.25rem', color: '#0a1628' }}>
              How the Local Business Networking Method works.
            </h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: '#1f2a3d', marginBottom: '2rem' }}>
              Four steps — People, Content, Participation, Relationships — that turn the events you attend into real business connections. Not a checklist you finish. A loop that keeps turning.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#pillar-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                See the method →
              </a>
              <Link href="/networking-challenge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e8e8e4', color: '#1f2a3d', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Take the Networking Challenge
              </Link>
            </div>
          </div>
        </section>

        {/* Method intro */}
        <section style={{ background: '#f7f7f5', borderBottom: '1px solid #e8e8e4', padding: '2.5rem 2rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ color: '#1f2a3d', fontSize: '1.05rem', lineHeight: 1.75, margin: 0 }}>
              The Local Business Networking Method is built around a simple idea: the relationships that grow your business come from showing up to the right events, consistently, with a clear sense of who you want to meet — and following up every time. Four steps make that repeatable.
            </p>
          </div>
        </section>

        {/* The loop graphic */}
        <section style={{ background: '#0a1628', padding: '2.5rem 2rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', color: '#fff', letterSpacing: '0.02em', margin: 0 }}>
              People &nbsp;→&nbsp; Content &nbsp;→&nbsp; Participation &nbsp;→&nbsp; Relationships
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem', letterSpacing: '0.04em' }}>
              ↺ &nbsp; then back to People — the loop feeds itself
            </p>
          </div>
        </section>

        {/* Pillars */}
        {PILLARS.map((pillar, i) => (
          <section
            key={pillar.number}
            id={`pillar-${pillar.number}`}
            style={{
              background: i % 2 === 0 ? '#fff' : '#f7f7f5',
              borderBottom: '1px solid #e8e8e4',
              padding: '4rem 2rem',
              scrollMarginTop: '80px',
            }}
          >
            <div style={{ maxWidth: 720, margin: '0 auto' }}>

              {/* Pillar header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{
                  minWidth: 56, height: 56, borderRadius: '50%',
                  background: '#0a1628', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Georgia, serif', fontSize: '1.375rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {pillar.number}
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.2rem' }}>
                    Step {pillar.number} of 4
                  </p>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', lineHeight: 1.2, color: '#0a1628', margin: 0 }}>
                    {pillar.name}
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: '#c2410c', marginBottom: '1.25rem', lineHeight: 1.5, fontFamily: 'Georgia, serif' }}>
                "{pillar.tagline}"
              </p>

              {/* Video placeholder */}
              <div style={{ background: '#0a1628', borderRadius: 12, padding: '2rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '16px solid #fff', marginLeft: '3px' }} />
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: 0, marginBottom: '0.2rem' }}>
                    {pillar.name} — How it works
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Video · ~90 seconds</p>
                </div>
              </div>

              <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#1f2a3d', marginBottom: '1.5rem' }}>
                {pillar.body}
              </p>

              {/* Insight callout */}
              <div style={{ background: '#eef3fe', border: '1px solid #c7d7fc', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ color: '#1652f0', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {pillar.insight}
                </p>
              </div>

              {/* Action steps */}
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.6rem' }}>
                Action steps
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pillar.actions.map(action => (
                  <li key={action} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', color: '#1f2a3d', fontSize: '0.95rem' }}>
                    <span style={{ color: '#c2410c', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>→</span>
                    {action}
                  </li>
                ))}
              </ul>

            </div>
          </section>
        ))}

        {/* How the loop works */}
        <section style={{ background: '#0a1628', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b82f7', marginBottom: '0.75rem' }}>
              How it fits together
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#fff', marginBottom: '1.25rem' }}>
              These four steps are a loop, not a checklist.
            </h2>
            <p style={{ color: '#c7d0dd', lineHeight: 1.75, fontSize: '1.05rem', marginBottom: '1rem' }}>
              <strong style={{ color: '#fff' }}>People</strong> tells you who to look for. <strong style={{ color: '#fff' }}>Content</strong> keeps you visible between the times you are in the room. <strong style={{ color: '#fff' }}>Participation</strong> is where the relationships actually form — showing up to the right events consistently. <strong style={{ color: '#fff' }}>Relationships</strong> is the system that keeps every connection warm until they buy or send someone who does.
            </p>
            <p style={{ color: '#c7d0dd', lineHeight: 1.75, fontSize: '1.05rem' }}>
              Then the loop feeds itself. The relationships you maintain surface new people worth meeting. The events you attend reveal organizations worth joining. The content you produce pulls both toward you. Each turn makes the next one easier.
            </p>
          </div>
        </section>

        {/* CTA — Challenge */}
        <section style={{ background: '#fff', borderTop: '1px solid #e8e8e4', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              Put it into practice
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '1rem', color: '#0a1628' }}>
              Ready to run the method? Take the Networking Challenge.
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#1f2a3d', marginBottom: '1.75rem' }}>
              The Networking Challenge walks you through the method in four stages — 25, 50, 75, and 100 connections — with specific actions at each milestone. Start with Stage 1 and work through it at your own pace.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/networking-challenge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Start the Networking Challenge →
              </Link>
              <Link href="/texas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e8e8e4', color: '#1f2a3d', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                Find events in your city
              </Link>
            </div>
          </div>
        </section>

        {/* TBN CTA */}
        <section style={{ background: '#f7f7f5', borderTop: '1px solid #e8e8e4', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              Texas Business Network
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '1rem', color: '#0a1628' }}>
              Want someone to run the method with you?
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#1f2a3d', marginBottom: '1.75rem' }}>
              The Texas Business Network is an exclusive membership for professionals committed to growing their business through the right relationships in Texas. We tell you which events to attend, which organizations to join, and what to do when you get there. An AI assistant checks in weekly to keep you on pace.
            </p>
            <a href="mailto:themobilecoach@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0a1628', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
              Apply to the Texas Business Network →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
