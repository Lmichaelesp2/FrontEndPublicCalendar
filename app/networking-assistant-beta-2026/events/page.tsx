'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../src/contexts/AuthContext';
import {
  fetchUpcomingLBCEvents,
  fetchMyNAEvents,
  flagLBCEvent,
  createNAEvent,
  type LBCEvent,
  type NAEvent,
} from '../../../src/lib/networking-assistant';

const EVENT_TYPES = ['chamber','mixer','conference','startup','informal','coffee','other'] as const;
const CITIES = ['San Antonio','Austin','Dallas','Houston'] as const;

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const css = {
  page: { minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 24 } as React.CSSProperties,
  header: { background: '#042C53', padding: '0 16px' } as React.CSSProperties,
  headerInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 } as React.CSSProperties,
  card: { background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10 } as React.CSSProperties,
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8, marginTop: 16 },
  input: { width: '100%', padding: '11px 13px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', color: '#111827', outline: 'none' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
};

export default function NAEventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab]               = useState<'upcoming' | 'mine'>('upcoming');
  const [lbcEvents, setLbcEvents]   = useState<LBCEvent[]>([]);
  const [myEvents, setMyEvents]     = useState<NAEvent[]>([]);
  const [flaggedIds, setFlaggedIds] = useState<Set<number>>(new Set());
  const [cityFilter, setCityFilter] = useState('San Antonio');
  const [loadingData, setLoadingData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState('');

  const [form, setForm] = useState({
    event_name: '', event_date: '', event_type: 'other' as typeof EVENT_TYPES[number],
    host_org: '', location_name: '', city: 'San Antonio',
  });

  useEffect(() => { if (!loading && !user) router.push('/'); }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingData(true);
      const [lbc, mine] = await Promise.all([
        fetchUpcomingLBCEvents(cityFilter),
        fetchMyNAEvents(user.id),
      ]);
      if (lbc.data) setLbcEvents(lbc.data);
      if (mine.data) {
        setMyEvents(mine.data);
        setFlaggedIds(new Set(mine.data.filter(e => e.lbc_event_id).map(e => e.lbc_event_id as number)));
      }
      setLoadingData(false);
    })();
  }, [user, cityFilter]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  async function handleFlag(ev: LBCEvent) {
    if (!user || flaggedIds.has(ev.id)) return;
    const { data } = await flagLBCEvent(user.id, ev);
    if (data) {
      setFlaggedIds(p => new Set(p).add(ev.id));
      setMyEvents(p => [data, ...p]);
      showToast(`"${ev.name}" added to My Events`);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !form.event_name || !form.event_date) return;
    setSaving(true);
    const { data } = await createNAEvent({
      user_profile_id: user.id, source: 'manual', lbc_event_id: null,
      event_name: form.event_name, event_date: form.event_date,
      event_type: form.event_type, host_org: form.host_org || null,
      location_name: form.location_name || null, city: form.city,
      description: null, user_goal: null, user_rating: null, user_debrief_notes: null,
    });
    setSaving(false);
    if (data) {
      setMyEvents(p => [data, ...p]);
      setShowAddForm(false);
      setForm({ event_name: '', event_date: '', event_type: 'other', host_org: '', location_name: '', city: 'San Antonio' });
      showToast('Event created');
    }
  }

  if (loading || !user) return null;

  return (
    <div style={css.page}>
      {/* Header */}
      <div style={css.header}>
        <div style={css.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/networking-assistant-beta-2026" style={{ color: '#93b4d4', fontSize: 20, textDecoration: 'none', lineHeight: 1 }}>‹</a>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Events</div>
          </div>
          <button onClick={() => setShowAddForm(v => !v)} style={{
            height: 36, borderRadius: 8, background: showAddForm ? '#1f2a3d' : '#c2410c',
            color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', padding: '0 14px',
          }}>{showAddForm ? '✕ Cancel' : '+ Add Event'}</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {(['upcoming', 'mine'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, height: 40, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t ? 700 : 400,
              color: tab === t ? '#fff' : '#93b4d4',
              borderBottom: tab === t ? '2px solid #c2410c' : '2px solid transparent',
            }}>
              {t === 'upcoming' ? 'Upcoming LBC' : `My Events (${myEvents.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ background: '#042C53', color: '#fff', padding: '10px 16px', fontSize: 13, textAlign: 'center' }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 0' }}>

        {/* Add event form */}
        {showAddForm && (
          <form onSubmit={handleCreate} style={{ ...css.card, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>New Event</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={css.label}>Event Name *</label>
                <input required value={form.event_name} onChange={e => setForm(p => ({ ...p, event_name: e.target.value }))} placeholder="1 Million Cups SA" style={css.input} />
              </div>
              <div>
                <label style={css.label}>Date *</label>
                <input type="date" required value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} style={css.input} />
              </div>
              <div>
                <label style={css.label}>City</label>
                <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} style={{ ...css.input }}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={css.label}>Host Org</label>
                <input value={form.host_org} onChange={e => setForm(p => ({ ...p, host_org: e.target.value }))} placeholder="SA Chamber" style={css.input} />
              </div>
              <div>
                <label style={css.label}>Venue</label>
                <input value={form.location_name} onChange={e => setForm(p => ({ ...p, location_name: e.target.value }))} placeholder="Geekdom" style={css.input} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={css.label}>Event Type</label>
                <select value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value as any }))} style={{ ...css.input }}>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} style={{
              width: '100%', height: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: saving ? '#e5e7eb' : '#042C53', color: saving ? '#9ca3af' : '#fff',
              fontWeight: 700, fontSize: 15,
            }}>{saving ? 'Saving…' : 'Create Event'}</button>
          </form>
        )}

        {tab === 'upcoming' ? (
          <>
            {/* City pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {CITIES.map(city => (
                <button key={city} onClick={() => setCityFilter(city)} style={{
                  height: 32, borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 13, padding: '0 14px',
                  borderColor: cityFilter === city ? '#042C53' : '#e5e7eb',
                  background: cityFilter === city ? '#042C53' : '#fff',
                  color: cityFilter === city ? '#fff' : '#374151',
                  fontWeight: cityFilter === city ? 700 : 400,
                }}>
                  {city}
                </button>
              ))}
            </div>

            {loadingData ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0', fontSize: 14 }}>Loading…</div>
            ) : lbcEvents.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0', fontSize: 14 }}>No upcoming events for {cityFilter}.</div>
            ) : lbcEvents.map(ev => {
              const flagged = flaggedIds.has(ev.id);
              return (
                <div key={ev.id} style={css.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{ev.name}</div>
                      <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}>{formatDate(ev.start_date)}{ev.start_time ? ` · ${ev.start_time}` : ''}</div>
                      {ev.group_name && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{ev.group_name}</div>}
                      {ev.event_address && <div style={{ fontSize: 12, color: '#9ca3af' }}>{ev.event_address}</div>}
                    </div>
                    <button onClick={() => handleFlag(ev)} disabled={flagged} style={{
                      height: 34, borderRadius: 8, border: 'none', cursor: flagged ? 'default' : 'pointer',
                      fontSize: 12, fontWeight: 700, padding: '0 12px', flexShrink: 0, whiteSpace: 'nowrap' as const,
                      background: flagged ? '#f3f4f6' : '#042C53',
                      color: flagged ? '#9ca3af' : '#fff',
                    }}>
                      {flagged ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          myEvents.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0', fontSize: 14 }}>
              No events yet. Browse upcoming LBC events or add one above.
            </div>
          ) : myEvents.map(ev => (
            <div key={ev.id} style={css.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: ev.source === 'lbc' ? '#eff6ff' : '#fef3c7', color: ev.source === 'lbc' ? '#1d4ed8' : '#92400e', textTransform: 'uppercase' as const }}>
                      {ev.source === 'lbc' ? 'LBC' : 'Manual'}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{ev.event_name}</div>
                  <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}>{formatDate(ev.event_date)}</div>
                  {ev.host_org && <div style={{ fontSize: 12, color: '#6b7280' }}>{ev.host_org}</div>}
                </div>
                <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
                  height: 36, borderRadius: 8, background: '#c2410c', color: '#fff',
                  fontWeight: 700, fontSize: 12, padding: '0 14px', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                }}>Capture →</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
