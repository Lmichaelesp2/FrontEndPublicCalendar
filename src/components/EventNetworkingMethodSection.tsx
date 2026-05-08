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
    ? `The Event Networking Method gives ${cityLabel}${categoryLabel} professionals a repeatable system for turning every event they attend into content, connections, and lasting relationships.`
    : `The Event Networking Method gives business professionals a repeatable system for turning every event they attend into content, connections, and lasting relationships.`;

  return (
    <section className="enm-home-section">
      <div className="enm-home-inner">
        <div className="enm-home-left">
          <p className="enm-home-overline">Free Resource</p>
          <h2>The Event Networking Method</h2>
          <p className="enm-home-sub">{subText}</p>
          <Link href="/event-networking-method" className="btn btn-gold">
            Learn the Method
          </Link>
        </div>
        <div className="enm-home-steps">
          {STEPS.map((step, i, arr) => (
            <div key={step.num} className="enm-home-steps-row">
              <div className="enm-home-step">
                <div className="enm-home-step-num">{step.num}</div>
                <div className="enm-home-step-content">
                  <strong>{step.label}</strong>
                  <em className="enm-home-step-sub">{step.sub}</em>
                  <span>{step.desc}</span>
                </div>
              </div>
              {i < arr.length - 1 && <div className="enm-home-step-arrow">↓</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
