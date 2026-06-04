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
    desc: 'Get clear on exactly who turns into customers — future buyers, referral partners, and connectors — before you walk into any room.',
  },
  {
    num: '2',
    label: 'Content',
    sub: 'Produce it from your involvement',
    desc: 'Every meeting and event becomes audio, video, text, or graphics that keeps your name in front of the right people between conversations.',
  },
  {
    num: '3',
    label: 'Participation',
    sub: 'Show up, step up, build your own rooms',
    desc: 'Participate actively in three or four organizations while selectively attending outside events — to reach new people and spot the rooms that matter most.',
  },
  {
    num: '4',
    label: 'Relationships',
    sub: 'Maintain across channels',
    desc: 'Follow up within 48 hours and stay consistent across email, social, and your own events — until they buy or send someone who does.',
  },
];

export function EventNetworkingMethodSection({ city, category }: Props = {}) {
  const cityLabel = city || 'your city';
  const categoryLabel = category ? ` ${category.toLowerCase()}` : '';
  const subText = city
    ? `A repeatable system for turning the people you meet into customers — used by ${cityLabel}${categoryLabel} professionals who'd rather build a reputation that lasts than chase a feed that forgets.`
    : `A repeatable system for turning the people you meet into customers — through the organizations you join and the events you attend.`;

  return (
    <section className="enm-mini-section">
      <div className="enm-mini-inner">
        <div className="enm-mini-top">
          <p className="enm-mini-overline">Free Resource</p>
          <h2 className="enm-mini-title">The Local Networking Method</h2>
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
          <Link href="/local-networking-method" className="btn btn-gold">
            Learn the Method →
          </Link>
        </div>
      </div>
    </section>
  );
}
