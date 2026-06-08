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

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, '0')}${ampm}` : `${h12}${ampm}`;
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

// Universal category list from organizations.category in the LBC database
const CATEGORY_OPTIONS = [
  'Career/HR', 'Chambers', 'Co-Working', 'Community/Edu', 'Const/Design/Mfg',
  'Fed/State/Local', 'Financial', 'Financial Services', 'Healthcare', 'Hospitality',
  'Networking', 'Professional Svcs', 'Real Estate', 'Small Business', 'Technology', 'Other',
];

// ── Sub-components (module-level to avoid SWC parse issues with early returns) ──

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

const FilterLabel = ({ children }: { children: string }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 0.8, textTransform: 'uppercase' as const, marginBottom: 8 }}>{children}</div>
);

const SidebarSection = ({ sectionKey, label, active, children, isOpen, onToggle }: {
  sectionKey: string; label: string; active: boolean; children: React.ReactNode;
  isOpen: boolean; onToggle: (k: string) => void;
}) => (
  <div style={{ borderBottom: '1px solid #f3f4f6', marginBottom: 4 }}>
    <button onClick={() => onToggle(sectionKey)} style={{
      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#042C53' : '#374151', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c2410c', display: 'inline-block' }} />}
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{isOpen ? '▲' : '▼'}</span>
      </div>
    </button>
    {isOpen && (
      <div style={{ paddingBottom: 12 }}>{children}</div>
    )}
  </div>
);

const SidebarBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    width: '100%', height: 32, borderRadius: 7, border: '1.5px solid', cursor: 'pointer', fontSize: 12,
    textAlign: 'left' as const, padding: '0 10px', fontWeight: active ? 700 : 400, marginBottom: 4,
    borderColor: active ? '#042C53' : '#e5e7eb',
    background: active ? '#042C53' : '#f9fafb',
    color: active ? '#fff' : '#374151',
  }}>{label}</button>
);

function toggleSet(set: Set<string>, setFn: (s: Set<string>) => void, val: string) {
  const next = new Set(set);
  if (next.has(val)) next.delete(val); else next.add(val);
  setFn(next);
}

const css = {
  page: { minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 80 } as React.CSSProperties,
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
  // LBC filters — multi-select sets (empty set = "all")
  const [lbcSearch, setLbcSearch]           = useState('');
  const [lbcCosts, setLbcCosts]             = useState<Set<string>>(new Set());
  const [lbcFormats, setLbcFormats]         = useState<Set<string>>(new Set());
  const [lbcCategories, setLbcCategories]   = useState<Set<string>>(new Set());
  const [lbcTimes, setLbcTimes]             = useState<Set<string>>(new Set());
  const [lbcDateRange, setLbcDateRange]     = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState<Record<string, boolean>>({
    date: true, time: false, category: false, cost: false, format: false,
  });
  const toggleDesk = (key: string) => setDeskOpen(p => ({ ...p, [key]: !p[key] }));

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

  function timeOfDayBucket(timeStr: string | null): 'morning' | 'lunch' | 'afternoon' | 'evening' | null {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    const mins = h * 60 + (m || 0);
    if (mins < 690)  return 'morning';    // before 11:30
    if (mins < 810)  return 'lunch';      // 11:30–13:30
    if (mins < 1020) return 'afternoon';  // 13:30–17:00
    return 'evening';                     // 17:00+
  }

  const filteredLbc = lbcEvents.filter(ev => {
    const q = lbcSearch.toLowerCase();
    const matchSearch = !q
      || ev.name.toLowerCase().includes(q)
      || (ev.org_name ?? '').toLowerCase().includes(q)
      || (ev.address ?? '').toLowerCase().includes(q)
      || (ev.description ?? '').toLowerCase().includes(q);
    const matchCost = lbcCosts.size === 0 || lbcCosts.has(ev.paid ?? '');
    const matchParticipation = lbcFormats.size === 0 || lbcFormats.has(ev.participation ?? '');
    const matchCategory = lbcCategories.size === 0 || lbcCategories.has(ev.event_category ?? '');
    const matchDate = lbcDateRange === 'all' ? true
      : lbcDateRange === 'today' ? ev.start_date === todayStr
      : lbcDateRange === 'week'  ? ev.start_date >= todayStr && ev.start_date <= weekStr
      : ev.start_date >= todayStr && ev.start_date <= monthStr;
    const bucket = timeOfDayBucket(ev.start_time);
    const matchTime = lbcTimes.size === 0 || (bucket !== null && lbcTimes.has(bucket));
    return matchSearch && matchCost && matchParticipation && matchCategory && matchDate && matchTime;
  });

  const activeFilterCount = (lbcSearch ? 1 : 0) + lbcCosts.size + lbcFormats.size + lbcCategories.size + lbcTimes.size + (lbcDateRange !== 'all' ? 1 : 0);

  function clearAllFilters() {
    setLbcSearch(''); setLbcCosts(new Set()); setLbcFormats(new Set());
    setLbcCategories(new Set()); setLbcTimes(new Set()); setLbcDateRange('all');
  }

  // Desktop sidebar filter panel
  const DesktopFilterPanel = () => (
    <div style={{
      width: 220, flexShrink: 0, background: '#fff', borderRadius: 12,
      border: '1px solid #e5e7eb', padding: '14px 14px 8px',
      height: 'fit-content', position: 'sticky', top: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Filters</div>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} style={{ fontSize: 11, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            ✕ Clear all
          </button>
        )}
      </div>

      {/* Search — always visible */}
      <input
        value={lbcSearch} onChange={e => setLbcSearch(e.target.value)}
        placeholder="Search events, orgs, venues…"
        style={{ width: '100%', padding: '9px 11px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', color: '#111827', outline: 'none', marginBottom: 10 }}
      />

      <SidebarSection sectionKey="date" label="Date" active={lbcDateRange !== 'all'} isOpen={deskOpen['date']} onToggle={toggleDesk}>
        {([['all','All upcoming'],['today','Today'],['week','This week'],['month','This month']] as const).map(([v, l]) => (
          <SidebarBtn key={v} label={l} active={lbcDateRange === v} onClick={() => setLbcDateRange(v)} />
        ))}
      </SidebarSection>

      <SidebarSection sectionKey="time" label="Time of Day" active={lbcTimes.size > 0} isOpen={deskOpen['time']} onToggle={toggleDesk}>
        {(['morning','lunch','afternoon','evening'] as const).map(v => (
          <SidebarBtn key={v} label={v === 'morning' ? 'Morning (before 11:30)' : v === 'lunch' ? 'Lunch (11:30–1:30)' : v === 'afternoon' ? 'Afternoon (1:30–5pm)' : 'Evening (5pm+)'} active={lbcTimes.has(v)} onClick={() => toggleSet(lbcTimes, setLbcTimes, v)} />
        ))}
      </SidebarSection>

      <SidebarSection sectionKey="category" label="Category" active={lbcCategories.size > 0} isOpen={deskOpen['category']} onToggle={toggleDesk}>
        {CATEGORY_OPTIONS.map(v => (
          <SidebarBtn key={v} label={v} active={lbcCategories.has(v)} onClick={() => toggleSet(lbcCategories, setLbcCategories, v)} />
        ))}
      </SidebarSection>

      <SidebarSection sectionKey="cost" label="Cost" active={lbcCosts.size > 0} isOpen={deskOpen['cost']} onToggle={toggleDesk}>
        {(['Free','Paid','Unknown','Both'] as const).map(v => (
          <SidebarBtn key={v} label={v === 'Both' ? 'Free + Paid options' : v} active={lbcCosts.has(v)} onClick={() => toggleSet(lbcCosts, setLbcCosts, v)} />
        ))}
      </SidebarSection>

      <SidebarSection sectionKey="format" label="Format" active={lbcFormats.size > 0} isOpen={deskOpen['format']} onToggle={toggleDesk}>
        {(['In-Person','Virtual'] as const).map(v => (
          <SidebarBtn key={v} label={v} active={lbcFormats.has(v)} onClick={() => toggleSet(lbcFormats, setLbcFormats, v)} />
        ))}
      </SidebarSection>
    </div>
  );

  return (
    <div style={css.page}>
      {/* Header */}
      <div style={css.header}>
        <div style={css.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <a href="/networking-assistant-beta-2026" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: '#93b4d4', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              padding: '8px 12px 8px 4px', margin: '-8px 0',
            }}>‹ Back</a>
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
                          <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>{formatDate(ev.start_date)}{ev.start_time ? ` · ${formatTime(ev.start_time)}` : ''}</div>
                          {ev.org_name && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{ev.org_name}</div>}
                          {ev.address && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{ev.address}</div>}
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
            /* ── MOBILE: search + filter button + city pills + bottom sheet ── */
            <>
              {/* ── Filter Bottom Sheet ── */}
              {filterSheetOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    onClick={() => setFilterSheetOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000 }}
                  />
                  {/* Sheet */}
                  <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001,
                    background: '#fff', borderRadius: '20px 20px 0 0',
                    maxHeight: '82vh', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
                  }}>
                    {/* Handle + header */}
                    <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
                      <div style={{ width: 36, height: 4, borderRadius: 2, background: '#d1d5db', margin: '0 auto 14px' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>Filters</div>
                        {activeFilterCount > 0 && (
                          <button onClick={clearAllFilters} style={{ fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scrollable content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>

                      {/* DATE */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, letterSpacing: 0.3 }}>DATE</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {([['all','All upcoming','📅'],['today','Today','⚡'],['week','This week','📆'],['month','This month','🗓']] as const).map(([v, l, icon]) => (
                            <button key={v} onClick={() => setLbcDateRange(v)} style={{
                              height: 48, borderRadius: 12, border: '1.5px solid', cursor: 'pointer',
                              fontWeight: lbcDateRange === v ? 700 : 500, fontSize: 14,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              borderColor: lbcDateRange === v ? '#042C53' : '#e5e7eb',
                              background: lbcDateRange === v ? '#042C53' : '#f9fafb',
                              color: lbcDateRange === v ? '#fff' : '#374151',
                            }}><span>{icon}</span><span>{l}</span></button>
                          ))}
                        </div>
                      </div>

                      {/* CATEGORY — multi-select list */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4, letterSpacing: 0.3 }}>
                          CATEGORY {lbcCategories.size > 0 && <span style={{ color: '#c2410c', fontWeight: 800 }}>· {lbcCategories.size} selected</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {CATEGORY_OPTIONS.map(v => {
                            const on = lbcCategories.has(v);
                            return (
                              <button key={v} onClick={() => toggleSet(lbcCategories, setLbcCategories, v)} style={{
                                height: 46, borderRadius: 10, border: 'none', cursor: 'pointer',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0 14px', background: on ? '#f0f4ff' : 'transparent', textAlign: 'left' as const,
                              }}>
                                <span style={{ fontSize: 15, fontWeight: on ? 700 : 400, color: on ? '#042C53' : '#374151' }}>{v}</span>
                                <span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${on ? '#042C53' : '#d1d5db'}`, background: on ? '#042C53' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {on && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* TIME OF DAY — multi-select grid */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, letterSpacing: 0.3 }}>
                          TIME OF DAY {lbcTimes.size > 0 && <span style={{ color: '#c2410c', fontWeight: 800 }}>· {lbcTimes.size} selected</span>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {([['morning','Morning','🌅'],['lunch','Lunch','☀️'],['afternoon','Afternoon','🌤'],['evening','Evening','🌙']] as [string,string,string][]).map(([v, l, icon]) => {
                            const on = lbcTimes.has(v);
                            return (
                              <button key={v} onClick={() => toggleSet(lbcTimes, setLbcTimes, v)} style={{
                                height: 56, borderRadius: 12, border: '1.5px solid', cursor: 'pointer', fontSize: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                borderColor: on ? '#042C53' : '#e5e7eb',
                                background: on ? '#042C53' : '#f9fafb',
                                color: on ? '#fff' : '#374151', fontWeight: on ? 700 : 500,
                              }}><span>{icon}</span><span>{l}</span></button>
                            );
                          })}
                        </div>
                      </div>

                      {/* COST — multi-select grid */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, letterSpacing: 0.3 }}>
                          COST {lbcCosts.size > 0 && <span style={{ color: '#c2410c', fontWeight: 800 }}>· {lbcCosts.size} selected</span>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {([['Free','Free','🎁'],['Paid','Paid','💰'],['Unknown','Unknown','❓'],['Both','Free + Paid','🎟']] as [string,string,string][]).map(([v, l, icon]) => {
                            const on = lbcCosts.has(v);
                            return (
                              <button key={v} onClick={() => toggleSet(lbcCosts, setLbcCosts, v)} style={{
                                height: 56, borderRadius: 12, border: '1.5px solid', cursor: 'pointer', fontSize: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                borderColor: on ? '#042C53' : '#e5e7eb',
                                background: on ? '#042C53' : '#f9fafb',
                                color: on ? '#fff' : '#374151', fontWeight: on ? 700 : 500,
                              }}><span>{icon}</span><span>{l}</span></button>
                            );
                          })}
                        </div>
                      </div>

                      {/* FORMAT — multi-select */}
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, letterSpacing: 0.3 }}>FORMAT</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {([['In-Person','In-Person','📍'],['Virtual','Virtual','💻']] as [string,string,string][]).map(([v, l, icon]) => {
                            const on = lbcFormats.has(v);
                            return (
                              <button key={v} onClick={() => toggleSet(lbcFormats, setLbcFormats, v)} style={{
                                height: 56, borderRadius: 12, border: '1.5px solid', cursor: 'pointer', fontSize: 14,
                                display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 4,
                                borderColor: on ? '#042C53' : '#e5e7eb',
                                background: on ? '#042C53' : '#f9fafb',
                                color: on ? '#fff' : '#374151', fontWeight: on ? 700 : 500,
                              }}><span style={{ fontSize: 20 }}>{icon}</span><span>{l}</span></button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Sticky CTA */}
                    <div style={{ padding: '12px 20px 28px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
                      <button onClick={() => setFilterSheetOpen(false)} style={{
                        width: '100%', height: 52, borderRadius: 14, border: 'none', cursor: 'pointer',
                        background: '#042C53', color: '#fff', fontWeight: 800, fontSize: 16,
                      }}>
                        Show {filteredLbc.length} event{filteredLbc.length !== 1 ? 's' : ''}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── Row 1: Search + Filter button ── */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' as const }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#9ca3af', pointerEvents: 'none' }}>🔍</span>
                  <input
                    value={lbcSearch} onChange={e => setLbcSearch(e.target.value)}
                    placeholder="Search events, orgs, venues…"
                    style={{ ...css.input, paddingLeft: 38, fontSize: 14 }}
                  />
                </div>
                <button onClick={() => setFilterSheetOpen(true)} style={{
                  flexShrink: 0, height: 46, borderRadius: 12, border: '1.5px solid', cursor: 'pointer',
                  padding: '0 14px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14,
                  borderColor: activeFilterCount > 0 ? '#042C53' : '#e5e7eb',
                  background: activeFilterCount > 0 ? '#042C53' : '#fff',
                  color: activeFilterCount > 0 ? '#fff' : '#374151',
                  position: 'relative' as const,
                }}>
                  <span style={{ fontSize: 16 }}>⚙</span>
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span style={{
                      minWidth: 18, height: 18, borderRadius: 9, background: '#c2410c',
                      color: '#fff', fontSize: 11, fontWeight: 800,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                    }}>{activeFilterCount}</span>
                  )}
                </button>
              </div>

              {/* ── Row 2: City pills ── */}
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

              {/* ── Active filter chips (dismissible) ── */}
              {activeFilterCount > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 10 }}>
                  {lbcDateRange !== 'all' && (
                    <span onClick={() => setLbcDateRange('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 14, background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {lbcDateRange === 'today' ? 'Today' : lbcDateRange === 'week' ? 'This week' : 'This month'} ✕
                    </span>
                  )}
                  {Array.from(lbcCategories).map(v => (
                    <span key={v} onClick={() => toggleSet(lbcCategories, setLbcCategories, v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 14, background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {v} ✕
                    </span>
                  ))}
                  {Array.from(lbcTimes).map(v => (
                    <span key={v} onClick={() => toggleSet(lbcTimes, setLbcTimes, v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 14, background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {v.charAt(0).toUpperCase() + v.slice(1)} ✕
                    </span>
                  ))}
                  {Array.from(lbcCosts).map(v => (
                    <span key={v} onClick={() => toggleSet(lbcCosts, setLbcCosts, v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 14, background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {v === 'Both' ? 'Free + Paid' : v} ✕
                    </span>
                  )}
                  {lbcFormats.has('In-Person') && (
                    <span onClick={() => toggleSet(lbcFormats, setLbcFormats, 'In-Person')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 14, background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>In-Person ✕</span>
                  )}
                  {lbcFormats.has('Virtual') && (
                    <span onClick={() => toggleSet(lbcFormats, setLbcFormats, 'Virtual')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 14, background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Virtual ✕</span>
                  )}
                  {lbcSearch && (
                    <span onClick={() => setLbcSearch('')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 14, background: '#e0e7ff', color: '#3730a3', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      "{lbcSearch.length > 12 ? lbcSearch.slice(0, 12) + '…' : lbcSearch}" ✕
                    </span>
                  )}
                </div>
              )}

              {/* Result count */}
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
                <strong style={{ color: '#374151' }}>{filteredLbc.length}</strong> of {lbcEvents.length} events
              </div>

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
                        <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}>{formatDate(ev.start_date)}{ev.start_time ? ` · ${formatTime(ev.start_time)}` : ''}</div>
                        {ev.org_name && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{ev.org_name}</div>}
                        {ev.address && <div style={{ fontSize: 12, color: '#9ca3af' }}>{ev.address}</div>}
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

      {/* ── Mobile bottom nav ── */}
      {!isDesktop && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
          background: '#fff', borderTop: '1px solid #e5e7eb',
          display: 'flex', height: 60,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.06)',
        }}>
          {[
            { href: '/networking-assistant-beta-2026', icon: '◎', label: 'Queue' },
            { href: '/networking-assistant-beta-2026?tab=people', icon: '👤', label: 'Contacts' },
            { href: '/networking-assistant-beta-2026/events', icon: '📅', label: 'Events', active: true },
            { href: '/networking-assistant-beta-2026?tab=orgs', icon: '🏛', label: 'Orgs' },
          ].map(item => (
            <a key={item.href} href={item.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, textDecoration: 'none', color: item.active ? '#c2410c' : '#6b7280',
              fontSize: 10, fontWeight: item.active ? 700 : 500,
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
