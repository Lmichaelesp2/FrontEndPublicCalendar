'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  fetchFollowUpQueue, fetchPersons, fetchMyNAEvents,
  updateFollowUp, daysAgo,
} from '../../src/lib/networking-assistant';

const ACTION_LABELS: Record<string, string> = {
  linkedin_connect: 'Connect on LinkedIn',
  linkedin_message: 'LinkedIn message',
  email:            'Send email',
  call:             'Call',
  reminder:         'Reminder',
  re_engage:        'Re-engage',
};

function formatShortDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
function dueBucket(d: string): 'overdue' | 'today' | 'upcoming' {
  const t = new Date().toISOString().split('T')[0];
  return d < t ? 'overdue' : d === t ? 'today' : 'upcoming';
}
function metLabel(d: string) {
  const days = daysAgo(d);
  if (days < 0) return `in ${Math.abs(days)}d`;
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

const REL_COLOR: Record<string, string> = {
  hot: '#dc2626', warm: '#2563eb', cold: '#6b7280', archived: '#9ca3af',
};
const BORDER: Record<string, string> = {
  overdue: '#ef4444', today: '#2563eb', upcoming: '#e5e7eb',
};

export default function NAHomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [followUps, setFollowUps]     = useState<any[]>([]);
  const [persons, setPersons]         = useState<any[]>([]);
  const [events, setEvents]           = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [mobileTab, setMobileTab]     = useState<'queue' | 'contacts' | 'events'>('queue');

  useEffect(() => { if (!loading && !user) router.push('/'); }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setPageLoading(true);
      const [fq, pp, ev] = await Promise.all([
        fetchFollowUpQueue(user.id),
        fetchPersons(user.id),
        fetchMyNAEvents(user.id),
      ]);
      if (fq.data) setFollowUps(fq.data);
      if (pp.data) setPersons(pp.data);
      if (ev.data) setEvents(ev.data);
      setPageLoading(false);
    })();
  }, [user]);

  async function handleComplete(id: string) {
    await updateFollowUp(id, { status: 'completed', completed_at: new Date().toISOString() });
    setFollowUps(p => p.filter(f => f.id !== id));
  }
  async function handleSnooze(id: string) {
    const d = new Date(); d.setDate(d.getDate() + 2);
    await updateFollowUp(id, { status: 'snoozed', snooze_until: d.toISOString().split('T')[0] });
    setFollowUps(p => p.filter(f => f.id !== id));
  }

  if (loading || !user) return null;

  const overdue  = followUps.filter(f => dueBucket(f.due_date) === 'overdue');
  const today    = followUps.filter(f => dueBucket(f.due_date) === 'today');
  const upcoming = followUps.filter(f => dueBucket(f.due_date) === 'upcoming');

  const FollowUpCard = ({ fu }: { fu: any }) => {
    const bucket = dueBucket(fu.due_date);
    const name = [fu.na_persons?.first_name, fu.na_persons?.last_name].filter(Boolean).join(' ') || 'Unknown';
    return (
      <div style={{ background: '#fff', borderRadius: 10, padding: '14px 14px 14px 10px', marginBottom: 8, borderLeft: `4px solid ${BORDER[bucket]}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`}
              style={{ fontSize: 15, fontWeight: 700, color: '#111827', textDecoration: 'none', display: 'block', marginBottom: 2 }}>
              {name}
            </a>
            <div style={{ fontSize: 13, color: '#374151', marginBottom: 1 }}>{ACTION_LABELS[fu.action_type] ?? fu.action_type}</div>
            {fu.na_persons?.company && <div style={{ fontSize: 12, color: '#6b7280' }}>{fu.na_persons.company}</div>}
            {fu.na_events?.event_name && (
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>
                {fu.na_events.event_name} · {metLabel(fu.na_events.event_date)}
              </div>
            )}
          </div>
          <div style={{ flexShrink: 0, marginLeft: 10, textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: BORDER[bucket] }}>{formatShortDate(fu.due_date)}</div>
            {bucket !== 'upcoming' && (
              <div style={{ fontSize: 10, fontWeight: 700, color: BORDER[bucket], textTransform: 'uppercase' as const }}>
                {bucket === 'overdue' ? 'Overdue' : 'Today'}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => handleComplete(fu.id)} style={{ height: 34, borderRadius: 7, border: 'none', background: '#042C53', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: '0 14px' }}>✓ Done</button>
          <button onClick={() => handleSnooze(fu.id)} style={{ height: 34, borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: '0 14px' }}>Snooze 2d</button>
          <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`}
            style={{ height: 34, borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: 12, padding: '0 14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            View →
          </a>
        </div>
      </div>
    );
  };

  const QueueContent = () => (
    followUps.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '48px 16px' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>All caught up</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>No follow-ups pending.</div>
        <a href="/networking-assistant-beta-2026/capture" style={{ display: 'inline-flex', alignItems: 'center', height: 42, borderRadius: 10, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 13, padding: '0 20px', textDecoration: 'none' }}>
          + Capture Contacts
        </a>
      </div>
    ) : (
      <div>
        {overdue.length > 0 && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: 4 }}>⚠ Overdue · {overdue.length}</div>
          {overdue.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
        </>}
        {today.length > 0 && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: overdue.length > 0 ? 16 : 4 }}>Due Today · {today.length}</div>
          {today.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
        </>}
        {upcoming.length > 0 && <>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: (overdue.length + today.length) > 0 ? 16 : 4 }}>Upcoming · {upcoming.length}</div>
          {upcoming.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
        </>}
      </div>
    )
  );

  const ContactsList = () => (
    persons.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '32px 16px', fontSize: 13, color: '#6b7280' }}>
        No contacts yet. <a href="/networking-assistant-beta-2026/capture" style={{ color: '#2563eb' }}>Capture your first →</a>
      </div>
    ) : (
      <div>
        {persons.map(p => (
          <a key={p.id} href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{[p.first_name, p.last_name].filter(Boolean).join(' ')}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{[p.title, p.company].filter(Boolean).join(' · ')}</div>
                {p.first_met_date && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>Met {metLabel(p.first_met_date)}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: REL_COLOR[p.relationship_status] ?? '#6b7280', textTransform: 'uppercase' as const }}>{p.relationship_status}</span>
                <span style={{ color: '#d1d5db' }}>›</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    )
  );

  const EventsList = () => (
    events.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '32px 16px', fontSize: 13, color: '#6b7280' }}>
        No events yet. <a href="/networking-assistant-beta-2026/events" style={{ color: '#2563eb' }}>Browse LBC events →</a>
      </div>
    ) : (
      <div>
        {events.map(ev => (
          <div key={ev.id} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{ev.event_name}</div>
              <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 500 }}>{formatDate(ev.event_date)}</div>
              {ev.host_org && <div style={{ fontSize: 11, color: '#6b7280' }}>{ev.host_org}</div>}
            </div>
            <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`}
              style={{ height: 34, borderRadius: 7, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 12, padding: '0 12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', flexShrink: 0, marginLeft: 10 }}>
              Capture →
            </a>
          </div>
        ))}
      </div>
    )
  );

  return (
    <>
      {/* Responsive styles injected via style tag */}
      <style>{`
        .na-layout { display: block; }
        .na-sidebar { display: none; }
        .na-main { width: 100%; }
        .na-mobile-tabs { display: flex; }
        .na-mobile-bottomnav { display: flex; }
        .na-desktop-actions { display: none; }

        @media (min-width: 768px) {
          .na-page { padding-bottom: 0 !important; }
          .na-header-inner { max-width: 960px !important; }
          .na-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; max-width: 960px; margin: 0 auto; padding: 24px 24px 40px; }
          .na-sidebar { display: block; }
          .na-main { width: 100%; }
          .na-mobile-tabs { display: none; }
          .na-mobile-bottomnav { display: none; }
          .na-desktop-actions { display: flex; }
          .na-header-stats { max-width: 960px !important; }
        }
      `}</style>

      <div className="na-page" style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 72 }}>

        {/* Header */}
        <div style={{ background: '#042C53' }}>
          <div className="na-header-inner" style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
              <div>
                <div style={{ fontSize: 10, color: '#93b4d4', letterSpacing: 1, textTransform: 'uppercase' as const }}>Local Business Calendars</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Networking Assistant</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {/* Desktop: show both buttons */}
                <a className="na-desktop-actions" href="/networking-assistant-beta-2026/events"
                  style={{ height: 34, borderRadius: 7, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#93b4d4', fontWeight: 600, fontSize: 12, padding: '0 14px', textDecoration: 'none', display: 'none', alignItems: 'center' }}>
                  Events
                </a>
                <a href="/networking-assistant-beta-2026/capture"
                  style={{ height: 36, borderRadius: 8, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', padding: '0 16px', display: 'inline-flex', alignItems: 'center' }}>
                  + Capture
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          {!pageLoading && (
            <div className="na-header-stats" style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
                {[
                  { label: 'Overdue',  val: overdue.length,  color: overdue.length > 0 ? '#f87171' : '#93b4d4' },
                  { label: 'Today',    val: today.length,    color: today.length > 0 ? '#60a5fa' : '#93b4d4' },
                  { label: 'Upcoming', val: upcoming.length, color: '#93b4d4' },
                  { label: 'Contacts', val: persons.length,  color: '#93b4d4' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', paddingTop: 10 }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: '#64849e', letterSpacing: 0.8, textTransform: 'uppercase' as const, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile tabs */}
          <div className="na-mobile-tabs" style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {(['queue','contacts','events'] as const).map(t => (
              <button key={t} onClick={() => setMobileTab(t)} style={{
                flex: 1, height: 38, background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: mobileTab === t ? 700 : 400,
                color: mobileTab === t ? '#fff' : '#93b4d4',
                borderBottom: mobileTab === t ? '2px solid #c2410c' : '2px solid transparent',
                textTransform: 'capitalize' as const,
              }}>
                {t === 'queue' ? `Queue (${followUps.length})` : t === 'contacts' ? `Contacts (${persons.length})` : `Events (${events.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* ── DESKTOP: two-column layout / MOBILE: single tab */}
        {pageLoading ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '48px 0', fontSize: 14 }}>Loading…</div>
        ) : (
          <>
            {/* Desktop two-column */}
            <div className="na-layout">
              {/* Left: Queue */}
              <div className="na-main">
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12, display: 'none' }} className="na-desktop-section-label">
                  Follow-Up Queue
                </div>
                <QueueContent />
              </div>

              {/* Right: Contacts + Events sidebar */}
              <div className="na-sidebar">
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const }}>Contacts · {persons.length}</div>
                    <a href="/networking-assistant-beta-2026/capture" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>+ Add</a>
                  </div>
                  <ContactsList />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const }}>My Events · {events.length}</div>
                    <a href="/networking-assistant-beta-2026/events" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Browse</a>
                  </div>
                  <EventsList />
                </div>
              </div>
            </div>

            {/* Mobile single-column tab content */}
            <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 0' }}>
              <div className="na-mobile-tabs" style={{ display: mobileTab === 'queue' ? 'block' : 'none' }}>
                <QueueContent />
              </div>
              <div style={{ display: mobileTab === 'contacts' ? 'block' : 'none' }}>
                <div className="na-mobile-tabs">
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 10 }}>All Contacts · {persons.length}</div>
                  <ContactsList />
                </div>
              </div>
              <div style={{ display: mobileTab === 'events' ? 'block' : 'none' }}>
                <div className="na-mobile-tabs">
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 10 }}>My Events · {events.length}</div>
                  <EventsList />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile bottom nav */}
        <div className="na-mobile-bottomnav" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
          background: '#fff', borderTop: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'stretch',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        }}>
          {([
            { key: 'queue',    icon: '◎', label: 'Queue',    badge: overdue.length + today.length },
            { key: 'contacts', icon: '👤', label: 'Contacts', badge: 0 },
            { key: 'events',   icon: '📅', label: 'Events',   badge: 0 },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setMobileTab(t.key)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'none', cursor: 'pointer', gap: 2, position: 'relative',
              borderTop: mobileTab === t.key ? '2px solid #042C53' : '2px solid transparent',
            }}>
              {t.badge > 0 && (
                <span style={{ position: 'absolute', top: 6, right: '50%', transform: 'translateX(10px)', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 5px', minWidth: 16, textAlign: 'center' as const }}>
                  {t.badge}
                </span>
              )}
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 11, fontWeight: mobileTab === t.key ? 700 : 400, color: mobileTab === t.key ? '#042C53' : '#6b7280' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
