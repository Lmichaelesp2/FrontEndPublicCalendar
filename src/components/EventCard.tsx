import { MapPin, Calendar, Lock, Users, DollarSign, Tag } from 'lucide-react';
import { Event } from '../lib/supabase';
import { parseDate, formatTime } from '../lib/utils';

type EventCardProps = {
  event: Event;
  index: number;
  isLoggedIn?: boolean;
  onAuthClick?: () => void;
};

function PaidBadge({ paid }: { paid: string }) {
  const isFree = paid?.toLowerCase() === 'free';
  const isUnknown = !paid || paid?.toLowerCase() === 'unknown';
  if (isUnknown) return null;
  return (
    <span style={{
      background: isFree ? '#16a34a20' : '#f5a62320',
      border: `1px solid ${isFree ? '#16a34a40' : '#f5a62340'}`,
      color: isFree ? '#4ade80' : '#f5a623',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 600,
      padding: '2px 8px',
      whiteSpace: 'nowrap' as const,
    }}>
      {isFree ? 'Free' : 'Paid'}
    </span>
  );
}

function Badge({ label, color = '#888' }: { label: string; color?: string }) {
  return (
    <span style={{
      background: '#1e2130',
      border: '1px solid #2a2f45',
      color,
      borderRadius: '6px',
      fontSize: '11px',
      padding: '2px 8px',
      whiteSpace: 'nowrap' as const,
    }}>
      {label}
    </span>
  );
}

export function EventCard({ event, index, isLoggedIn = false, onAuthClick }: EventCardProps) {
  const hasRealDesc =
    event.description && event.description !== 'Please find more details at the Event Website.';
  const rawDesc = hasRealDesc ? event.description! : '';

  const animationDelay = Math.min(index * 0.04, 0.35);

  const eventDate = parseDate(event.start_date);
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Logged-out: start time only. Logged-in: full start – end time.
  const startFmt = formatTime(event.start_time);
  const endFmt = formatTime(event.end_time);
  const timeLabel = isLoggedIn
    ? `${dayOfWeek}. ${monthDay} | ${startFmt}${endFmt ? ` - ${endFmt}` : ''}`
    : `${dayOfWeek}. ${monthDay} | ${startFmt}`;

  // Participation display
  const participationLabel = (() => {
    const p = event.participation?.toLowerCase() ?? '';
    if (p === 'virtual') return 'Virtual';
    if (p === 'hybrid') return 'Hybrid';
    return null; // In-Person is the default, no need to label it
  })();

  return (
    <div
      className="ev-card-new"
      style={{ animationDelay: `${animationDelay}s`, opacity: 0, transform: 'translateY(8px)' }}
    >
      <div className="ev-card-new-header">
        <div className="ev-card-new-header-content">
          <h3 className="ev-card-new-title">{event.name}</h3>

          {/* Org name — shown when logged in */}
          {isLoggedIn && event.org_name && (
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={11} style={{ flexShrink: 0 }} />
              <span>{event.org_name}</span>
            </div>
          )}

          <div className="ev-card-new-time">
            <Calendar size={14} className="ev-card-new-time-icon" />
            <span>{timeLabel}</span>
          </div>
          {event.address && (
            <div className="ev-card-new-location">
              <MapPin size={14} className="ev-card-new-location-icon" />
              <span>{event.address}{event.part_of_town && isLoggedIn ? ` · ${event.part_of_town}` : ''}</span>
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
          <>
            {rawDesc ? (
              <p className="ev-card-new-desc">{rawDesc}</p>
            ) : (
              <p className="ev-card-new-desc ev-card-no-desc">See event site for description</p>
            )}

            {/* Tag row — cost, participation, category */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              <PaidBadge paid={event.paid} />
              {participationLabel && <Badge label={participationLabel} color="#60a5fa" />}
              {event.event_category && (
                <Badge label={event.event_category} color="#a78bfa" />
              )}
            </div>
          </>
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
