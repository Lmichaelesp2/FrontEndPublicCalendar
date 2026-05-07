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
    ? `Most ${cityLabel}${categoryLabel} professionals choose events randomly. This method helps you choose with intention — so you show up to the right${categoryLabel} events and meet the right people.`
    : `Most people choose events randomly. This method helps you choose with intention — so you show up to the right rooms and meet the right people.`;

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
          {[
            { num: '1', title: 'Goal', desc: `What are you trying to accomplish in ${cityLabel}?` },
            { num: '2', title: 'People', desc: 'Who do you want to meet?' },
            { num: '3', title: 'Event', desc: city ? `Which ${cityLabel}${categoryLabel} event are they likely at?` : 'Which event are they likely to attend?' },
            { num: '4', title: 'Attend', desc: 'Show up prepared to connect.' },
          ].map((step, i, arr) => (
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
