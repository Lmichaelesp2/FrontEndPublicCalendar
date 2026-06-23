'use client';

import { CalendarDays } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-bar-inner">
        <CalendarDays size={18} strokeWidth={2} className="announcement-bar-icon" />
        <p className="announcement-bar-text">
          <strong>No login needed!</strong> The full week of events is open — just scroll down and use the calendar.
        </p>
      </div>
    </div>
  );
}
