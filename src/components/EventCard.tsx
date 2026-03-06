import { MapPin, Calendar } from 'lucide-react';
import { Event } from '../lib/supabase';
import { parseDate } from '../lib/utils';

type EventCardProps = {
  event: Event;
  index: number;
};

export function EventCard({ event, index }: EventCardProps) {
  const hasRealDesc =
    event.description && event.description !== 'Please find more details at the Event Website.';
  const rawDesc = hasRealDesc ? event.description! : '';

  const animationDelay = Math.min(index * 0.04, 0.35);

  const eventDate = parseDate(event.start_date);
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeLabel = `${dayOfWeek}. ${monthDay} | ${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`;

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
          {event.address ? (
            <div className="ev-card-new-location">
              <MapPin size={14} className="ev-card-new-location-icon" />
              <span>{event.address}</span>
            </div>
          ) : (
            <div className="ev-card-new-location">
              <MapPin size={14} className="ev-card-new-location-icon" />
              <span>Visit site for location details</span>
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

        {rawDesc ? (
          <p className="ev-card-new-desc">{rawDesc}</p>
        ) : (
          <p className="ev-card-new-desc ev-card-no-desc">See event site for description</p>
        )}

        {event.group_name && (
          <div className="ev-card-new-footer">
            <span className="ev-card-new-org">{event.group_name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
