'use client';

import Link from 'next/link';

export function RightRoomCalendarHelper() {
  return (
    <div className="rrm-cal-helper">
      <div className="rrm-cal-helper-inner">
        <div className="rrm-cal-helper-text">
          <p className="rrm-cal-helper-headline">How to Use This Calendar</p>
          <p className="rrm-cal-helper-body">
            Use the calendar to find what's happening. Use the Right Room Method to decide where to show up.
            Before choosing an event, ask:{' '}
            <strong>Goal · People · Room</strong>
          </p>
        </div>
        <Link href="/right-room-method" className="rrm-cal-helper-link">
          Learn the Method →
        </Link>
      </div>
    </div>
  );
}
