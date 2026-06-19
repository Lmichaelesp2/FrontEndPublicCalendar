'use client';
import { useState } from 'react';
import { MapPin, Calendar, Share2, CalendarPlus, X } from 'lucide-react';
import { Event } from '../lib/supabase';
import { parseDate, formatTime } from '../lib/utils';
import { SHOW_SPONSOR_SECTIONS } from '../lib/featureFlags';

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function parseTime12(time: string | null): { h: number; m: number } {
  if (!time) return { h: 0, m: 0 };
  // Handle "2:00 PM", "14:00", "2:00pm"
  const clean = time.trim();
  const match12 = clean.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (match12) {
    let h = parseInt(match12[1]);
    const m = parseInt(match12[2]);
    const isPM = match12[3].toLowerCase() === 'pm';
    if (isPM && h !== 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return { h, m };
  }
  const match24 = clean.match(/(\d+):(\d+)/);
  if (match24) return { h: parseInt(match24[1]), m: parseInt(match24[2]) };
  return { h: 0, m: 0 };
}

function toCalDT(date: string, time: string | null): string {
  const [y, mo, d] = date.split('-');
  const { h, m } = parseTime12(time);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}${mo}${d}T${pad(h)}${pad(m)}00`;
}

function googleCalUrl(event: Event): string {
  const start = toCalDT(event.start_date, event.start_time);
  const endDate = event.end_date ?? event.start_date;
  const end = toCalDT(endDate, event.end_time ?? event.start_time);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${start}/${end}`,
    details: event.description ?? '',
    location: event.address ?? '',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function outlookUrl(base: string, event: Event): string {
  const start = toCalDT(event.start_date, event.start_time);
  const endDate = event.end_date ?? event.start_date;
  const end = toCalDT(endDate, event.end_time ?? event.start_time);
  const fmt = (dt: string) =>
    `${dt.slice(0,4)}-${dt.slice(4,6)}-${dt.slice(6,8)}T${dt.slice(9,11)}:${dt.slice(11,13)}:00`;
  const params = new URLSearchParams({
    subject: event.name,
    startdt: fmt(start),
    enddt: fmt(end),
    location: event.address ?? '',
    body: event.description ?? '',
  });
  return `${base}?${params}`;
}

function yahooUrl(event: Event): string {
  const start = toCalDT(event.start_date, event.start_time);
  const endDate = event.end_date ?? event.start_date;
  const end = toCalDT(endDate, event.end_time ?? event.start_time);
  const params = new URLSearchParams({
    v: '60',
    title: event.name,
    st: start,
    et: end,
    in_loc: event.address ?? '',
    desc: event.description ?? '',
  });
  return `https://calendar.yahoo.com/?${params}`;
}

function downloadIcs(event: Event) {
  const start = toCalDT(event.start_date, event.start_time);
  const endDate = event.end_date ?? event.start_date;
  const end = toCalDT(endDate, event.end_time ?? event.start_time);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.name}`,
    `DESCRIPTION:${(event.description ?? '').replace(/\n/g, '\\n')}`,
    `LOCATION:${event.address ?? ''}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.name.replace(/[^a-z0-9]/gi, '_')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Time of day badge ────────────────────────────────────────────────────────

function getTimeOfDay(time: string | null): string | null {
  if (!time) return null;
  const { h } = parseTime12(time);
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function PaidBadge({ paid }: { paid: string }) {
  const isFree = paid?.toLowerCase() === 'free';
  const isUnknown = !paid || paid?.toLowerCase() === 'unknown';
  if (isUnknown) return null;
  return (
    <span style={{
      background: isFree ? 'var(--color-primary-bg)' : 'var(--color-paper-2)',
      border: `1px solid ${isFree ? 'var(--color-primary-light)' : 'var(--color-rule)'}`,
      color: isFree ? 'var(--color-primary-dark)' : 'var(--fg-3)',
      borderRadius: '20px', fontSize: '11px', fontWeight: isFree ? 600 : 500, padding: '3px 10px',
    }}>
      {isFree ? 'Free' : 'Paid'}
    </span>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span style={{
      background: 'var(--color-paper-2)',
      border: '1px solid var(--color-rule)',
      color: 'var(--fg-3)',
      borderRadius: '20px', fontSize: '11px', padding: '3px 10px', fontWeight: 500,
    }}>
      {label}
    </span>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      background: 'none', border: '1px solid var(--color-rule)', borderRadius: '8px',
      color: 'var(--fg-3)', cursor: 'pointer', fontSize: '12px', padding: '6px 12px',
      transition: 'background 0.15s, color 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-paper-2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-3)'; }}
    >
      {icon} {label}
    </button>
  );
}

