'use client';
import Link from 'next/link';

interface Props {
  city?: string;
  category?: string;
}

const STEPS = [
  {
    num: '1',
    label: 'People',
    sub: 'Identify your target network',
    desc: 'Build a profile of your ideal connection — their role, the organizations they belong to, and the events they already attend.',
  },
  {
    num: '2',
    label: 'Content',
    sub: 'Produce it from events',
    desc: 'Each event becomes audio, video, text, or graphics you can share across your network — the fuel that powers everything that follows.',
  },
  {
    num: '3',
    label: 'Events',
    sub: 'Connect through them',
    desc: 'Find the events your ideal connections already attend, then go beyond showing up — join, speak, and eventually host your own.',
  },
  {
    num: '4',
    label: 'Relationships',
    sub: 'Maintain across channels',
    desc: 'Share what you produce across email, social media, your podcast, and your own events so your network stays warm consistently.',
  },
];

export function EventNetworkingMethodSection({ city, category }: Props = {}) {
  const cityLabel = city || 'your city';
  const categoryLabel = category ? ` ${category.toLowerCase()}` : '';
  const subText = city
    ? `A repeatable system for turning every event you attend into content, connections, and lasting relationships — used by ${cityLabel}${categoryLabel} professionals to grow intentional networks.`
    : `A repeatable system for turning every event you attend into content, connections, and lasting relationships.`;

  return (
    <section className="enm-mini-section">
      <div className="enm-mini-inner">
        <div className="enm-mini-top">
          <p className="enm-mini-overline">Free Resource</p>
          <h2 className="enm-mini-title">The Event Networking Method</h2>
          <p className="enm-mini-sub">{subText}</p>
        </div>
        <div className="enm-mini-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="enm-mini-card">
              <div className="enm-mini-card-header">
                <div className="enm-mini-num">{step.num}</div>
                <span className="enm-mini-label">{step.label}</span>
              </div>
              <p className="enm-mini-phase-sub">{step.sub}</p>
              <p className="enm-mini-desc">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="enm-mini-cta">
          <Link href="/event-networking-method" className="btn btn-gold">
            Learn the Method →
          </Link>
        </div>
      </div>
    </section>
  );
}
