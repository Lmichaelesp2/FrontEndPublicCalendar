'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

const CARDS = [
  {
    id: 'method',
    accent: '#c2410c',
    icon: 'LN',
    label: 'The Method',
    sub: 'What is the Local Business Networking Method?',
    subColor: 'var(--color-primary)',
    stmt: 'A system that turns your local network into customers — through the organizations you join and the events you attend.',
    body: 'Most professionals collect contacts and lose them. This method gives you four repeatable steps so every room you enter — whether an organization you belong to or an event out in the wider world — compounds into relationships that turn into customers over time.',
    videoTitle: 'Overview: The Local Business Networking Method',
    example: null,
    methodIntro: 'Most professionals collect contacts and lose them. Four repeatable steps change that.',
    methodSteps: [
      { name: 'People', def: 'Know exactly who you\'re looking for before you walk into any room.' },
      { name: 'Content', def: 'Turn every meeting and event into something shareable.' },
      { name: 'Participation', def: 'Participate actively in a few organizations while scanning the wider universe of events.' },
      { name: 'Relationships', def: 'Follow up consistently until they buy or send someone who does.' },
    ],
  },
  {
    id: 'practices',
    accent: '#7c3aed',
    icon: 'P',
    label: 'Practices',
    sub: 'Practice for great networking',
    subColor: '#7c3aed',
    stmt: 'Before the system, the mindset. Four practices that make every step of this method work.',
    body: null,
    practicesList: [
      { name: 'Empathy', def: 'Enter the other person\'s situation before offering your own.' },
      { name: 'Active Listening', def: 'Prove you heard, instead of waiting for your turn to talk.' },
      { name: 'Curiosity', def: 'Stay genuinely interested in people, not just prospects.' },
      { name: 'Inquiry', def: 'Ask the better question that opens a real conversation.' },
    ],
    practicesIntro: 'These four practices are the foundation of every meaningful business relationship. Carry them into every conversation — at a single event or across years of membership.',
    videoTitle: 'The Four Relationship Practices',
    example: null,
  },
  {
    id: 'people',
    accent: 'var(--color-ink)',
    icon: '1',
    label: 'People',
    sub: 'Identify your target network',
    subColor: 'var(--color-primary)',
    stmt: 'Get clear on exactly who turns into customers — before you walk into any room.',
    body: 'Build profiles of your ideal connections — future customers, referral partners, current customers, and connectors — then map the organizations they belong to and the events they attend. The more specific you are, the more intentional every move that follows.',
    videoTitle: 'How to Identify Your Target Network',
    example: 'e.g., a commercial real estate broker who refers you clients, or a chamber director who opens doors.',
  },
  {
    id: 'content',
    accent: 'var(--color-ink)',
    icon: '2',
    label: 'Content',
    sub: 'Produce it from your involvement and events',
    subColor: 'var(--color-primary)',
    stmt: 'Turn your involvement and the events you attend into content that keeps your name in front of the right people.',
    body: 'Every meeting, project, and event becomes audio, video, text, or graphics you can share across your network. The content you produce is what keeps trust compounding between the times you are in the room.',
    videoTitle: 'How to Produce Content from Your Network',
    example: 'e.g., a 60-second recap video from a chamber luncheon, or a quote card from a speaker.',
  },
  {
    id: 'participation',
    accent: 'var(--color-ink)',
    icon: '3',
    label: 'Participation',
    sub: 'Show up, step up, build your own rooms',
    subColor: 'var(--color-primary)',
    stmt: 'Participate in three or four organizations — and show up intentionally across the wider universe of events.',
    body: 'Advance through four stages — Select → Engage → Lead → Build (in plain terms: Choose → Show up → Step up → Build your own rooms).',
    dualFocus: 'Participate narrow, scan wide: go deep as an active participant in three or four organizations, while always scanning the wider universe of events for the rooms that matter most.',
    videoTitle: 'How to Build Through Participation',
    example: 'e.g., participate actively in your local chamber and a trade association; attend an outside mixer when your people will be there.',
  },
  {
    id: 'relationships',
    accent: 'var(--color-ink)',
    icon: '4',
    label: 'Relationships',
    sub: 'Maintain across channels',
    subColor: 'var(--color-primary)',
    stmt: 'Stay in touch with everyone you meet — consistently, not occasionally — until they buy or send you someone who does.',
    body: 'Follow up within 48 hours, then maintain across email, social media, your podcast, and your own private events. Different people pay attention in different places, so the more channels you use, the warmer your network stays.',
    videoTitle: 'How to Maintain Relationships Across Channels',
    example: 'e.g., a same-week email referencing your conversation, then a quarterly check-in with no ask.',
  },
];