// ─── Add to Calendar dropdown ─────────────────────────────────────────────────

const CAL_ICONS: Record<string, string> = {
  Google: '🗓️', Apple: '🍎', iCal: '📅',
  'Microsoft 365': '🟦', 'Outlook.com': '📧', Yahoo: '🟣',
};

function AddToCalendarMenu({ event, onClose }: { event: Event; onClose: () => void }) {
  const options = [
    { label: 'Google',        action: () => window.open(googleCalUrl(event), '_blank') },
    { label: 'Apple',         action: () => downloadIcs(event) },
    { label: 'iCal File',     action: () => downloadIcs(event) },
    { label: 'Microsoft 365', action: () => window.open(outlookUrl('https://outlook.office.com/calendar/0/deeplink/compose', event), '_blank') },
    { label: 'Outlook.com',   action: () => window.open(outlookUrl('https://outlook.live.com/calendar/0/deeplink/compose', event), '_blank') },
    { label: 'Yahoo',         action: () => window.open(yahooUrl(event), '_blank') },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: '110%', left: 0, zIndex: 50,
      background: '#1e2130', border: '1px solid #2a2f45', borderRadius: '12px',
      padding: '6px', minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      {options.map(o => (
        <button key={o.label} onClick={() => { o.action(); onClose(); }} style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          background: 'none', border: 'none', borderRadius: '8px',
          color: '#ddd', cursor: 'pointer', fontSize: '13px', padding: '8px 12px',
          textAlign: 'left',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2a2f45')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <span>{CAL_ICONS[o.label] ?? '📅'}</span> {o.label}
        </button>
      ))}
      <button onClick={onClose} style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        background: 'none', border: 'none', borderRadius: '8px',
        color: '#666', cursor: 'pointer', fontSize: '13px', padding: '8px 12px',
      }}>
        <X size={13} /> Close
      </button>
    </div>
  );
}

// ─── Share menu ───────────────────────────────────────────────────────────────

