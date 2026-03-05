import { MapPin, Info } from 'lucide-react';
import { Event } from '../lib/supabase';
import { parseDate } from '../lib/utils';

type EventCardProps = {
  event: Event;
  index: number;
};

export function EventCard({ event, index }: EventCardProps) {
  const hasRealDesc =
    event.description && event.description !== 'Please find more details at the Event Website.';
  const rawDesc = hasRealDesc ? event.description! : 'Information available on event site';

  const animationDelay = Math.min(index * 0.04, 0.35);

  const eventDate = parseDate(event.start_date);
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeLabel = `${dayOfWeek}. ${monthDay} | ${event.start_time}${event.end_time ? ` – ${event.end_time}` : ''}`;

  const tags: string[] = [];
  if (event.paid) tags.push(event.paid);
  if (event.time_of_day) tags.push(event.time_of_day);
  if (event.participation) tags.push(event.participation);

  return (
    <div
      className="ev-card-new"
      style={{ animationDelay: `${animationDelay}s`, opacity: 0, transform: 'translateY(8px)' }}
    >
      <div className="ev-card-new-header">
        <div className="ev-card-new-header-content">
          <h3 className="ev-card-new-title">{event.name}</h3>
          <div className="ev-card-new-time">{timeLabel}</div>
        </div>
        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ev-card-new-btn"
          >
            Event Page
          </a>
        )}
      </div>

      <div className="ev-card-new-body">
        {(event.address || event.group_name) && (
          <div className="ev-card-new-location-row">
            {event.address && (
              <div className="ev-card-new-location">
                <MapPin size={16} className="ev-card-new-icon" />
                <span>{event.address}</span>
              </div>
            )}
            {event.group_name && (
              <div className="ev-card-new-organizer">
                <span className="ev-card-new-organizer-label">Organized by:</span>
                <span className="ev-card-new-organizer-name">{event.group_name}</span>
                <button className="ev-card-new-info-btn" aria-label="Organizer info">
                  <Info size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="ev-card-new-tags">
            {tags.map((tag) => (
              <span key={tag} className="ev-card-new-tag">{tag}</span>
            ))}
          </div>
        )}

        <p className={`ev-card-new-desc${!hasRealDesc ? ' ev-card-new-desc-fallback' : ''}`}>{rawDesc}</p>
      </div>
    </div>
  );
}