const FAQ = [
  {
    q: 'How many organizations should I join?',
    a: 'Three or four, no more. Depth is the point — three relationships you go deep in will out-earn thirty you keep shallow.',
  },
  {
    q: 'What if I\'m brand new and don\'t know anyone?',
    a: 'Start with one persona and attend one event as a guest. Five real conversations and a 48-hour follow-up is enough to begin.',
  },
  {
    q: 'Do I have to attend every event?',
    a: 'No. You commit deeply to a few organizations and selectively attend outside events — to reach new people and spot rising rooms.',
  },
  {
    q: 'How is this different from regular networking?',
    a: 'Regular networking collects contacts. This method turns them into customers — people who buy or send you those who do — through a repeatable loop.',
  },
  {
    q: 'Do I need to be on social media or start a podcast?',
    a: 'Use only the channels that fit you. Email and the 48-hour follow-up are the foundation; the rest are optional ways to stay warm.',
  },
];

export function EventNetworkingMethodPage() {
  return (
    <>
      <SEOHead
        title="The Local Business Networking Method | Local Business Calendars"
        description="A repeatable system for turning the people you meet into customers — through the organizations you join and the events you attend. People · Content · Participation · Relationships."
      />
      <Navigation />

      <main className="enm-page">

        {/* Hero */}
        <section className="enm-hero">
          <div className="enm-hero-inner">
            <p className="enm-hero-overline">Free Resource</p>
            <h1 className="enm-hero-title">The Local Business Networking Method</h1>
            <p className="enm-hero-tagline">Turn Your Network Into Customers</p>
            <p className="enm-hero-who">
              For founders, owners, and operators who sell to a specific kind of person in a specific
              place — and would rather build a reputation that lasts than chase a feed that forgets.
            </p>
            <p className="enm-hero-sub">
              A repeatable system for turning the people you meet into customers — the ones who buy
              from you, and the ones who send you those who do. Built on the organizations you join
              and the events you attend.
            </p>
            <a href="#download-playbook" className="btn btn-terra">
              Download the free Local Business Networking Playbook →
            </a>
          </div>
        </section>

        {/* Cards */}
        <section className="enm-cards-section">
          <div className="enm-cards-inner">
            <div className="enm-cards-grid">
              {CARDS.map((card) => (
                <div
                  key={card.id}
                  className="enm-card"
                  style={{ borderTop: `3px solid ${card.accent}` }}
                >
                  <div className="enm-card-header">
                    <div className="enm-card-icon" style={{ background: card.accent }}>
                      {card.icon}
                    </div>
                    <span className="enm-card-label">{card.label}</span>
                  </div>
                  <p className="enm-card-sub" style={{ color: card.subColor }}>
                    {card.sub}
                  </p>
                  <p className="enm-card-stmt">{card.stmt}</p>

                  {/* Method card: short intro + 4-step preview list */}
                  {card.methodSteps ? (
                    <>
                      <p className="enm-card-body">{card.methodIntro}</p>
                      <ul className="enm-practices-list">
                        {card.methodSteps.map((s: {name: string; def: string}) => (
                          <li key={s.name}>
                            <strong>{s.name}</strong> — {s.def}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : card.practicesList ? (
                    /* Practices card: intro + definition list */
                    <>
                      <p className="enm-card-body">{card.practicesIntro}</p>
                      <ul className="enm-practices-list">
                        {card.practicesList.map((p: {name: string; def: string}) => (
                          <li key={p.name}>
                            <strong>{p.name}</strong> — {p.def}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      {/* Orgs & Events: dual-focus callout */}
                      {card.dualFocus && (
                        <p className="enm-card-dual-focus">
                          <strong>Commit narrow, watch wide:</strong>{' '}
                          {card.dualFocus.replace('Commit narrow, watch wide: ', '')}
                        </p>
                      )}
                      <p className="enm-card-body">{card.body}</p>
                    </>
                  )}

                  {card.example && (
                    <p className="enm-card-example"><em>{card.example}</em></p>
                  )}

                  <div className="enm-video-placeholder">
                    <div className="enm-play-btn">
                      <div className="enm-play-tri" />
                    </div>
                    <div className="enm-video-text">
                      <span className="enm-video-label">Video placeholder</span>
                      <span className="enm-video-title">{card.videoTitle}</span>
                      <span className="enm-video-dur">~90 sec</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How the four steps work together */}
        <section className="enm-loop-section">
          <div className="enm-loop-inner">
            <h2 className="enm-loop-title">How the four steps work together</h2>
            <p className="enm-loop-body">
              These aren't a checklist you finish — they're a loop that keeps turning.{' '}
              <strong>People</strong> tell you who to pursue. <strong>Content</strong> keeps you
              visible between meetings. <strong>Participation</strong> is where the
              real work happens. <strong>Relationships</strong> turn contacts into customers. Then
              the loop feeds itself: the relationships you maintain reveal new people, the organizations
              you participate in surface new events, and the content you produce pulls both toward you. Each
              turn makes the next one easier.
            </p>
            <p className="enm-loop-flow">
              People → Content → Participation → Relationships →{' '}
              <em>(back to People)</em>
            </p>
          </div>
        </section>

        {/* Start Small */}
        <section className="enm-start-small">
          <div className="enm-start-small-inner">
            <h2 className="enm-start-small-title">Not sure where to begin? Start small.</h2>
            <ol className="enm-start-small-list">
              <li>Write <strong>one persona</strong> — the kind of person who turns into a customer.</li>
              <li>List the <strong>organizations</strong> where that person gathers, and pick <strong>one</strong> to attend this month.</li>
              <li>Have <strong>five real conversations</strong> there, using the four practices.</li>
              <li><strong>Follow up within 48 hours</strong> with each one.</li>
            </ol>
            <p className="enm-start-small-close">
              That's the whole method in miniature. Do it once and you have proof it works.
            </p>
          </div>
        </section>

        {/* Done For You + Playbook download */}
        <section className="enm-agency-bridge">
          <div className="enm-agency-inner">
            <p className="enm-agency-overline">Done For You</p>
            <h2 className="enm-agency-title">Ready to put the method to work?</h2>
            <p className="enm-agency-body">
              You can run every step of this method yourself — if you have the time, the
              infrastructure, and the tools to pull it off. Or we handle the events, the content,
              and the follow-up so you can focus on showing up.
            </p>
            <a href="mailto:themobilecoach@gmail.com" className="btn btn-terra">
              Talk to us about done-for-you →
            </a>
          </div>
          <div className="enm-playbook-cta">
            <div className="enm-playbook-inner">
              <h2 className="enm-playbook-title">Want the whole method in one place?</h2>
              <p className="enm-playbook-clarifier">
                The <strong>Method</strong> is the free framework on this page. The{' '}
                <strong>Playbook</strong> is the complete book that goes deep on every step, stage,
                and practice — with examples and checklists. Same system, two depths.
              </p>
              <a href="#download-playbook" className="btn btn-terra">
                Download the free Local Business Networking Playbook →
              </a>
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="enm-subscribe">
          <div className="enm-subscribe-inner">
            <h2 className="enm-subscribe-title">The calendar that makes the method work</h2>
            <p className="enm-subscribe-body">
              Every week we curate the business events in San Antonio, Austin, Dallas, and Houston —
              networking, chamber, real estate, technology, and small business. Pick your city and
              get the free Monday morning newsletter.
            </p>
            <Link href="/texas" className="btn btn-terra">
              Pick your city and subscribe free →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="enm-faq">
          <div className="enm-faq-inner">
            <h2 className="enm-faq-title">Frequently asked questions</h2>
            <dl className="enm-faq-list">
              {FAQ.map((item) => (
                <div key={item.q} className="enm-faq-item">
                  <dt className="enm-faq-q">{item.q}</dt>
                  <dd className="enm-faq-a">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
