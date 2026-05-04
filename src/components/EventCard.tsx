import { MapPin, Calendar, Lock } from 'lucide-react';
import { Event } from '../lib/supabase';
import { parseDate } from '../lib/utils';

type EventCardProps = {
  event: Event;
  index: number;
  isLoggedIn?: boolean;
};

export function EventCard({ event, index, isLoggedIn = false }: EventCardProps) {
  const hasRealDesc =
    event.description && event.description !== 'Please find more details at the Event Website.';
  const rawDesc = hasRealDesc ? event.description! : '';

  const animationDelay = Math.min(index * 0.04, 0.35);

  const eventDate = parseDate(event.start_date);
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Logged-out: start time only. Logged-in: full start – end time.
  const timeLabel = isLoggedIn
    ? `${dayOfWeek}. ${monthDay} | ${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
    : `${dayOfWeek}. ${monthDay} | ${event.start_time}`;

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
              {rawDesc || 'Full event details including description, end time, and location are available to members.'}
            </p>
            <div className="ev-card-gate-overlay">
              <Lock size={13} className="ev-card-gate-icon" />
              <span>Sign up / Sign in — unlock full event details</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