function ShareMenu({ event, onClose }: { event: Event; onClose: () => void }) {
  const shareUrl = event.website ?? typeof window !== 'undefined' ? window.location.href : '';
  const text = `${event.name} — ${event.start_date}`;

  const options = [
    {
      label: 'Facebook', color: '#1877F2',
      icon: '𝗳',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'),
    },
    {
      label: 'LinkedIn', color: '#0A66C2',
      icon: 'in',
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank'),
    },
    {
      label: 'Email', color: '#aaa',
      icon: '✉',
      action: () => window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`, '_blank'),
    },
    {
      label: 'Copy Link', color: '#aaa',
      icon: '🔗',
      action: () => { navigator.clipboard.writeText(shareUrl); onClose(); },
    },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: '110%', left: 0, zIndex: 50,
      background: '#1e2130', border: '1px solid #2a2f45', borderRadius: '12px',
      padding: '6px', minWidth: '160px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      {options.map(o => (
        <button key={o.label} onClick={() => { o.action(); onClose(); }} style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          background: 'none', border: 'none', borderRadius: '8px',
          color: o.color, cursor: 'pointer', fontSize: '13px', padding: '8px 12px',
          textAlign: 'left',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2a2f45')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <span style={{ width: '16px', textAlign: 'center' }}>{o.icon}</span> {o.label}
        </button>
      ))}
      <button onClick={onClose} style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        background: 'none', border: 'none', borderRadius: '8px',
        color: '#666', cursor: 'pointer', fontSize: '13px', padding: '8px 12px',
      }}>
        <X size={13} /> Close
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type EventCardProps = {
  event: Event;
  index: number;
  isLoggedIn?: boolean;  // true = hide the soft email CTA (already subscribed or premium)
  isPremium?: boolean;   // true = show recommended badge and match info
  onAuthClick?: () => void;
  /** Sponsor attribution shown in the email CTA footer */
  sponsorName?: string | null;
  sponsorLogoUrl?: string | null;
};

export function EventCard({ event, index, isLoggedIn = false, isPremium = false, onAuthClick, sponsorName, sponsorLogoUrl }: EventCardProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const hasRealDesc =
    event.description && event.description !== 'Please find more details at the Event Website.';
  const rawDesc = hasRealDesc ? event.description! : '';

  const animationDelay = Math.min(index * 0.04, 0.35);

  const eventDate = parseDate(event.start_date);
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const startFmt = formatTime(event.start_time);
  const endFmt = formatTime(event.end_time);
  // Always show full time range — no content gating
  const timeLabel = `${dayOfWeek}. ${monthDay} | ${startFmt}${endFmt ? ` – ${endFmt}` : ''}`;

  const timeOfDay = getTimeOfDay(event.start_time);

  const participationLabel = (() => {
    const p = event.participation?.toLowerCase() ?? '';
    if (p === 'virtual') return 'Virtual';
    if (p === 'hybrid') return 'Hybrid';
    return 'In-Person';
  })();

  function toggleAdd() { setAddOpen(o => !o); setShareOpen(false); }
  function toggleShare() { setShareOpen(o => !o); setAddOpen(false); }

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
          {/* Address — visible to everyone */}
          {event.address && (
            <div className="ev-card-new-location">
              <MapPin size={14} className="ev-card-new-location-icon" />
              <span>{event.address}{event.part_of_town ? ` · ${event.part_of_town}` : ''}</span>
            </div>
          )}
          {/* Organizer — visible to everyone */}
          {event.org_name && (
            <div style={{ color: '#b8c2d4', fontSize: '12px', marginTop: '4px' }}>
              Organized by:{' '}
              {event.org_home_page ? (
                <a
                  href={event.org_home_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#8ec5ff', textDecoration: 'underline' }}
                >
                  {event.org_name}
                </a>
              ) : (
                <span style={{ color: '#8ec5ff' }}>{event.org_name}</span>
              )}
            </div>
          )}
        </div>
        {/* External link — visible to everyone, labeled clearly */}
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
        {/* Badges — visible to everyone */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          <PaidBadge paid={event.paid} />
          {timeOfDay && <Badge label={timeOfDay} />}
          <Badge label={participationLabel} />
          {event.event_category && <Badge label={event.event_category} />}
          {isPremium && <span style={{
            background: '#f5a623', color: '#000',
            borderRadius: '20px', fontSize: '11px', fontWeight: 700, padding: '3px 10px',
          }}>✦ Recommended</span>}
        </div>

        {/* Description — visible to everyone */}
        {rawDesc ? (
          <p className="ev-card-new-desc">{rawDesc}</p>
        ) : (
          <p className="ev-card-new-desc ev-card-no-desc">See organizer page for full details</p>
        )}

        {/* Action buttons — visible to everyone */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <ActionBtn
              icon={<CalendarPlus size={13} />}
              label="Add"
              onClick={toggleAdd}
            />
            {addOpen && <AddToCalendarMenu event={event} onClose={() => setAddOpen(false)} />}
          </div>
          <div style={{ position: 'relative' }}>
            <ActionBtn
              icon={<Share2 size={13} />}
              label="Share"
              onClick={toggleShare}
            />
            {shareOpen && <ShareMenu event={event} onClose={() => setShareOpen(false)} />}
          </div>
        </div>

        {/* Soft email CTA — only for non-subscribers, non-intrusive */}
        {!isLoggedIn && (
          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid #1e2130',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {SHOW_SPONSOR_SECTIONS && sponsorLogoUrl && (
                <img
                  src={sponsorLogoUrl}
                  alt={sponsorName ?? 'Sponsor'}
                  style={{ height: '20px', width: 'auto', objectFit: 'contain', opacity: 0.85, borderRadius: '3px' }}
                />
              )}
              <span style={{ color: '#666', fontSize: '12px' }}>
                Get these events delivered every Monday
                {SHOW_SPONSOR_SECTIONS && sponsorName && (
                  <> · <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: '11px', letterSpacing: '0.01em' }}>{sponsorName}</span></>
                )}
              </span>
            </div>
            <button
              onClick={onAuthClick}
              style={{
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 12px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              Get Monday Newsletter →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
