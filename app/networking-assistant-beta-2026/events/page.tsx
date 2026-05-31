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

export default function NAEventsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab]                   = useState<'upcoming' | 'mine'>('upcoming');
  const [lbcEvents, setLbcEvents]       = useState<LBCEvent[]>([]);
  const [myEvents, setMyEvents]         = useState<NAEvent[]>([]);
  const [flaggedIds, setFlaggedIds]     = useState<Set<number>>(new Set());
  const [cityFilter, setCityFilter]     = useState<string>('San Antonio');
  const [loadingData, setLoadingData]   = useState(true);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [saving, setSaving]             = useState(false);
  const [successMsg, setSuccessMsg]     = useState('');

  // Manual event form state
  const [form, setForm] = useState({
    event_name: '',
    event_date: '',
    event_type: 'other' as typeof EVENT_TYPES[number],
    host_org: '',
    location_name: '',
    city: 'San Antonio',
  });

  // ── Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [loading, user, router]);

  // ── Load data
  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoadingData(true);
      const [lbc, mine] = await Promise.all([
        fetchUpcomingLBCEvents(cityFilter),
        fetchMyNAEvents(user!.id),
      ]);
      if (lbc.data) setLbcEvents(lbc.data);
      if (mine.data) {
        setMyEvents(mine.data);
        const ids = new Set<number>(
          mine.data
            .filter(e => e.lbc_event_id !== null)
            .map(e => e.lbc_event_id as number)
        );
        setFlaggedIds(ids);
      }
      setLoadingData(false);
    }
    load();
  }, [user, cityFilter]);

  async function handleFlagLBC(lbcEvent: LBCEvent) {
    if (!user || flaggedIds.has(lbcEvent.id)) return;
    const { data } = await flagLBCEvent(user.id, lbcEvent);
    if (data) {
      setFlaggedIds(prev => new Set(prev).add(lbcEvent.id));
      setMyEvents(prev => [data, ...prev]);
      setSuccessMsg(`"${lbcEvent.name}" added to My Events`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  }

  async function handleCreateManual(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !form.event_name || !form.event_date) return;
    setSaving(true);
    const { data } = await createNAEvent({
      user_profile_id: user.id,
      source: 'manual',
      lbc_event_id: null,
      event_name: form.event_name,
      event_date: form.event_date,
      event_type: form.event_type,
      host_org: form.host_org || null,
      location_name: form.location_name || null,
      city: form.city,
      description: null,
      user_goal: null,
      user_rating: null,
      user_debrief_notes: null,
    });
    setSaving(false);
    if (data) {
      setMyEvents(prev => [data, ...prev]);
      setShowAddForm(false);
      setForm({ event_name: '', event_date: '', event_type: 'other', host_org: '', location_name: '', city: 'San Antonio' });
      setSuccessMsg('Event created');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  }

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#042C53', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: '#a8b8d4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
            Networking Assistant
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Events</div>
        </div>
        <a href="/networking-assistant-beta-2026" style={{ color: '#a8b8d4', fontSize: 13, textDecoration: 'none' }}>
          ← Queue
        </a>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div style={{ background: '#16a34a', color: '#fff', padding: '10px 24px', fontSize: 14, textAlign: 'center' }}>
          ✓ {successMsg}
        </div>
      )}

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['upcoming', 'mine'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              background: tab === t ? '#042C53' : '#e6e2d6',
              color: tab === t ? '#fff' : '#1f2a3d',
            }}>
              {t === 'upcoming' ? 'Upcoming LBC Events' : `My Events (${myEvents.length})`}
            </button>
          ))}
        </div>

        {/* ── Upcoming LBC tab */}
        {tab === 'upcoming' && (
          <>
            {/* City filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {CITIES.map(city => (
                <button key={city} onClick={() => setCityFilter(city)} style={{
                  padding: '5px 14px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 13,
                  borderColor: cityFilter === city ? '#1652f0' : '#e6e2d6',
                  background: cityFilter === city ? '#eef3fe' : '#fff',
                  color: cityFilter === city ? '#1652f0' : '#5b6678',
                  fontWeight: cityFilter === city ? 600 : 400,
                }}>
                  {city}
                </button>
              ))}
            </div>

            {loadingData ? (
              <div style={{ color: '#5b6678', textAlign: 'center', padding: 40 }}>Loading events…</div>
            ) : lbcEvents.length === 0 ? (
              <div style={{ color: '#5b6678', textAlign: 'center', padding: 40 }}>No upcoming events found for {cityFilter}.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lbcEvents.map(ev => {
                  const flagged = flaggedIds.has(ev.id);
                  return (
                    <div key={ev.id} style={{
                      background: '#fff', borderRadius: 10, padding: '14px 16px',
                      border: '1px solid #e6e2d6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#042C53', marginBottom: 4 }}>{ev.name}</div>
                          <div style={{ fontSize: 13, color: '#1652f0', fontWeight: 500 }}>{formatDate(ev.start_date)}{ev.start_time ? ` · ${ev.start_time}` : ''}</div>
                          {ev.group_name && <div style={{ fontSize: 12, color: '#5b6678', marginTop: 2 }}>{ev.group_name}</div>}
                          {ev.event_address && <div style={{ fontSize: 12, color: '#5b6678' }}>{ev.event_address}</div>}
                        </div>
                        <button onClick={() => handleFlagLBC(ev)} disabled={flagged} style={{
                          padding: '7px 14px', borderRadius: 8, border: 'none', cursor: flagged ? 'default' : 'pointer',
                          fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                          background: flagged ? '#e6e2d6' : '#042C53',
                          color: flagged ? '#5b6678' : '#fff',
                        }}>
                          {flagged ? '✓ Added' : '+ Add to Mine'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── My Events tab */}
        {tab === 'mine' && (
          <>
            <button onClick={() => setShowAddForm(v => !v)} style={{
              width: '100%', padding: '12px', borderRadius: 10, border: '2px dashed #1652f0',
              background: 'transparent', color: '#1652f0', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 16,
            }}>
              {showAddForm ? '✕ Cancel' : '+ Add Manual Event'}
            </button>

            {/* Manual event form */}
            {showAddForm && (
              <form onSubmit={handleCreateManual} style={{
                background: '#fff', border: '1px solid #e6e2d6', borderRadius: 10, padding: 16, marginBottom: 16
              }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, color: '#042C53' }}>New Event</div>
                {[
                  { label: 'Event Name *', key: 'event_name', type: 'text', required: true },
                  { label: 'Date *', key: 'event_date', type: 'date', required: true },
                  { label: 'Host Organization', key: 'host_org', type: 'text', required: false },
                  { label: 'Location / Venue', key: 'location_name', type: 'text', required: false },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>{f.label}</label>
                    <input
                      type={f.type}
                      required={f.required}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e6e2d6', fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>Event Type</label>
                  <select value={form.event_type} onChange={e => setForm(prev => ({ ...prev, event_type: e.target.value as any }))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e6e2d6', fontSize: 14 }}>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>City</label>
                  <select value={form.city} onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e6e2d6', fontSize: 14 }}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={saving} style={{
                  width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                  background: '#042C53', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer'
                }}>
                  {saving ? 'Saving…' : 'Create Event'}
                </button>
              </form>
            )}

            {/* My events list */}
            {myEvents.length === 0 ? (
              <div style={{ color: '#5b6678', textAlign: 'center', padding: 40 }}>
                No events yet. Browse upcoming LBC events and tap "+ Add to Mine", or create a manual event above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {myEvents.map(ev => (
                  <div key={ev.id} style={{
                    background: '#fff', borderRadius: 10, padding: '14px 16px',
                    border: '1px solid #e6e2d6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
                            background: ev.source === 'lbc' ? '#eef3fe' : '#fef3c7',
                            color: ev.source === 'lbc' ? '#1652f0' : '#92400e',
                            textTransform: 'uppercase', letterSpacing: 0.5
                          }}>
                            {ev.source === 'lbc' ? 'LBC' : 'Manual'}
                          </span>
                          <span style={{ fontSize: 10, color: '#5b6678', textTransform: 'uppercase', letterSpacing: 0.5 }}>{ev.event_type}</span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: '#042C53', marginBottom: 4 }}>{ev.event_name}</div>
                        <div style={{ fontSize: 13, color: '#1652f0', fontWeight: 500 }}>{formatDate(ev.event_date)}</div>
                        {ev.host_org && <div style={{ fontSize: 12, color: '#5b6678', marginTop: 2 }}>{ev.host_org}</div>}
                        {ev.location_name && <div style={{ fontSize: 12, color: '#5b6678' }}>{ev.location_name}</div>}
                      </div>
                      <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
                        padding: '7px 14px', borderRadius: 8, background: '#c2410c', color: '#fff',
                        fontWeight: 600, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap'
                      }}>
                        Capture →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
