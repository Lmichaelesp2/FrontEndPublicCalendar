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
function initials(first: string, last?: string | null) {
  return ((first?.[0] ?? '') + (last?.[0] ?? '')).toUpperCase() || '?';
}

const REL_COLOR: Record<string, string> = {
  hot: '#dc2626', warm: '#2563eb', cold: '#6b7280', archived: '#9ca3af',
};
const BUCKET_DOT: Record<string, string> = {
  overdue: '#ef4444', today: '#2563eb', upcoming: '#d1d5db',
};

export default function NAHomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [followUps, setFollowUps]     = useState<any[]>([]);
  const [persons, setPersons]         = useState<any[]>([]);
  const [events, setEvents]           = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [mobileTab, setMobileTab]     = useState<'queue' | 'contacts' | 'events'>('queue');
  const [isDesktop, setIsDesktop]     = useState(false);
  const [desktopView, setDesktopView] = useState<'queue' | 'contacts' | 'events'>('queue');
  const [activeEventName, setActiveEventName] = useState<string | null>(null);

  useEffect(() => {
    setActiveEventName(localStorage.getItem('na_active_event_name'));
  }, []);

  function clearActiveEvent() {
    localStorage.removeItem('na_active_event_id');
    localStorage.removeItem('na_active_event_name');
    setActiveEventName(null);
  }

  // Search & filter state
  const [contactSearch, setContactSearch]   = useState('');
  const [relFilter, setRelFilter]           = useState<string>('all');
  const [eventFilter, setEventFilter]       = useState<string>('all');
  const [queueSearch, setQueueSearch]       = useState('');

  useEffect(() => { if (!loading && !user) router.push('/'); }, [loading, user, router]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#6b7280' }}>
      Loading…
    </div>
  );
  if (!user) { router.push('/'); return null; }

  const overdue  = followUps.filter(f => dueBucket(f.due_date) === 'overdue');
  const today    = followUps.filter(f => dueBucket(f.due_date) === 'today');
  const upcoming = followUps.filter(f => dueBucket(f.due_date) === 'upcoming');

  // Filtered contacts
  const filteredPersons = persons.filter(p => {
    const q = contactSearch.toLowerCase();
    const matchesSearch = !q ||
      `${p.first_name} ${p.last_name} ${p.company ?? ''} ${p.title ?? ''}`.toLowerCase().includes(q);
    const matchesRel = relFilter === 'all' || p.relationship_status === relFilter;
    const matchesEvent = eventFilter === 'all' || p.first_met_event_id === eventFilter;
    return matchesSearch && matchesRel && matchesEvent;
  });

  // Filtered queue (search only)
  const filteredQueue = queueSearch
    ? followUps.filter(f => {
        const q = queueSearch.toLowerCase();
        const name = `${f.na_persons?.first_name ?? ''} ${f.na_persons?.last_name ?? ''} ${f.na_persons?.company ?? ''}`.toLowerCase();
        return name.includes(q);
      })
    : followUps;

  const filteredOverdue  = filteredQueue.filter(f => dueBucket(f.due_date) === 'overdue');
  const filteredToday    = filteredQueue.filter(f => dueBucket(f.due_date) === 'today');
  const filteredUpcoming = filteredQueue.filter(f => dueBucket(f.due_date) === 'upcoming');

  // Unique events for filter dropdown (desktop)
  const myEventOptions = Array.from(
    new Map(persons.filter(p => p.first_met_event_id).map(p => [p.first_met_event_id, p])).values()
  ).map(p => ({ id: p.first_met_event_id, name: events.find((e: any) => e.id === p.first_met_event_id)?.event_name ?? 'Unknown event' }));

  // ── Follow-up row
  const FURow = ({ fu }: { fu: any }) => {
    const bucket = dueBucket(fu.due_date);
    const name = [fu.na_persons?.first_name, fu.na_persons?.last_name].filter(Boolean).join(' ') || 'Unknown';
    return (
      <div style={{
        background: '#fff', borderRadius: 8, padding: '14px 16px', marginBottom: 6,
        border: '1px solid #e8eaed', display: 'flex', gap: 12, alignItems: 'flex-start',
        transition: 'box-shadow 0.12s',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: BUCKET_DOT[bucket], flexShrink: 0, marginTop: 6 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
            <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`}
              style={{ fontSize: 14, fontWeight: 700, color: '#111827', textDecoration: 'none' }}>
              {name}
            </a>
            <span style={{ fontSize: 11, fontWeight: 700, color: bucket === 'upcoming' ? '#9ca3af' : BUCKET_DOT[bucket], flexShrink: 0, marginLeft: 8 }}>
              {bucket === 'overdue' ? 'OVERDUE' : bucket === 'today' ? 'TODAY' : formatShortDate(fu.due_date)}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>{ACTION_LABELS[fu.action_type] ?? fu.action_type}</div>
          {fu.na_persons?.company && <div style={{ fontSize: 12, color: '#6b7280' }}>{fu.na_persons.company}</div>}
          {fu.na_events?.event_name && (
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
              {fu.na_events.event_name} · {metLabel(fu.na_events.event_date)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button onClick={() => handleComplete(fu.id)} style={{
              height: 28, padding: '0 12px', borderRadius: 5, border: 'none',
              background: '#042C53', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer',
            }}>✓ Done</button>
            <button onClick={() => handleSnooze(fu.id)} style={{
              height: 28, padding: '0 12px', borderRadius: 5, border: '1px solid #e5e7eb',
              background: '#fff', color: '#374151', fontWeight: 600, fontSize: 12, cursor: 'pointer',
            }}>Snooze 2d</button>
            <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`} style={{
              height: 28, padding: '0 12px', borderRadius: 5, border: '1px solid #dbeafe',
              background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: 12,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            }}>View →</a>
          </div>
        </div>
      </div>
    );
  };

  const QueueContent = ({ showSearch = false }: { showSearch?: boolean }) => (
    <div>
      {/* Queue search — shown on desktop */}
      {showSearch && (
        <input
          value={queueSearch}
          onChange={e => setQueueSearch(e.target.value)}
          placeholder="Search follow-ups by name or company…"
          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e8eaed', fontSize: 13, marginBottom: 16, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
        />
      )}
      {followUps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 16px' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>All caught up</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>No follow-ups pending.</div>
          <a href="/networking-assistant-beta-2026/capture" style={{
            display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 20px',
            borderRadius: 7, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none',
          }}>+ Capture Contacts</a>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: '#9ca3af' }}>No results for "{queueSearch}"</div>
      ) : (
        <div>
          {filteredOverdue.length > 0 && <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 8 }}>⚠ Overdue · {filteredOverdue.length}</div>
            {filteredOverdue.map(fu => <FURow key={fu.id} fu={fu} />)}
          </>}
          {filteredToday.length > 0 && <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: filteredOverdue.length > 0 ? 20 : 0 }}>Due Today · {filteredToday.length}</div>
            {filteredToday.map(fu => <FURow key={fu.id} fu={fu} />)}
          </>}
          {filteredUpcoming.length > 0 && <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: (filteredOverdue.length + filteredToday.length) > 0 ? 20 : 0 }}>Upcoming · {filteredUpcoming.length}</div>
            {filteredUpcoming.map(fu => <FURow key={fu.id} fu={fu} />)}
          </>}
        </div>
      )}
    </div>
  );

  // ── Contact row with avatar
  const ContactRow = ({ p }: { p: any }) => (
    <a href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', background: '#eff6ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: '#1d4ed8', flexShrink: 0,
      }}>
        {initials(p.first_name, p.last_name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {[p.first_name, p.last_name].filter(Boolean).join(' ')}
        </div>
        <div style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {[p.title, p.company].filter(Boolean).join(' · ')}
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: REL_COLOR[p.relationship_status] ?? '#6b7280', textTransform: 'uppercase' as const, flexShrink: 0 }}>
        {p.relationship_status}
      </span>
    </a>
  );

  // ── Mobile contact list (search only)
  const ContactsList = () => (
    <div>
      <input
        value={contactSearch}
        onChange={e => setContactSearch(e.target.value)}
        placeholder="Search by name or company…"
        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
      />
      {persons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 13, color: '#6b7280' }}>
          No contacts yet. <a href="/networking-assistant-beta-2026/capture" style={{ color: '#2563eb' }}>Capture your first →</a>
        </div>
      ) : filteredPersons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: '#9ca3af' }}>No contacts match "{contactSearch}"</div>
      ) : <div>{filteredPersons.map(p => <ContactRow key={p.id} p={p} />)}</div>}
    </div>
  );

  // ── Events list
  const EventsList = () => (
    events.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 13, color: '#6b7280' }}>
        No events. <a href="/networking-assistant-beta-2026/events" style={{ color: '#2563eb' }}>Browse LBC →</a>
      </div>
    ) : (
      <div>
        {events.map(ev => {
          const isActive = activeEventName && localStorage.getItem('na_active_event_id') === ev.id;
          const isToday = ev.event_date === new Date().toISOString().split('T')[0];
          return (
            <div key={ev.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 1 }}>{ev.event_name}</div>
                  <div style={{ fontSize: 11, color: isToday ? '#c2410c' : '#2563eb', fontWeight: 600 }}>
                    {isToday ? '📍 Today' : formatDate(ev.event_date)}
                  </div>
                  {ev.host_org && <div style={{ fontSize: 11, color: '#9ca3af' }}>{ev.host_org}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', marginLeft: 8 }}>
                  {isActive ? (
                    <>
                      <a href="/networking-assistant-beta-2026/capture" style={{
                        height: 28, padding: '0 10px', borderRadius: 5, background: '#c2410c', color: '#fff',
                        fontWeight: 700, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                      }}>🎤 Capture</a>
                      <button onClick={clearActiveEvent} style={{
                        height: 20, borderRadius: 4, background: 'none', border: '1px solid #e5e7eb',
                        color: '#9ca3af', fontSize: 10, padding: '0 8px', cursor: 'pointer',
                      }}>End session</button>
                    </>
                  ) : (
                    <button onClick={() => { localStorage.setItem('na_active_event_id', ev.id); localStorage.setItem('na_active_event_name', ev.event_name); setActiveEventName(ev.event_name); }} style={{
                      height: 28, padding: '0 10px', borderRadius: 5, background: '#042C53', color: '#fff',
                      fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                    }}>I'm going →</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  );

  // ────────────────────────── DESKTOP LAYOUT ──────────────────────────
  if (isDesktop) return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ background: '#042C53', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ fontSize: 9, color: '#6b93b8', letterSpacing: 1.2, textTransform: 'uppercase' as const }}>Local Business Calendars</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: -0.2 }}>Networking Assistant</div>
          </div>
          {/* Stats inline in topbar */}
          {!pageLoading && (
            <div style={{ display: 'flex', gap: 20, marginLeft: 24, paddingLeft: 24, borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
              {[
                { label: 'Overdue', val: overdue.length, alert: overdue.length > 0 },
                { label: 'Today',   val: today.length,   alert: today.length > 0 },
                { label: 'Queue',   val: upcoming.length, alert: false },
                { label: 'Contacts', val: persons.length, alert: false },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: s.alert ? '#fca5a5' : '#e2e8f0', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: 0.8, textTransform: 'uppercase' as const, marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <a href="/networking-assistant-beta-2026/capture" style={{
          height: 32, padding: '0 16px', borderRadius: 6, background: '#c2410c',
          color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center',
        }}>+ Capture Contact</a>
      </div>

      {/* Body: left nav + main content + right panel */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr 280px', overflow: 'hidden', minHeight: 0 }}>

        {/* Left nav */}
        <div style={{ background: '#fff', borderRight: '1px solid #e8eaed', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
          <NavSection label="Follow-Ups" />
          <NavItem label="Queue" icon="◎" active={desktopView === 'queue'} badge={overdue.length + today.length} onClick={() => setDesktopView('queue')} />
          <NavSection label="Network" />
          <NavItem label="All Contacts" icon="👤" active={desktopView === 'contacts'} onClick={() => setDesktopView('contacts')} />
          <NavSection label="Events" />
          <NavItem label="My Events" icon="📅" active={desktopView === 'events'} onClick={() => setDesktopView('events')} />
          <NavItem label="Browse LBC" icon="↗" href="/networking-assistant-beta-2026/events" />
        </div>

        {/* Main content — queue or contacts or events */}
        <div style={{ overflowY: 'auto', padding: '20px 24px', background: '#f8f9fb' }}>
          {pageLoading ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 48, fontSize: 13 }}>Loading…</div>
          ) : desktopView === 'queue' ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                Follow-Up Queue <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>{followUps.length} pending</span>
              </div>
              <div style={{ maxWidth: 640 }}><QueueContent showSearch={true} /></div>
            </>
          ) : desktopView === 'contacts' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                  All Contacts <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>
                    {filteredPersons.length}{filteredPersons.length !== persons.length ? ` of ${persons.length}` : ''}
                  </span>
                </div>
              </div>

              {/* Desktop search + filters */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const }}>
                <input
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  placeholder="Search name, company, title…"
                  style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 7, border: '1px solid #e8eaed', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
                />
                {/* Relationship filter pills */}
                {(['all','hot','warm','cold'] as const).map(r => (
                  <button key={r} onClick={() => setRelFilter(r)} style={{
                    height: 34, padding: '0 14px', borderRadius: 20, border: '1.5px solid',
                    cursor: 'pointer', fontSize: 12, fontWeight: relFilter === r ? 700 : 400,
                    borderColor: relFilter === r ? '#042C53' : '#e8eaed',
                    background: relFilter === r ? '#042C53' : '#fff',
                    color: relFilter === r ? '#fff' : '#374151',
                  }}>
                    {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
                {/* Event filter */}
                {myEventOptions.length > 0 && (
                  <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} style={{
                    height: 34, padding: '0 10px', borderRadius: 7, border: '1px solid #e8eaed',
                    fontSize: 12, fontFamily: 'Inter, sans-serif', background: '#fff', cursor: 'pointer', color: '#374151',
                  }}>
                    <option value="all">All Events</option>
                    {myEventOptions.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                  </select>
                )}
              </div>

              {persons.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 48, fontSize: 13, color: '#6b7280' }}>
                  No contacts yet. <a href="/networking-assistant-beta-2026/capture" style={{ color: '#2563eb' }}>Capture your first →</a>
                </div>
              ) : filteredPersons.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 32, fontSize: 13, color: '#9ca3af' }}>No contacts match your filters.</div>
              ) : filteredPersons.map(p => (
                <a key={p.id} href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 6, background: '#fff', borderRadius: 8, border: '1px solid #e8eaed' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1d4ed8', flexShrink: 0 }}>
                    {initials(p.first_name, p.last_name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{[p.first_name, p.last_name].filter(Boolean).join(' ')}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{[p.title, p.company].filter(Boolean).join(' · ')}</div>
                    {p.first_met_date && <div style={{ fontSize: 11, color: '#9ca3af' }}>Met {metLabel(p.first_met_date)}</div>}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: REL_COLOR[p.relationship_status] ?? '#6b7280', textTransform: 'uppercase' as const }}>
                    {p.relationship_status}
                  </span>
                </a>
              ))}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                  My Events <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>{events.length}</span>
                </div>
                <a href="/networking-assistant-beta-2026/events" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Browse LBC →</a>
              </div>
              {events.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 48, fontSize: 13, color: '#6b7280' }}>No events yet.</div>
              ) : events.map(ev => (
                <div key={ev.id} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8eaed', padding: '12px 14px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{ev.event_name}</div>
                    <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 500 }}>{formatDate(ev.event_date)}</div>
                    {ev.host_org && <div style={{ fontSize: 11, color: '#6b7280' }}>{ev.host_org}</div>}
                  </div>
                  <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
                    height: 32, padding: '0 14px', borderRadius: 6, background: '#c2410c',
                    color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center',
                  }}>Capture →</a>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right panel — always shows contacts + events summary */}
        <div style={{ background: '#fff', borderLeft: '1px solid #e8eaed', overflowY: 'auto', padding: '20px 16px' }}>
          {/* Contacts summary */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const }}>Contacts · {persons.length}</div>
              <a href="/networking-assistant-beta-2026/capture" style={{ fontSize: 11, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>+ Add</a>
            </div>
            {persons.length === 0 ? (
              <div style={{ fontSize: 12, color: '#9ca3af' }}>None yet.</div>
            ) : persons.slice(0, 8).map(p => <ContactRow key={p.id} p={p} />)}
            {persons.length > 8 && (
              <button onClick={() => setDesktopView('contacts')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6, padding: 0 }}>
                View all {persons.length} →
              </button>
            )}
          </div>

          {/* Events summary */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const }}>My Events · {events.length}</div>
              <a href="/networking-assistant-beta-2026/events" style={{ fontSize: 11, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Browse</a>
            </div>
            {events.length === 0 ? (
              <div style={{ fontSize: 12, color: '#9ca3af' }}>None yet. <a href="/networking-assistant-beta-2026/events" style={{ color: '#2563eb' }}>Browse LBC →</a></div>
            ) : events.slice(0, 5).map(ev => {
              const isToday = ev.event_date === new Date().toISOString().split('T')[0];
              return (
                <div key={ev.id} style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{ev.event_name}</div>
                    <div style={{ fontSize: 11, color: isToday ? '#c2410c' : '#2563eb', fontWeight: 600 }}>{isToday ? '📍 Today' : formatDate(ev.event_date)}</div>
                  </div>
                  <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
                    height: 26, padding: '0 10px', borderRadius: 5, background: isToday ? '#c2410c' : '#042C53',
                    color: '#fff', fontWeight: 700, fontSize: 11, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                  }}>Capture →</a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // ────────────────────────── MOBILE LAYOUT ──────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 72 }}>
      {/* Header */}
      <div style={{ background: '#042C53' }}>
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
            <div>
              <div style={{ fontSize: 9, color: '#6b93b8', letterSpacing: 1, textTransform: 'uppercase' as const }}>Local Business Calendars</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Networking Assistant</div>
            </div>
            <a href="/networking-assistant-beta-2026/capture" style={{
              height: 34, padding: '0 14px', borderRadius: 7, background: '#c2410c',
              color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>+ Capture</a>
          </div>
        </div>
        {/* Stats */}
        {!pageLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 0 10px' }}>
            {[
              { label: 'Overdue', val: overdue.length,  color: overdue.length > 0 ? '#f87171' : '#6b93b8' },
              { label: 'Today',   val: today.length,    color: today.length > 0 ? '#93c5fd' : '#6b93b8' },
              { label: 'Queue',   val: upcoming.length, color: '#6b93b8' },
              { label: 'Contacts', val: persons.length, color: '#6b93b8' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 9, color: '#4a6a8a', letterSpacing: 0.8, textTransform: 'uppercase' as const, marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {/* Mobile tabs */}
        <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {(['queue','contacts','events'] as const).map(t => (
            <button key={t} onClick={() => setMobileTab(t)} style={{
              flex: 1, height: 36, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: mobileTab === t ? 700 : 400,
              color: mobileTab === t ? '#fff' : '#6b93b8',
              borderBottom: mobileTab === t ? '2px solid #c2410c' : '2px solid transparent',
            }}>
              {t === 'queue' ? `Queue` : t === 'contacts' ? `Contacts` : `Events`}
              <span style={{ marginLeft: 4, fontSize: 11, color: mobileTab === t ? '#93c5fd' : '#4a6a8a' }}>
                {t === 'queue' ? followUps.length : t === 'contacts' ? persons.length : events.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {pageLoading ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 48, fontSize: 13 }}>Loading…</div>
        ) : mobileTab === 'queue' ? <QueueContent />
          : mobileTab === 'contacts' ? <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 10 }}>All Contacts · {persons.length}</div>
            <ContactsList />
          </>
          : <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 10 }}>My Events · {events.length}</div>
            <EventsList />
          </>
        }
      </div>

      {/* Bottom tab bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 62,
        background: '#fff', borderTop: '1px solid #e5e7eb',
        display: 'flex', boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
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
            <span style={{ fontSize: 10, fontWeight: mobileTab === t.key ? 700 : 400, color: mobileTab === t.key ? '#042C53' : '#6b7280' }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Left nav helpers
function NavSection({ label }: { label: string }) {
  return <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const, padding: '12px 12px 4px' }}>{label}</div>;
}
function NavItem({ label, icon, active, badge, onClick, href }: { label: string; icon: string; active?: boolean; badge?: number; onClick?: () => void; href?: string }) {
  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 7,
    fontSize: 13, fontWeight: active ? 700 : 400, cursor: 'pointer',
    color: active ? '#1d4ed8' : '#374151',
    background: active ? '#eff6ff' : 'transparent',
    border: 'none', width: '100%', textAlign: 'left' as const, textDecoration: 'none',
  };
  const content = (
    <>
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
      {badge != null && badge > 0 && (
        <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px' }}>{badge}</span>
      )}
    </>
  );
  if (href) return <a href={href} style={style}>{content}</a>;
  return <button style={style} onClick={onClick}>{content}</button>;
}
