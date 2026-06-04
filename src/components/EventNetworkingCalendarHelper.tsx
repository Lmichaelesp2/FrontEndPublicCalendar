'use client';

import Link from 'next/link';

export function EventNetworkingCalendarHelper() {
  return (
    <div className="enm-cal-helper">
      <div className="enm-cal-helper-inner">
        <div className="enm-cal-helper-text">
          <p className="enm-cal-helper-headline">How to Use This Calendar</p>
          <p className="enm-cal-helper-body">
            Use the calendar to find what's happening. Use the{' '}
            <strong>Event Networking Method</strong> to decide where to show up.
            Before choosing an event, ask:{' '}
            <strong>Goal · People · Event · Attend</strong>
          </p>
        </div>
        <Link href="/local-networking-method" className="enm-cal-helper-link">
          Learn the Method →
        </Link>
      </div>
    </div>
  );
}
