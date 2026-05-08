'use client';

import Link from 'next/link';

interface Props {
  city?: string;
  category?: string;
}

export function EventNetworkingMethodSection({ city, category }: Props = {}) {
  const cityLabel = city || 'your city';
  const categoryLabel = category ? ` ${category.toLowerCase()}` : '';

  const subText = city
    ? `The Event Networking Method gives ${cityLabel}${categoryLabel} professionals a simple system for turning local events into lasting business relationships — intentionally, not by accident.`
    : `The Event Networking Method gives business professionals a simple system for turning local events into lasting business relationships — intentionally, not by accident.`;

  const steps = [
    {
      num: '1',
      title: 'People',
      desc: city
        ? `Who do you want in your ${cityLabel}${categoryLabel} network? Start by getting clear on the people, industries, and organizations you want to connect with.`
        : 'Who do you want in your network? Start by getting clear on the people, industries, and organizations you want to connect with.',
    },
    {
      num: '2',
      title: 'Content',
      desc: 'What will you share to stay top-of-mind? Build a simple content habit that keeps your name in front of the people you meet — before, during, and after every event.',
    },
    {
      num: '3',
      title: 'Events',
      desc: city
        ? `Where do those people show up in ${cityLabel}? Find the${categoryLabel} events your ideal connections already attend — and show up with a plan.`
        : 'Where do those people show up? Find the events your ideal connections already attend — and show up with a plan.',
    },
    {
      num: '4',
      title: 'Relationships',
      desc: 'How do you keep every connection alive? Use event content and consistent follow-up to turn one-time meetings into real, ongoing professional relationships.',
    },
  ];

  return (
    <section className="enm-home-section">
      <div className="enm-home-inner">
        <div className="enm-home-left">
          <p className="enm-home-overline">FREE RESOURCE</p>
          <h2>The Event Networking Method</h2>
          <p className="enm-home-sub">{subText}</p>
          <Link href="/event-networking-method" className="btn btn-gold">
            Learn the Method
          </Link>
        </div>
        <div className="enm-home-steps">
          {steps.map((step, i, arr) => (
            <div key={step.num} className="enm-home-steps-row">
              <div className="enm-home-step">
                <div className="enm-home-step-num">{step.num}</div>
                <div className="enm-home-step-content">
                  <strong>{step.title}</strong>
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
