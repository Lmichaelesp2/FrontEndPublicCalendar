'use client';

import { useEffect, useState, useRef } from 'react';
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
import { supabase } from '../../../src/lib/supabase';

const MAX_DEBRIEF_CHARS = 2000;

const EVENT_TYPES = ['chamber','mixer','conference','startup','informal','coffee','other'] as const;
const CITIES = ['San Antonio','Austin','Dallas','Houston'] as const;

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function dayBucket(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  if (dateStr < today) return 'Past';
  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  if (dateStr <= nextWeek) return 'This Week';
  return 'Later';
}

const BUCKET_ORDER = ['Today', 'Tomorrow', 'This Week', 'Later', 'Past'];

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
  const [isDesktop, setIsDesktop]   = useState(false);
  // LBC filters
  const [lbcSearch, setLbcSearch]                 = useState('');
  const [lbcCost, setLbcCost]                     = useState<'all' | 'Free' | 'Paid' | 'Unknown' | 'Both'>('all');
  const [lbcParticipation, setLbcParticipation]   = useState<'all' | 'In-Person' | 'Virtual'>('all');
  const [lbcCategory, setLbcCategory]             = useState<'all' | 'Networking' | 'Educational' | 'Other'>('all');
  const [lbcDateRange, setLbcDateRange]           = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [lbcMoreFiltersOpen, setLbcMoreFiltersOpen] = useState(false);

  const [form, setForm] = useState({
    event_name: '', event_date: '', event_type: 'other' as typeof EVENT_TYPES[number],
    host_org: '', location_name: '', city: 'San Antonio',
  });
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // Voice debrief notes
  const [debriefEventId, setDebriefEventId]   = useState<string | null>(null);
  const [debriefState, setDebriefState]       = useState<'idle' | 'listening' | 'saving'>('idle');
  const [debriefTranscript, setDebriefTranscript] = useState('');
  const [debriefNotes, setDebriefNotes]       = useState<Record<string, string>>({}); // eventId -> saved note
  const [expandedNote, setExpandedNote]       = useState<string | null>(null);
  const debriefRecognitionRef                 = useRef<any>(null);

  function startDebrief(ev: NAEvent) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { showToast('Voice not supported — try Chrome'); return; }
    setDebriefEventId(ev.id);
    setDebriefTranscript('');
    setDebriefState('listening');
    const recognition = new SpeechRecognition();
    debriefRecognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let final = '';
    recognition.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t + ' ';
        else interim = t;
      }
      const combined = (final + interim).trim().slice(0, MAX_DEBRIEF_CHARS);
      setDebriefTranscript(combined);
    };
    recognition.onerror = () => { setDebriefState('idle'); setDebriefEventId(null); };
    recognition.onend = () => { if (final.trim()) saveDebrief(ev.id, final.trim()); else { setDebriefState('idle'); setDebriefEventId(null); } };
    recognition.start();
  }

  function stopDebrief() { debriefRecognitionRef.current?.stop(); }

  async function saveDebrief(eventId: string, text: string) {
    setDebriefState('saving');
    const trimmed = text.slice(0, MAX_DEBRIEF_CHARS);
    await supabase.from('na_events').update({ user_debrief_notes: trimmed }).eq('id', eventId);
    setDebriefNotes(p => ({ ...p, [eventId]: trimmed }));
    setDebriefState('idle');
    setDebriefEventId(null);
    showToast('Event note saved');
  }

  useEffect(() => {
    setActiveEventId(localStorage.getItem('na_active_event_id'));
  }, []);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  function setActive(ev: NAEvent) {
    localStorage.setItem('na_active_event_id', ev.id);
    localStorage.setItem('na_active_event_name', ev.event_name);
    setActiveEventId(ev.id);
  }

  function clearActive() {
    localStorage.removeItem('na_active_event_id');
    localStorage.removeItem('na_active_event_name');
    setActiveEventId(null);
  }

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
        // Load existing debrief notes
        const notes: Record<string, string> = {};
        mine.data.forEach((e: NAEvent) => { if ((e as any).user_debrief_notes) notes[e.id] = (e as any).user_debrief_notes; });
        setDebriefNotes(notes);
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#6b7280' }}>
      Loading…
    </div>
  );
  if (!user) { router.push('/networking-assistant-beta-2026'); return null; }

  // ── LBC filter logic (computed before render) ──
  const todayStr  = new Date().toISOString().split('T')[0];
  const weekStr   = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const monthStr  = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const filteredLbc = lbcEvents.filter(ev => {
    const q = lbcSearch.toLowerCase();
    const matchSearch = !q
      || ev.name.toLowerCase().includes(q)
      || (ev.group_name ?? '').toLowerCase().includes(q)
      || (ev.event_address ?? '').toLowerCase().includes(q)
      || (ev.description ?? '').toLowerCase().includes(q);
    const matchCost = lbcCost === 'all' || ev.paid === lbcCost;
    const matchParticipation = lbcParticipation === 'all' || ev.participation === lbcParticipation;
    const matchCategory = lbcCategory === 'all' || ev.event_type === lbcCategory;
    const matchDate = lbcDateRange === 'all' ? true
      : lbcDateRange === 'today' ? ev.start_date === todayStr
      : lbcDateRange === 'week'  ? ev.start_date >= todayStr && ev.start_date <= weekStr
      : ev.start_date >= todayStr && ev.start_date <= monthStr;
    return matchSearch && matchCost && matchParticipation && matchCategory && matchDate;
  });

  const activeFilterCount = (lbcSearch ? 1 : 0) + (lbcCost !== 'all' ? 1 : 0) + (lbcParticipation !== 'all' ? 1 : 0) + (lbcCategory !== 'all' ? 1 : 0) + (lbcDateRange !== 'all' ? 1 : 0);

  function clearAllFilters() {
    setLbcSearch(''); setLbcCost('all'); setLbcParticipation('all');
    setLbcCategory('all'); setLbcDateRange('all');
  }

  // Filter pill component
  const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      flexShrink: 0, height: 32, padding: '0 14px', borderRadius: 16, border: '1.5px solid',
      cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 400,
      borderColor: active ? '#042C53' : '#d1d5db',
      background: active ? '#042C53' : '#fff',
      color: active ? '#fff' : '#374151',
      whiteSpace: 'nowrap' as const,
      transition: 'all 0.15s',
    }}>{label}</button>
  );

  // Filter section label
  const FilterLabel = ({ children }: { children: string }) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 0.8, textTransform: 'uppercase' as const, marginBottom: 8 }}>{children}</div>
  );

  // Desktop sidebar filter panel
  const DesktopFilterPanel = () => (
    <div style={{
      width: 220, flexShrink: 0, background: '#fff', borderRadius: 12,
      border: '1px solid #e5e7eb', padding: '18px 16px',
      height: 'fit-content', position: 'sticky', top: 16,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Filters</div>

      {/* Search */}
      <div style={{ marginBottom: 18 }}>
        <FilterLabel>Search</FilterLabel>
        <input
          value={lbcSearch} onChange={e => setLbcSearch(e.target.value)}
          placeholder="Search events, organizations, venues…"
          style={{ width: '100%', padding: '9px 11px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', color: '#111827', outline: 'none' }}
        />
      </div>

      {/* Date */}
      <div style={{ marginBottom: 18 }}>
        <FilterLabel>Date</FilterLabel>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {([['all','All upcoming'],['today','Today'],['week','This week'],['month','This month']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setLbcDateRange(v)} style={{
              height: 34, borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13,
              textAlign: 'left' as const, padding: '0 12px', fontWeight: lbcDateRange === v ? 700 : 400,
              borderColor: lbcDateRange === v ? '#042C53' : '#e5e7eb',
              background: lbcDateRange === v ? '#042C53' : '#f9fafb',
              color: lbcDateRange === v ? '#fff' : '#374151',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Event Type */}
      <div style={{ marginBottom: 18 }}>
        <FilterLabel>Event Type</FilterLabel>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {([['all','All types'],['Networking','Networking'],['Educational','Educational'],['Other','Other']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setLbcCategory(v)} style={{
              height: 34, borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13,
              textAlign: 'left' as const, padding: '0 12px', fontWeight: lbcCategory === v ? 700 : 400,
              borderColor: lbcCategory === v ? '#042C53' : '#e5e7eb',
              background: lbcCategory === v ? '#042C53' : '#f9fafb',
              color: lbcCategory === v ? '#fff' : '#374151',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Cost */}
      <div style={{ marginBottom: 18 }}>
        <FilterLabel>Cost</FilterLabel>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {([['all','All'],['Free','Free'],['Paid','Paid'],['Unknown','Unknown'],['Both','Free + Paid options']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setLbcCost(v)} style={{
              height: 34, borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13,
              textAlign: 'left' as const, padding: '0 12px', fontWeight: lbcCost === v ? 700 : 400,
              borderColor: lbcCost === v ? '#042C53' : '#e5e7eb',
              background: lbcCost === v ? '#042C53' : '#f9fafb',
              color: lbcCost === v ? '#fff' : '#374151',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Participation */}
      <div style={{ marginBottom: 18 }}>
        <FilterLabel>Format</FilterLabel>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {([['all','All'],['In-Person','In-Person'],['Virtual','Virtual']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setLbcParticipation(v)} style={{
              height: 34, borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13,
              textAlign: 'left' as const, padding: '0 12px', fontWeight: lbcParticipation === v ? 700 : 400,
              borderColor: lbcParticipation === v ? '#042C53' : '#e5e7eb',
              background: lbcParticipation === v ? '#042C53' : '#f9fafb',
              color: lbcParticipation === v ? '#fff' : '#374151',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearAllFilters} style={{
          width: '100%', height: 34, borderRadius: 8, border: '1.5px solid #fca5a5',
          background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 600,
          cursor: 'pointer',
        }}>✕ Clear all filters</button>
      )}
    </div>
  );

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

      {/* Active event banner */}
      {activeEventId && (
        <div style={{ background: '#c2410c', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Active Event</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{localStorage.getItem('na_active_event_name')}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/networking-assistant-beta-2026/capture" style={{
              height: 32, borderRadius: 8, background: '#fff', color: '#c2410c',
              fontWeight: 700, fontSize: 12, padding: '0 12px', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>🎤 Capture</a>
            <button onClick={clearActive} style={{
              height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.2)', border: 'none',
              color: '#fff', fontWeight: 600, fontSize: 12, padding: '0 12px', cursor: 'pointer',
            }}>End Session</button>
          </div>
        </div>
      )}

      {/* ── Main content wrapper — desktop = full-width, inner splits into sidebar + list ── */}
      <div style={{ maxWidth: isDesktop ? 1100 : 720, margin: '0 auto', padding: '16px 16px 0' }}>

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
          isDesktop ? (
            /* ── DESKTOP: sidebar filters + event list ── */
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              {/* Left: city pills + filter sidebar */}
              <div style={{ width: 220, flexShrink: 0 }}>
                {/* City picker */}
                <div style={{ marginBottom: 12 }}>
                  <FilterLabel>City</FilterLabel>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                    {CITIES.map(city => (
                      <button key={city} onClick={() => setCityFilter(city)} style={{
                        height: 34, borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13,
                        textAlign: 'left' as const, padding: '0 12px',
                        fontWeight: cityFilter === city ? 700 : 400,
                        borderColor: cityFilter === city ? '#042C53' : '#e5e7eb',
                        background: cityFilter === city ? '#042C53' : '#f9fafb',
                        color: cityFilter === city ? '#fff' : '#374151',
                      }}>{city}</button>
                    ))}
                  </div>
                </div>
                <DesktopFilterPanel />
              </div>

              {/* Right: result count + event cards */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    <strong style={{ color: '#111827' }}>{filteredLbc.length}</strong> of {lbcEvents.length} events
                    {activeFilterCount > 0 && (
                      <button onClick={clearAllFilters} style={{ marginLeft: 10, fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        ✕ Clear filters
                      </button>
                    )}
                  </div>
                </div>
                {loadingData ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0', fontSize: 14 }}>Loading…</div>
                ) : filteredLbc.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px 0', fontSize: 14 }}>
                    {lbcEvents.length === 0 ? `No upcoming events for ${cityFilter}.` : 'No events match your filters.'}
                    {activeFilterCount > 0 && <div style={{ marginTop: 8 }}><button onClick={clearAllFilters} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Clear all filters</button></div>}
                  </div>
                ) : filteredLbc.map(ev => {
                  const flagged = flaggedIds.has(ev.id);
                  const costColor = ev.paid === 'Free' ? { bg: '#f0fdf4', text: '#15803d' } : ev.paid === 'Paid' ? { bg: '#fef3c7', text: '#92400e' } : { bg: '#f3f4f6', text: '#6b7280' };
                  return (
                    <div key={ev.id} style={css.card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{ev.name}</div>
                          <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>{formatDate(ev.start_date)}{ev.start_time ? ` · ${ev.start_time}` : ''}</div>
                          {ev.group_name && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{ev.group_name}</div>}
                          {ev.event_address && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{ev.event_address}</div>}
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginTop: 7 }}>
                            {ev.paid && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: costColor.bg, color: costColor.text, textTransform: 'uppercase' as const }}>{ev.paid}</span>}
                            {ev.participation && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: '#f0f4ff', color: '#3b5bdb' }}>{ev.participation}</span>}
                            {ev.event_type && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: '#f9fafb', color: '#6b7280' }}>{ev.event_type}</span>}
                          </div>
                        </div>
                        <button onClick={() => handleFlag(ev)} disabled={flagged} style={{
                          height: 34, borderRadius: 8, border: 'none', cursor: flagged ? 'default' : 'pointer',
                          fontSize: 12, fontWeight: 700, padding: '0 14px', flexShrink: 0,
                          background: flagged ? '#f3f4f6' : '#042C53',
                          color: flagged ? '#9ca3af' : '#fff',
                        }}>{flagged ? '✓ Added' : '+ Add'}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── MOBILE: horizontal scrolling pills + expandable more-filters ── */
            <>
              {/* City pills — scrollable row */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' as const, marginBottom: 10, paddingBottom: 2 }}>
                {CITIES.map(city => (
                  <button key={city} onClick={() => setCityFilter(city)} style={{
                    flexShrink: 0, height: 34, borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 13, padding: '0 16px',
                    borderColor: cityFilter === city ? '#042C53' : '#e5e7eb',
                    background: cityFilter === city ? '#042C53' : '#fff',
                    color: cityFilter === city ? '#fff' : '#374151',
                    fontWeight: cityFilter === city ? 700 : 400,
                  }}>{city}</button>
                ))}
              </div>

              {/* Search */}
              <input
                value={lbcSearch} onChange={e => setLbcSearch(e.target.value)}
                placeholder="Search events, organizations, venues…"
                style={{ ...css.input, marginBottom: 10, fontSize: 14 }}
              />

              {/* Quick filter pills row */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' as const, marginBottom: 8, paddingBottom: 2 }}>
                <FilterPill label="All dates" active={lbcDateRange === 'all'} onClick={() => setLbcDateRange('all')} />
                <FilterPill label="Today" active={lbcDateRange === 'today'} onClick={() => setLbcDateRange('today')} />
                <FilterPill label="This week" active={lbcDateRange === 'week'} onClick={() => setLbcDateRange('week')} />
                <FilterPill label="This month" active={lbcDateRange === 'month'} onClick={() => setLbcDateRange('month')} />
                <div style={{ width: 1, height: 32, background: '#e5e7eb', flexShrink: 0, alignSelf: 'center' }} />
                <FilterPill label="Networking" active={lbcCategory === 'Networking'} onClick={() => setLbcCategory(lbcCategory === 'Networking' ? 'all' : 'Networking')} />
                <FilterPill label="Educational" active={lbcCategory === 'Educational'} onClick={() => setLbcCategory(lbcCategory === 'Educational' ? 'all' : 'Educational')} />
              </div>

              {/* More filters + result count row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <button onClick={() => setLbcMoreFiltersOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: 5, height: 30, padding: '0 12px',
                  borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  borderColor: (lbcCost !== 'all' || lbcParticipation !== 'all') ? '#2563eb' : '#e5e7eb',
                  background: (lbcCost !== 'all' || lbcParticipation !== 'all') ? '#eff6ff' : '#fff',
                  color: (lbcCost !== 'all' || lbcParticipation !== 'all') ? '#2563eb' : '#6b7280',
                }}>
                  <span>More filters</span>
                  {(lbcCost !== 'all' || lbcParticipation !== 'all') && <span style={{ background: '#2563eb', color: '#fff', borderRadius: 10, padding: '0 5px', fontSize: 10, fontWeight: 700 }}>!</span>}
                  <span style={{ fontSize: 10 }}>{lbcMoreFiltersOpen ? '▲' : '▼'}</span>
                </button>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{filteredLbc.length} of {lbcEvents.length}</span>
              </div>

              {/* Expandable: cost + participation */}
              {lbcMoreFiltersOpen && (
                <div style={{ background: '#f8f9fb', border: '1px solid #e8eaed', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <FilterLabel>Cost</FilterLabel>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                      {(['all','Free','Paid','Unknown','Both'] as const).map(v => (
                        <FilterPill key={v} label={v === 'all' ? 'All' : v === 'Both' ? 'Free + Paid' : v} active={lbcCost === v} onClick={() => setLbcCost(v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <FilterLabel>Format</FilterLabel>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <FilterPill label="All" active={lbcParticipation === 'all'} onClick={() => setLbcParticipation('all')} />
                      <FilterPill label="In-Person" active={lbcParticipation === 'In-Person'} onClick={() => setLbcParticipation('In-Person')} />
                      <FilterPill label="Virtual" active={lbcParticipation === 'Virtual'} onClick={() => setLbcParticipation('Virtual')} />
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearAllFilters} style={{ marginTop: 12, fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                      ✕ Clear all filters
                    </button>
                  )}
                </div>
              )}

              {loadingData ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0', fontSize: 14 }}>Loading…</div>
              ) : filteredLbc.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0', fontSize: 14 }}>
                  {lbcEvents.length === 0 ? `No upcoming events for ${cityFilter}.` : 'No events match your filters.'}
                </div>
              ) : filteredLbc.map(ev => {
                const flagged = flaggedIds.has(ev.id);
                const costColor = ev.paid === 'Free' ? { bg: '#f0fdf4', text: '#15803d' } : ev.paid === 'Paid' ? { bg: '#fef3c7', text: '#92400e' } : { bg: '#f3f4f6', text: '#6b7280' };
                return (
                  <div key={ev.id} style={css.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{ev.name}</div>
                        <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}>{formatDate(ev.start_date)}{ev.start_time ? ` · ${ev.start_time}` : ''}</div>
                        {ev.group_name && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{ev.group_name}</div>}
                        {ev.event_address && <div style={{ fontSize: 12, color: '#9ca3af' }}>{ev.event_address}</div>}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginTop: 6 }}>
                          {ev.paid && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: costColor.bg, color: costColor.text, textTransform: 'uppercase' as const }}>{ev.paid}</span>}
                          {ev.participation && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: '#f0f4ff', color: '#3b5bdb' }}>{ev.participation}</span>}
                          {ev.event_type && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: '#f9fafb', color: '#6b7280' }}>{ev.event_type}</span>}
                        </div>
                      </div>
                      <button onClick={() => handleFlag(ev)} disabled={flagged} style={{
                        height: 34, borderRadius: 8, border: 'none', cursor: flagged ? 'default' : 'pointer',
                        fontSize: 12, fontWeight: 700, padding: '0 12px', flexShrink: 0, whiteSpace: 'nowrap' as const,
                        background: flagged ? '#f3f4f6' : '#042C53',
                        color: flagged ? '#9ca3af' : '#fff',
                      }}>{flagged ? '✓ Added' : '+ Add'}</button>
                    </div>
                  </div>
                );
              })}
            </>
          )
        ) : (
          myEvents.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0', fontSize: 14 }}>
              No events yet. Browse upcoming LBC events or add one above.
            </div>
          ) : (() => {
            const grouped: Record<string, NAEvent[]> = {};
            myEvents.forEach(ev => {
              const bucket = dayBucket(ev.event_date);
              if (!grouped[bucket]) grouped[bucket] = [];
              grouped[bucket].push(ev);
            });
            return BUCKET_ORDER.filter(b => grouped[b]?.length).map(bucket => (
              <div key={bucket}>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: bucket === 'Today' ? '#c2410c' : '#6b7280',
                  letterSpacing: 1, textTransform: 'uppercase' as const,
                  marginTop: 16, marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {bucket === 'Today' && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#c2410c' }} />}
                  {bucket}
                </div>
                {grouped[bucket].map(ev => (
                  <div key={ev.id} style={css.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Event title row with 🎙 icon on the left */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <button
                            onClick={() => debriefEventId === ev.id && debriefState === 'listening' ? stopDebrief() : startDebrief(ev)}
                            disabled={debriefState === 'saving' || (debriefEventId !== null && debriefEventId !== ev.id)}
                            title="Voice note"
                            style={{
                              width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
                              background: debriefEventId === ev.id && debriefState === 'listening' ? '#dc2626' : debriefNotes[ev.id] ? '#f0fdf4' : '#f3f4f6',
                              color: debriefEventId === ev.id && debriefState === 'listening' ? '#fff' : debriefNotes[ev.id] ? '#15803d' : '#9ca3af',
                              fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            {debriefEventId === ev.id && debriefState === 'saving' ? '…' : '🎙'}
                          </button>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{ev.event_name}</div>
                        </div>
                        <div style={{ fontSize: 13, color: bucket === 'Today' ? '#c2410c' : '#2563eb', fontWeight: 600, paddingLeft: 36 }}>{formatDate(ev.event_date)}</div>
                        {ev.host_org && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1, paddingLeft: 36 }}>{ev.host_org}</div>}
                        <div style={{ marginTop: 4, paddingLeft: 36 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: ev.source === 'lbc' ? '#eff6ff' : '#fef3c7', color: ev.source === 'lbc' ? '#1d4ed8' : '#92400e', textTransform: 'uppercase' as const }}>
                            {ev.source === 'lbc' ? 'LBC' : 'Manual'}
                          </span>
                        </div>

                        {/* Live transcript while recording */}
                        {debriefEventId === ev.id && debriefState === 'listening' && (
                          <div style={{ marginTop: 8, paddingLeft: 36 }}>
                            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '8px 10px' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', marginBottom: 4 }}>🔴 Recording… tap 🎙 to stop</div>
                              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{debriefTranscript || 'Speak now…'}</div>
                              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>{debriefTranscript.length} / {MAX_DEBRIEF_CHARS} chars</div>
                            </div>
                          </div>
                        )}

                        {/* Saved note — tap to expand */}
                        {debriefNotes[ev.id] && debriefEventId !== ev.id && (
                          <div style={{ marginTop: 8, paddingLeft: 36 }}>
                            <button onClick={() => setExpandedNote(expandedNote === ev.id ? null : ev.id)} style={{
                              background: 'none', border: 'none', color: '#15803d', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0,
                            }}>
                              {expandedNote === ev.id ? '▲ Hide note' : '▼ View note'}
                            </button>
                            {expandedNote === ev.id && (
                              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 10px', marginTop: 6, fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                                {debriefNotes[ev.id]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        {activeEventId === ev.id ? (
                          <>
                            <a href="/networking-assistant-beta-2026/capture" style={{
                              height: 36, borderRadius: 8, background: '#c2410c', color: '#fff',
                              fontWeight: 700, fontSize: 12, padding: '0 14px', textDecoration: 'none',
                              display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                            }}>🎤 Capture</a>
                            <button onClick={clearActive} style={{
                              height: 26, borderRadius: 6, background: 'none', border: '1px solid #e5e7eb',
                              color: '#9ca3af', fontSize: 11, padding: '0 10px', cursor: 'pointer',
                            }}>End Session</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setActive(ev)} style={{
                              height: 36, borderRadius: 8, background: '#042C53', color: '#fff',
                              fontWeight: 700, fontSize: 12, padding: '0 12px', border: 'none', cursor: 'pointer', flexShrink: 0,
                            }}>I'm going →</button>
                            <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
                              height: 26, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff',
                              color: '#374151', fontWeight: 500, fontSize: 11, padding: '0 10px', textDecoration: 'none',
                              display: 'inline-flex', alignItems: 'center',
                            }}>Capture →</a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ));
          })()
        )}
      </div>
    </div>
  );
}
