'use client';

import Link from 'next/link';

export function RightRoomMethodSection() {
  return (
    <section className="rrm-home-section">
      <div className="rrm-home-inner">

        <div className="rrm-home-header">
          <p className="rrm-home-overline">FREE RESOURCE</p>
          <h2>
            Choose Better Events <em>in 10 Seconds</em>
          </h2>
          <p className="rrm-home-sub">
            Most people attend business events randomly. The results are random too.
          </p>
        </div>

        <div className="rrm-home-steps">
          <div className="rrm-home-step">
            <div className="rrm-home-step-num">01</div>
            <div className="rrm-home-step-content">
              <strong>Goal</strong>
              <span>Why am I going?</span>
            </div>
          </div>
          <div className="rrm-home-step-arrow">→</div>
          <div className="rrm-home-step">
            <div className="rrm-home-step-num">02</div>
            <div className="rrm-home-step-content">
              <strong>People</strong>
              <span>Who is likely to be there?</span>
            </div>
          </div>
          <div className="rrm-home-step-arrow">→</div>
          <div className="rrm-home-step">
            <div className="rrm-home-step-num">03</div>
            <div className="rrm-home-step-content">
              <strong>Room</strong>
              <span>Is this the right environment?</span>
            </div>
          </div>
        </div>

        <div className="rrm-home-ctas">
          <Link href="/right-room-method" className="btn btn-gold">
            Learn the Right Room Method
          </Link>
          <Link href="/texas" className="btn btn-white">
            View This Week's Events
          </Link>
        </div>

      </div>
    </section>
  );
}
