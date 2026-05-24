import { MapPin, Calendar, Lock } from 'lucide-react';
import { Event } from '../lib/supabase';
import { parseDate, formatTime } from '../lib/utils';

type EventCardProps = {
  event: Event;
  index: number;
  isLoggedIn?: boolean;
  onAuthClick?: () => void;
};

export function EventCard({ event, index, isLoggedIn = false, onAuthClick }: EventCardProps) {
  const hasRealDesc =
    event.description && event.description !== 'Please find more details at the Event Website.';
  const rawDesc = hasRealDesc ? event.description! : '';

  const animationDelay = Math.min(index * 0.04, 0.35);

  const eventDate = parseDate(event.start_date);
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Logged-out: start time only. Logged-in: full start – end time.
  const startFmt = formatTime(event.start_time)
  const endFmt = formatTime(event.end_time)
  const timeLabel = isLoggedIn
    ? `${dayOfWeek}. ${monthDay} | ${startFmt}${endFmt ? ` - ${endFmt}` : ''}`
    : `${dayOfWeek}. ${monthDay} | ${startFmt}`;

  return (
    <div
      className="ev-card-new"
      style={{ animationDelay: `${animationDelay}s`, opacity: 0, transform: 'translateY(8px)' }}
    >
      <div className="ev-card-new-header">
        <div className="ev-card-new-header-content">
          <h3 className="ev-card-new-title">{event.name}</h3>
          <div className="ev-card-new-time">
            <Calendar size={14} className="ev-card-new-time-icon" />
            <span>{timeLabel}</span>
          </div>
          {event.address && (
            <div className="ev-card-new-location">
              <MapPin size={14} className="ev-card-new-location-icon" />
              <span>{event.address}</span>
            </div>
          )}
        </div>
        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ev-card-new-btn"
          >
            Event Site
          </a>
        )}
      </div>

      <div className="ev-card-new-body">
        {isLoggedIn ? (
          rawDesc ? (
            <p className="ev-card-new-desc">{rawDesc}</p>
          ) : (
            <p className="ev-card-new-desc ev-card-no-desc">See event site for description</p>
          )
        ) : (
          <div className="ev-card-gate">
            <p className="ev-card-new-desc ev-card-gate-text" aria-hidden="true">
              {rawDesc || 'Sign up to see full event details — description, end time, and location — plus get every upcoming event in your Monday newsletter.'}
            </p>
            <button className="ev-card-gate-overlay ev-card-gate-btn" onClick={onAuthClick}>
              <Lock size={13} className="ev-card-gate-icon" />
              <span>Sign up free — see full event details + Monday newsletter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
