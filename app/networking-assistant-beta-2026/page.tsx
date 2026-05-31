'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  fetchFollowUpQueue,
  fetchPersons,
  fetchMyNAEvents,
  updateFollowUp,
  daysAgo,
} from '../../src/lib/networking-assistant';

const ACTION_LABELS: Record<string, string> = {
  linkedin_connect: 'Connect on LinkedIn',
  linkedin_message: 'LinkedIn message',
  email:            'Send email',
  call:             'Call',
  reminder:         'Reminder',
  re_engage:        'Re-engage',
};

function formatShortDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dueBucket(d: string): 'overdue' | 'today' | 'upcoming' {
  const t = new Date().toISOString().split('T')[0];
  return d < t ? 'overdue' : d === t ? 'today' : 'upcoming';
}

function metLabel(dateStr: string) {
  const days = daysAgo(dateStr);
  if (days < 0) return `in ${Math.abs(days)}d`;
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

const REL_COLOR: Record<string, string> = {
  hot: '#dc2626', warm: '#2563eb', cold: '#6b7280', archived: '#9ca3af',
};

// ── Shared styles
const css = {
  page: { minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 80 } as React.CSSProperties,
  header: { background: '#042C53', padding: '0 16px' } as React.CSSProperties,
  headerInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 } as React.CSSProperties,
  headerTitle: { fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: -0.2 } as React.CSSProperties,
  headerSub: { fontSize: 11, color: '#93b4d4', letterSpacing: 0.5, textTransform: 'uppercase' as const },
  card: { background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10 } as React.CSSProperties,
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: 20 },
  btn: (bg: string, color = '#fff') => ({
    height: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
    background: bg, color, fontWeight: 600, fontSize: 14, padding: '0 18px',
  } as React.CSSProperties),
  btnSm: (bg: string, color = '#fff', border?: string) => ({
    height: 36, borderRadius: 8, border: border ?? 'none', cursor: 'pointer',
    background: bg, color, fontWeight: 600, fontSize: 13, padding: '0 14px',
    display: 'inline-flex', alignItems: 'center',
  } as React.CSSProperties),
};

export default function NAHomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [followUps, setFollowUps]     = useState<any[]>([]);
  const [persons, setPersons]         = useState<any[]>([]);
  const [events, setEvents]           = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [tab, setTab]                 = useState<'queue' | 'contacts' | 'events'>('queue');

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

  const BORDER: Record<string, string> = { overdue: '#ef4444', today: '#2563eb', upcoming: '#e5e7eb' };

  const FollowUpCard = ({ fu }: { fu: any }) => {
    const bucket = dueBucket(fu.due_date);
    const name = [fu.na_persons?.first_name, fu.na_persons?.last_name].filter(Boolean).join(' ') || 'Unknown';
    return (
      <div style={{ ...css.card, borderLeft: `4px solid ${BORDER[bucket]}`, paddingLeft: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`}
              style={{ fontSize: 16, fontWeight: 700, color: '#111827', textDecoration: 'none', display: 'block', marginBottom: 2 }}>
              {name}
            </a>
            <div style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>
              {ACTION_LABELS[fu.action_type] ?? fu.action_type}
            </div>
            {fu.na_persons?.company && (
              <div style={{ fontSize: 12, color: '#6b7280' }}>{fu.na_persons.company}</div>
            )}
            {fu.na_events?.event_name && (
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>
                {fu.na_events.event_name} · {metLabel(fu.na_events.event_date)}
              </div>
            )}
          </div>
          <div style={{ flexShrink: 0, marginLeft: 12, textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: BORDER[bucket] }}>{formatShortDate(fu.due_date)}</div>
            {bucket === 'overdue' && <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 600 }}>OVERDUE</div>}
            {bucket === 'today' && <div style={{ fontSize: 10, color: '#2563eb', fontWeight: 600 }}>TODAY</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => handleComplete(fu.id)} style={css.btnSm('#042C53')}>✓ Done</button>
          <button onClick={() => handleSnooze(fu.id)} style={css.btnSm('#fff', '#374151', '1px solid #e5e7eb')}>Snooze 2d</button>
          <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`}
            style={{ ...css.btnSm('#f3f4f6', '#374151'), textDecoration: 'none' }}>View →</a>
        </div>
      </div>
    );
  };

  return (
    <div style={css.page}>
      {/* Header */}
      <div style={css.header}>
        <div style={css.headerInner}>
          <div>
            <div style={css.headerSub}>Local Business Calendars</div>
            <div style={css.headerTitle}>Networking Assistant</div>
          </div>
          <a href="/networking-assistant-beta-2026/capture" style={{
            height: 36, borderRadius: 8, background: '#c2410c', color: '#fff',
            fontWeight: 700, fontSize: 13, textDecoration: 'none', padding: '0 16px',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>+ Capture</a>
        </div>

        {/* Stats */}
        {!pageLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
            {[
              { label: 'Overdue',  val: overdue.length,  color: overdue.length > 0 ? '#f87171' : '#93b4d4' },
              { label: 'Today',    val: today.length,    color: today.length > 0 ? '#60a5fa' : '#93b4d4' },
              { label: 'Upcoming', val: upcoming.length, color: '#93b4d4' },
              { label: 'Contacts', val: persons.length,  color: '#93b4d4' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', paddingTop: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#64849e', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 0' }}>
        {pageLoading ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '48px 0', fontSize: 14 }}>Loading…</div>
        ) : tab === 'queue' ? (
          followUps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 16px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>All caught up</div>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>No follow-ups pending.</div>
              <a href="/networking-assistant-beta-2026/capture"
                style={{ display: 'inline-flex', alignItems: 'center', height: 44, borderRadius: 10, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 14, padding: '0 24px', textDecoration: 'none' }}>
                + Capture Contacts
              </a>
            </div>
          ) : (
            <div>
              {overdue.length > 0 && <>
                <div style={css.sectionLabel}>⚠ Overdue · {overdue.length}</div>
                {overdue.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
              </>}
              {today.length > 0 && <>
                <div style={css.sectionLabel}>Due Today · {today.length}</div>
                {today.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
              </>}
              {upcoming.length > 0 && <>
                <div style={css.sectionLabel}>Upcoming · {upcoming.length}</div>
                {upcoming.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
              </>}
            </div>
          )
        ) : tab === 'contacts' ? (
          persons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 16px', fontSize: 14, color: '#6b7280' }}>
              No contacts yet.{' '}
              <a href="/networking-assistant-beta-2026/capture" style={{ color: '#2563eb' }}>Capture your first →</a>
            </div>
          ) : (
            <div>
              <div style={css.sectionLabel}>All Contacts · {persons.length}</div>
              {persons.map(p => (
                <a key={p.id} href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ ...css.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                        {[p.first_name, p.last_name].filter(Boolean).join(' ')}
                      </div>
                      <div style={{ fontSize: 13, color: '#374151' }}>
                        {[p.title, p.company].filter(Boolean).join(' · ')}
                      </div>
                      {p.first_met_date && (
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Met {metLabel(p.first_met_date)}</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: REL_COLOR[p.relationship_status] ?? '#6b7280', textTransform: 'uppercase' as const }}>
                        {p.relationship_status}
                      </span>
                      <span style={{ color: '#d1d5db', fontSize: 16 }}>›</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )
        ) : (
          events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 16px', fontSize: 14, color: '#6b7280' }}>
              No events yet.{' '}
              <a href="/networking-assistant-beta-2026/events" style={{ color: '#2563eb' }}>Browse LBC events →</a>
            </div>
          ) : (
            <div>
              <div style={css.sectionLabel}>My Events · {events.length}</div>
              {events.map(ev => (
                <div key={ev.id} style={{ ...css.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{ev.event_name}</div>
                    <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}>
                      {new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    {ev.host_org && <div style={{ fontSize: 12, color: '#6b7280' }}>{ev.host_org}</div>}
                  </div>
                  <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`}
                    style={{ height: 36, borderRadius: 8, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 12, padding: '0 14px', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0, marginLeft: 12 }}>
                    Capture →
                  </a>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Fixed bottom tab bar */}
      <div style={{
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
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'none', cursor: 'pointer', gap: 2, position: 'relative',
            borderTop: tab === t.key ? '2px solid #042C53' : '2px solid transparent',
          }}>
            {t.badge > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: '50%', transform: 'translateX(10px)',
                background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700,
                borderRadius: 10, padding: '1px 5px', minWidth: 16, textAlign: 'center',
              }}>{t.badge}</span>
            )}
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.key ? 700 : 400, color: tab === t.key ? '#042C53' : '#6b7280' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
