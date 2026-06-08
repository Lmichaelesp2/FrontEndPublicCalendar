'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  fetchFollowUpQueue, fetchPersons, fetchMyNAEvents,
  fetchMemberships, fetchLBCOrgs, addMembership, removeMembership, fetchPersonsByMembership,
  updateFollowUp, daysAgo, deletePerson,
  type NAMembership, type LBCOrg,
} from '../../src/lib/networking-assistant';
import { NAAssistant } from '../../src/components/NAAssistant';

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
  prospect: '#2563eb', referral: '#16a34a', connector: '#7c3aed', archived: '#9ca3af',
  // legacy
  hot: '#dc2626', warm: '#2563eb', cold: '#6b7280',
};
const REL_LABEL: Record<string, string> = {
  prospect: 'Prospect', referral: 'Referral', connector: 'Connector', archived: 'Archived',
  // legacy — display old values gracefully
  hot: 'Hot', warm: 'Warm', cold: 'Cold',
};
const BUCKET_DOT: Record<string, string> = {
  overdue: '#ef4444', today: '#2563eb', upcoming: '#d1d5db',
};
const ACTIVE_CITIES = ['San Antonio', 'Austin', 'Dallas', 'Houston'] as const;

export default function NAHomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const helpTriggerRef = useRef<(() => void) | null>(null);

  const [followUps, setFollowUps]         = useState<any[]>([]);
  const [persons, setPersons]             = useState<any[]>([]);
  const [events, setEvents]               = useState<any[]>([]);
  const [memberships, setMemberships]     = useState<NAMembership[]>([]);
  const [pageLoading, setPageLoading]     = useState(true);
  const [mobileTab, setMobileTab]         = useState<'queue' | 'people' | 'events' | 'orgs'>('queue');
  const [isDesktop, setIsDesktop]         = useState(false);
  const [desktopView, setDesktopView]     = useState<'queue' | 'allcontacts' | 'companies' | 'events' | 'orgs'>('queue');
  const [activeEventName, setActiveEventName] = useState<string | null>(null);

  // Org picker state
  const [showOrgPicker, setShowOrgPicker]   = useState(false);
  const [lbcOrgs, setLbcOrgs]               = useState<LBCOrg[]>([]);
  const [orgSearch, setOrgSearch]           = useState('');
  const [orgCityFilter, setOrgCityFilter]   = useState('all');
  const [loadingOrgs, setLoadingOrgs]       = useState(false);
  const [showManualOrg, setShowManualOrg]   = useState(false);
  const [manualOrgName, setManualOrgName]   = useState('');
  const [manualOrgCity, setManualOrgCity]   = useState('San Antonio');
  const [manualOrgType, setManualOrgType]   = useState('');
  const [savingOrg, setSavingOrg]           = useState(false);

  // Org drill-down state
  const [expandedOrgId, setExpandedOrgId]   = useState<string | null>(null);
  const [orgContacts, setOrgContacts]       = useState<Record<string, any[]>>({});
  const [loadingOrgContacts, setLoadingOrgContacts] = useState<string | null>(null);

  // Search & filter state
  const [contactSearch, setContactSearch]   = useState('');
  const [relFilter, setRelFilter]           = useState<string>('all');
  const [eventFilter, setEventFilter]       = useState<string>('all');
  const [queueSearch, setQueueSearch]       = useState('');
  const [contactsView, setContactsView]     = useState<'people' | 'companies'>('people');
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  // Event filters
  const [evSearch, setEvSearch]             = useState('');
  const [evTypeFilter, setEvTypeFilter]     = useState<string>('all');
  const [evDateFilter, setEvDateFilter]     = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [evFiltersOpen, setEvFiltersOpen]   = useState(false);
  // Onboarding
  const [welcomeStep, setWelcomeStep]       = useState<0 | 1 | 2 | null>(null);
  const [welcomeCity, setWelcomeCity]       = useState('');

  useEffect(() => {
    setActiveEventName(localStorage.getItem('na_active_event_name'));
    // Show welcome flow for first-time users
    if (!localStorage.getItem('na_onboarded')) {
      setWelcomeStep(0);
    }
  }, []);

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
      const [fq, pp, ev, mb] = await Promise.all([
        fetchFollowUpQueue(user.id),
        fetchPersons(user.id),
        fetchMyNAEvents(user.id),
        fetchMemberships(user.id),
      ]);
      if (fq.data) setFollowUps(fq.data);
      if (pp.data) setPersons(pp.data);
      if (mb.data) setMemberships(mb.data);
      if (ev.data) {
        setEvents(ev.data);
        const today = new Date().toISOString().split('T')[0];
        const hasTodayEvents = ev.data.some((e: any) => e.event_date === today);
        if (hasTodayEvents) {
          setDesktopView('events');
          setMobileTab('events');
        }
      }
      setPageLoading(false);
    })();
  }, [user]);

  async function openOrgPicker() {
    setShowOrgPicker(true);
    if (lbcOrgs.length === 0) {
      setLoadingOrgs(true);
      const { data } = await fetchLBCOrgs();
      if (data) setLbcOrgs(data);
      setLoadingOrgs(false);
    }
  }

  async function handleAddLBCOrg(org: LBCOrg) {
    if (!user) return;
    setSavingOrg(true);
    const { data } = await addMembership({
      user_id: user.id,
      org_id: org.id,
      org_name: org.name,
      org_city: org.city,
      org_type: org.group_type,
      joined_at: null,
      is_active: true,
      notes: null,
    });
    if (data) setMemberships(p => [data, ...p]);
    setSavingOrg(false);
    setShowOrgPicker(false);
    setOrgSearch('');
  }

  async function handleAddManualOrg() {
    if (!user || !manualOrgName.trim()) return;
    setSavingOrg(true);
    const { data } = await addMembership({
      user_id: user.id,
      org_id: null,
      org_name: manualOrgName.trim(),
      org_city: manualOrgCity,
      org_type: manualOrgType.trim() || null,
      joined_at: null,
      is_active: true,
      notes: null,
    });
    if (data) {
      setMemberships(p => [data, ...p]);
      // Notify LBC team so they can add this org to the database
      fetch('/api/na-org-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: manualOrgName.trim(),
          org_city: manualOrgCity,
          org_type: manualOrgType.trim() || null,
          submitted_by: profile?.email ?? user.email ?? user.id,
        }),
      }).catch(() => {}); // fire and forget — don't block the UI
    }
    setSavingOrg(false);
    setShowOrgPicker(false);
    setShowManualOrg(false);
    setManualOrgName(''); setManualOrgCity('San Antonio'); setManualOrgType('');
  }

  async function handleRemoveMembership(id: string) {
    if (!confirm('Remove this organization from your memberships?')) return;
    await removeMembership(id);
    setMemberships(p => p.filter(m => m.id !== id));
    if (expandedOrgId === id) setExpandedOrgId(null);
  }

  async function toggleOrgDrilldown(membershipId: string) {
    if (expandedOrgId === membershipId) {
      setExpandedOrgId(null);
      return;
    }
    setExpandedOrgId(membershipId);
    if (!orgContacts[membershipId]) {
      setLoadingOrgContacts(membershipId);
      const { data } = await fetchPersonsByMembership(membershipId);
      setOrgContacts(prev => ({ ...prev, [membershipId]: data ?? [] }));
      setLoadingOrgContacts(null);
    }
  }

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

  const filteredPersons = persons.filter(p => {
    const q = contactSearch.toLowerCase();
    const matchesSearch = !q ||
      `${p.first_name} ${p.last_name} ${p.company ?? ''} ${p.title ?? ''}`.toLowerCase().includes(q);
    const matchesRel = relFilter === 'all' || p.relationship_status === relFilter;
    const matchesEvent = eventFilter === 'all' || p.first_met_event_id === eventFilter;
    return matchesSearch && matchesRel && matchesEvent;
  });

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

  function normalizeCompany(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  const companyGroups: { displayName: string; key: string; contacts: any[] }[] = (() => {
    const map = new Map<string, { displayName: string; contacts: any[] }>();
    for (const p of persons) {
      const raw = (p.company ?? '').trim();
      if (!raw) continue;
      const key = normalizeCompany(raw);
      if (!map.has(key)) map.set(key, { displayName: raw, contacts: [] });
      map.get(key)!.contacts.push(p);
    }
    return Array.from(map.entries())
      .map(([key, val]) => ({ key, displayName: val.displayName, contacts: val.contacts }))
      .sort((a, b) => b.contacts.length - a.contacts.length || a.displayName.localeCompare(b.displayName));
  })();
  const companySearch = contactSearch.toLowerCase();
  const filteredCompanyGroups = companySearch
    ? companyGroups.filter(g => g.displayName.toLowerCase().includes(companySearch))
    : companyGroups;

  const myEventOptions = Array.from(
    new Map(persons.filter(p => p.first_met_event_id).map(p => [p.first_met_event_id, p])).values()
  ).map(p => ({ id: p.first_met_event_id, name: events.find((e: any) => e.id === p.first_met_event_id)?.event_name ?? null }))
  .filter(ev => ev.name !== null);

  // ── Follow-up row
  const FURow = ({ fu }: { fu: any }) => {
    const bucket = dueBucket(fu.due_date);
    const name = [fu.na_persons?.first_name, fu.na_persons?.last_name].filter(Boolean).join(' ') || 'Unknown';
    return (
      <div style={{
        background: '#fff', borderRadius: 8, padding: '14px 16px', marginBottom: 6,
        border: '1px solid #e8eaed', display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
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

  // ── Welcome / Onboarding Modal ──
  const WelcomeModal = () => {
    if (welcomeStep === null) return null;
    const finish = (city?: string) => {
      if (city) localStorage.setItem('na_home_city', city);
      localStorage.setItem('na_onboarded', '1');
      setWelcomeStep(null);
    };
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, padding: '28px 24px 44px', display: 'flex', flexDirection: 'column' }}>

          {/* Step 0 — What is this? */}
          {welcomeStep === 0 && (<>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 16 }}>🤝</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#042C53', textAlign: 'center', marginBottom: 10 }}>Welcome to your Networking Assistant</div>
            <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 20, textAlign: 'center' }}>
              Go to an event. Capture the people you meet. Come back the next day and complete your follow-ups. That's the whole app.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: '📅', text: 'Save events you\'re attending' },
                { icon: '🎤', text: 'Capture contacts by voice, photo, or typing' },
                { icon: '✅', text: 'Your follow-up queue tells you what to do next' },
                { icon: '🏛', text: 'Track the organizations you belong to' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f8f9fb', borderRadius: 10 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setWelcomeStep(1)} style={{
              width: '100%', height: 50, borderRadius: 12, border: 'none',
              background: '#042C53', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
            }}>Got it — let's set up →</button>
            <button onClick={() => finish()} style={{ marginTop: 10, background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Skip setup</button>
          </>)}

          {/* Step 1 — City */}
          {welcomeStep === 1 && (<>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 16 }}>📍</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#042C53', textAlign: 'center', marginBottom: 8 }}>Where do you network?</div>
            <div style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>We'll show you local events from the LBC calendar.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['San Antonio', 'Austin', 'Dallas', 'Houston'].map(city => (
                <button key={city} onClick={() => setWelcomeCity(city)} style={{
                  height: 50, borderRadius: 12, border: '2px solid',
                  borderColor: welcomeCity === city ? '#042C53' : '#e5e7eb',
                  background: welcomeCity === city ? '#eff6ff' : '#fff',
                  color: welcomeCity === city ? '#042C53' : '#374151',
                  fontWeight: welcomeCity === city ? 700 : 500, fontSize: 15, cursor: 'pointer',
                }}>{city}</button>
              ))}
            </div>
            <button onClick={() => setWelcomeStep(2)} disabled={!welcomeCity} style={{
              width: '100%', height: 50, borderRadius: 12, border: 'none',
              background: welcomeCity ? '#042C53' : '#e5e7eb',
              color: welcomeCity ? '#fff' : '#9ca3af',
              fontWeight: 700, fontSize: 16, cursor: welcomeCity ? 'pointer' : 'default',
            }}>Continue →</button>
            <button onClick={() => finish()} style={{ marginTop: 10, background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Skip for now</button>
          </>)}

          {/* Step 2 — Ready */}
          {welcomeStep === 2 && (<>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 16 }}>🚀</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#042C53', textAlign: 'center', marginBottom: 10 }}>You're all set!</div>
            <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, textAlign: 'center', marginBottom: 28 }}>
              Tap <strong>?</strong> in the top right any time you need a reminder of how things work. You won't see this setup screen again.
            </div>
            <a href="/networking-assistant-beta-2026/capture" onClick={() => finish(welcomeCity)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12,
              background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', marginBottom: 10,
            }}>🎤 Capture your first contact →</a>
            <a href="/networking-assistant-beta-2026/events" onClick={() => finish(welcomeCity)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 12,
              background: '#042C53', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 10,
            }}>📅 Browse upcoming events first</a>
            <button onClick={() => finish(welcomeCity)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Take me to the dashboard</button>
          </>)}

        </div>
      </div>
    );
  };

  const QueueContent = ({ showSearch = false }: { showSearch?: boolean }) => {
    const hour = new Date().getHours();
    const day  = new Date().getDay(); // 0=Sun, 6=Sat
    const isEventTime = (hour >= 17 && hour <= 22) || (day === 0 || day === 6);
    return (
    <div>
      {showSearch && (
        <input
          value={queueSearch}
          onChange={e => setQueueSearch(e.target.value)}
          placeholder="Search follow-ups by name or company…"
          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e8eaed', fontSize: 13, marginBottom: 16, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
        />
      )}
      {followUps.length === 0 && persons.length === 0 ? (
        /* New user empty state */
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Welcome to your Networking Assistant</div>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8, lineHeight: 1.6 }}>
            Capture the people you meet at events and in organizations. Your follow-up queue will appear here.
          </div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>
            Use 🎤 Voice for the fastest capture — just say their name and what you talked about.
          </div>
          <a href="/networking-assistant-beta-2026/capture" style={{
            display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 28px',
            borderRadius: 10, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', gap: 8,
          }}>🎤 Capture Your First Contact →</a>
        </div>
      ) : followUps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>All caught up!</div>
          {isEventTime ? (
            <>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6, lineHeight: 1.6 }}>
                Looks like it could be event time. Heading out tonight?
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>Capture contacts as you meet them — your follow-ups will queue up automatically.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280, margin: '0 auto' }}>
                <a href="/networking-assistant-beta-2026/capture" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44,
                  borderRadius: 9, background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                }}>🎤 Capture a Contact</a>
                <a href="/networking-assistant-beta-2026/events" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38,
                  borderRadius: 9, background: '#042C53', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none',
                }}>📅 Browse Events</a>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
                No follow-ups pending. Check back after your next event.
              </div>
              <a href="/networking-assistant-beta-2026/capture" style={{
                display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 20px',
                borderRadius: 7, background: '#042C53', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none',
              }}>+ Capture a Contact</a>
            </>
          )}
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
  };

  // ── Contact row with avatar + delete
  const ContactRow = ({ p }: { p: any }) => {
    async function handleDelete(e: React.MouseEvent) {
      e.preventDefault();
      if (!confirm(`Delete ${p.first_name} ${p.last_name ?? ''}? This also removes their follow-ups and interactions.`)) return;
      await deletePerson(p.id);
      setPersons(prev => prev.filter((c: any) => c.id !== p.id));
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
        <a href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
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
            {REL_LABEL[p.relationship_status] ?? p.relationship_status}
          </span>
        </a>
        <button onClick={handleDelete} title="Delete contact" style={{
          background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer',
          fontSize: 14, padding: '4px 6px', borderRadius: 4, flexShrink: 0, lineHeight: 1,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
        >✕</button>
      </div>
    );
  };

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

  const ContactsToggle = () => (
    <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 3, gap: 2, marginBottom: 14 }}>
      {(['people', 'companies'] as const).map(v => (
        <button key={v} onClick={() => { setContactsView(v); setContactSearch(''); }} style={{
          height: 28, padding: '0 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: contactsView === v ? 700 : 400,
          background: contactsView === v ? '#fff' : 'transparent',
          color: contactsView === v ? '#042C53' : '#6b7280',
          boxShadow: contactsView === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.12s', fontFamily: 'Inter, sans-serif',
        }}>
          {v === 'people' ? '👤 People' : '🏢 Companies'}
        </button>
      ))}
    </div>
  );

  const CompaniesView = ({ hideSearch = false }: { hideSearch?: boolean }) => (
    <div>
      {!hideSearch && (
        <input
          value={contactSearch}
          onChange={e => setContactSearch(e.target.value)}
          placeholder="Search companies…"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
        />
      )}
      {companyGroups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 13, color: '#6b7280' }}>
          No companies yet — add a company when capturing contacts.
        </div>
      ) : filteredCompanyGroups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: '#9ca3af' }}>No companies match "{contactSearch}"</div>
      ) : (
        <div>
          {filteredCompanyGroups.map(g => {
            const isOpen = expandedCompany === g.key;
            return (
              <div key={g.key} style={{ marginBottom: 6 }}>
                <button
                  onClick={() => setExpandedCompany(isOpen ? null : g.key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', background: '#fff', border: '1px solid #e8eaed',
                    borderRadius: isOpen ? '8px 8px 0 0' : 8, cursor: 'pointer', textAlign: 'left' as const,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 7, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🏢</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{g.displayName}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{g.contacts.length} contact{g.contacts.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div style={{ background: '#fafafa', border: '1px solid #e8eaed', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '4px 0' }}>
                    {g.contacts.map((p: any) => (
                      <a key={p.id} href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                        textDecoration: 'none', borderBottom: '1px solid #f3f4f6',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ff')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1d4ed8', flexShrink: 0 }}>
                          {initials(p.first_name, p.last_name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{[p.first_name, p.last_name].filter(Boolean).join(' ')}</div>
                          {p.title && <div style={{ fontSize: 11, color: '#6b7280' }}>{p.title}</div>}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: REL_COLOR[p.relationship_status] ?? '#6b7280', textTransform: 'uppercase' as const, flexShrink: 0 }}>
                          {REL_LABEL[p.relationship_status] ?? p.relationship_status}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const EventsList = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const weekEnd  = new Date(); weekEnd.setDate(weekEnd.getDate() + 7);
    const monthEnd = new Date(); monthEnd.setDate(monthEnd.getDate() + 30);
    const weekStr  = weekEnd.toISOString().split('T')[0];
    const monthStr = monthEnd.toISOString().split('T')[0];

    // Derive unique event types for the type filter
    const eventTypes = Array.from(new Set(events.map((e: any) => e.event_type).filter(Boolean))) as string[];

    const filtered = events.filter((ev: any) => {
      const q = evSearch.toLowerCase();
      const matchSearch = !q || ev.event_name.toLowerCase().includes(q) || (ev.host_org ?? '').toLowerCase().includes(q);
      const matchType = evTypeFilter === 'all' || ev.event_type === evTypeFilter;
      const matchDate = evDateFilter === 'all' ? true
        : evDateFilter === 'today' ? ev.event_date === todayStr
        : evDateFilter === 'week'  ? ev.event_date >= todayStr && ev.event_date <= weekStr
        : ev.event_date >= todayStr && ev.event_date <= monthStr;
      return matchSearch && matchType && matchDate;
    });

    const todayEvents   = filtered.filter((e: any) => e.event_date === todayStr);
    const upcomingEvents = filtered.filter((e: any) => e.event_date > todayStr);
    const activeFilters = (evSearch ? 1 : 0) + (evTypeFilter !== 'all' ? 1 : 0) + (evDateFilter !== 'all' ? 1 : 0);

    const EventCard = ({ ev, highlight }: { ev: any; highlight?: boolean }) => (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 0', borderBottom: `1px solid ${highlight ? '#fed7aa' : '#f3f4f6'}`,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{ev.event_name}</div>
          <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>{formatDate(ev.event_date)}</div>
          {ev.host_org && <div style={{ fontSize: 11, color: '#9ca3af' }}>{ev.host_org}</div>}
          {ev.event_type && (
            <span style={{ display: 'inline-block', marginTop: 3, fontSize: 10, fontWeight: 600, background: '#f0f4ff', color: '#3b5bdb', borderRadius: 4, padding: '1px 6px', textTransform: 'capitalize' as const }}>
              {ev.event_type}
            </span>
          )}
        </div>
        <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
          height: 30, padding: '0 10px', borderRadius: 6, background: highlight ? '#c2410c' : '#042C53',
          color: '#fff', fontWeight: 700, fontSize: 11, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', flexShrink: 0, marginLeft: 10,
        }}>Capture →</a>
      </div>
    );

    return (
      <div>
        {/* Search bar */}
        <input
          value={evSearch} onChange={e => setEvSearch(e.target.value)}
          placeholder="Search events, organizations…"
          style={{ width: '100%', boxSizing: 'border-box' as const, padding: '8px 12px', borderRadius: 8, border: '1px solid #e8eaed', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 8, outline: 'none' }}
        />

        {/* Filter toggle row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: evFiltersOpen ? 10 : 6 }}>
          <button onClick={() => setEvFiltersOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 5, height: 30, padding: '0 10px',
            borderRadius: 6, border: '1px solid #e8eaed', background: activeFilters > 0 ? '#eff6ff' : '#fff',
            color: activeFilters > 0 ? '#2563eb' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            <span>⚙ Filters</span>
            {activeFilters > 0 && <span style={{ background: '#2563eb', color: '#fff', borderRadius: 10, padding: '0 5px', fontSize: 10 }}>{activeFilters}</span>}
            <span style={{ fontSize: 10 }}>{evFiltersOpen ? '▲' : '▼'}</span>
          </button>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Collapsible filter panel */}
        {evFiltersOpen && (
          <div style={{ background: '#f8f9fb', border: '1px solid #e8eaed', borderRadius: 10, padding: '12px', marginBottom: 12 }}>
            {/* Date filter */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6 }}>Date Range</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                {([['all','All'],['today','Today'],['week','This Week'],['month','This Month']] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setEvDateFilter(val)} style={{
                    height: 28, padding: '0 10px', borderRadius: 14, border: '1px solid',
                    fontSize: 11, cursor: 'pointer', fontWeight: evDateFilter === val ? 700 : 400,
                    borderColor: evDateFilter === val ? '#042C53' : '#e8eaed',
                    background: evDateFilter === val ? '#042C53' : '#fff',
                    color: evDateFilter === val ? '#fff' : '#374151',
                  }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Type filter */}
            {eventTypes.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6 }}>Event Type</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                  <button onClick={() => setEvTypeFilter('all')} style={{
                    height: 28, padding: '0 10px', borderRadius: 14, border: '1px solid',
                    fontSize: 11, cursor: 'pointer', fontWeight: evTypeFilter === 'all' ? 700 : 400,
                    borderColor: evTypeFilter === 'all' ? '#042C53' : '#e8eaed',
                    background: evTypeFilter === 'all' ? '#042C53' : '#fff',
                    color: evTypeFilter === 'all' ? '#fff' : '#374151',
                  }}>All</button>
                  {eventTypes.map(t => (
                    <button key={t} onClick={() => setEvTypeFilter(t)} style={{
                      height: 28, padding: '0 10px', borderRadius: 14, border: '1px solid',
                      fontSize: 11, cursor: 'pointer', fontWeight: evTypeFilter === t ? 700 : 400,
                      borderColor: evTypeFilter === t ? '#042C53' : '#e8eaed',
                      background: evTypeFilter === t ? '#042C53' : '#fff',
                      color: evTypeFilter === t ? '#fff' : '#374151', textTransform: 'capitalize' as const,
                    }}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear */}
            {activeFilters > 0 && (
              <button onClick={() => { setEvTypeFilter('all'); setEvDateFilter('all'); setEvSearch(''); }} style={{
                marginTop: 10, fontSize: 11, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600,
              }}>✕ Clear all filters</button>
            )}
          </div>
        )}

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 13, color: '#6b7280' }}>
            No events saved yet. <a href="/networking-assistant-beta-2026/events" style={{ color: '#2563eb' }}>Browse LBC →</a>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: '#9ca3af' }}>No events match your filters.</div>
        ) : (
          <>
            {todayEvents.length > 0 && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>
                  📍 Today · {todayEvents.length} event{todayEvents.length > 1 ? 's' : ''} — tap Capture when you arrive
                </div>
                {todayEvents.map((ev: any) => <EventCard key={ev.id} ev={ev} highlight />)}
              </div>
            )}
            {upcomingEvents.length > 0 && (
              <>
                {todayEvents.length > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' as const, margin: '8px 0' }}>Upcoming</div>}
                {upcomingEvents.map((ev: any) => <EventCard key={ev.id} ev={ev} />)}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  // ── Org picker modal (sheet)
  const OrgPickerModal = () => {
    const alreadyAdded = new Set(memberships.map(m => m.org_id).filter(Boolean));
    const filteredOrgs = lbcOrgs.filter(o => {
      const matchCity = orgCityFilter === 'all' || o.city === orgCityFilter;
      const matchSearch = !orgSearch || o.name.toLowerCase().includes(orgSearch.toLowerCase());
      const notAdded = !alreadyAdded.has(o.id);
      return matchCity && matchSearch && notAdded;
    });

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        onClick={e => { if (e.target === e.currentTarget) { setShowOrgPicker(false); setShowManualOrg(false); } }}>
        <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 600, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Add Organization</div>
              <button onClick={() => { setShowOrgPicker(false); setShowManualOrg(false); }} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9ca3af', cursor: 'pointer' }}>✕</button>
            </div>
            {!showManualOrg ? (
              <>
                <input
                  autoFocus
                  value={orgSearch}
                  onChange={e => setOrgSearch(e.target.value)}
                  placeholder="Search organizations…"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', marginBottom: 8, outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' as const }}>
                  {(['all', ...ACTIVE_CITIES] as const).map(c => (
                    <button key={c} onClick={() => setOrgCityFilter(c)} style={{
                      height: 28, padding: '0 12px', borderRadius: 20, border: '1.5px solid',
                      fontSize: 11, fontWeight: orgCityFilter === c ? 700 : 400, cursor: 'pointer',
                      borderColor: orgCityFilter === c ? '#042C53' : '#e5e7eb',
                      background: orgCityFilter === c ? '#042C53' : '#fff',
                      color: orgCityFilter === c ? '#fff' : '#374151',
                    }}>{c === 'all' ? 'All Cities' : c}</button>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <input value={manualOrgName} onChange={e => setManualOrgName(e.target.value)}
                  placeholder="Organization name *" autoFocus
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', marginBottom: 8, outline: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <select value={manualOrgCity} onChange={e => setManualOrgCity(e.target.value)}
                    style={{ padding: '10px 10px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                    {ACTIVE_CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input value={manualOrgType} onChange={e => setManualOrgType(e.target.value)}
                    placeholder="Type (optional)"
                    style={{ padding: '10px 10px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <button onClick={handleAddManualOrg} disabled={!manualOrgName.trim() || savingOrg} style={{
                    flex: 1, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: manualOrgName.trim() ? '#042C53' : '#e5e7eb',
                    color: manualOrgName.trim() ? '#fff' : '#9ca3af', fontWeight: 700, fontSize: 13,
                  }}>{savingOrg ? 'Adding…' : 'Add Organization'}</button>
                  <button onClick={() => setShowManualOrg(false)} style={{ height: 40, padding: '0 14px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 13, cursor: 'pointer' }}>Back</button>
                </div>
              </div>
            )}
          </div>
          {!showManualOrg && (
            <div style={{ overflowY: 'auto', flex: 1, padding: '0 16px 16px' }}>
              <button onClick={() => setShowManualOrg(true)} style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px dashed #d1d5db',
                background: '#fafafa', color: '#6b7280', fontWeight: 500, fontSize: 13, cursor: 'pointer', textAlign: 'left' as const, marginBottom: 8,
              }}>+ Add organization not in list</button>
              {loadingOrgs ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af', fontSize: 13 }}>Loading organizations…</div>
              ) : filteredOrgs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af', fontSize: 13 }}>No matches found.</div>
              ) : filteredOrgs.map(org => (
                <button key={org.id} onClick={() => handleAddLBCOrg(org)} disabled={savingOrg} style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e8eaed',
                  background: '#fff', cursor: 'pointer', textAlign: 'left' as const, marginBottom: 4,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{org.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{[org.city, org.group_type].filter(Boolean).join(' · ')}</div>
                  </div>
                  <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>+ Add</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── My Orgs view with drill-down contact list
  const MyOrgsView = () => (
    <div>
      {memberships.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🏛</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>No organizations yet</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Add the chambers and groups you're a member of.</div>
          <button onClick={openOrgPicker} style={{
            height: 40, padding: '0 20px', borderRadius: 8, border: 'none',
            background: '#042C53', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>+ Add Organization</button>
        </div>
      ) : (
        <>
          {memberships.map(m => {
            const isExpanded = expandedOrgId === m.id;
            const contacts = orgContacts[m.id] ?? [];
            const isLoadingContacts = loadingOrgContacts === m.id;
            return (
              <div key={m.id} style={{ marginBottom: 8 }}>
                {/* Org card */}
                <div style={{ background: '#fff', borderRadius: isExpanded ? '8px 8px 0 0' : 8, border: '1px solid #e8eaed', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => toggleOrgDrilldown(m.id)} style={{
                    flex: 1, minWidth: 0, background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left' as const, padding: 0, display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏛</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{m.org_name}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                        {[m.org_city, m.org_type].filter(Boolean).join(' · ')}
                        {isExpanded && contacts.length > 0 && <span style={{ color: '#2563eb', marginLeft: 6 }}>{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0, marginRight: 8 }}>{isExpanded ? '▲' : '▼'}</span>
                  </button>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <a href={`/networking-assistant-beta-2026/capture?org=${m.id}&orgname=${encodeURIComponent(m.org_name ?? '')}`} style={{
                      height: 32, padding: '0 12px', borderRadius: 6, background: '#c2410c',
                      color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center',
                    }}>Capture →</a>
                    <button onClick={() => handleRemoveMembership(m.id)} title="Remove" style={{
                      height: 32, width: 32, borderRadius: 6, border: '1px solid #e5e7eb',
                      background: '#fff', color: '#d1d5db', cursor: 'pointer', fontSize: 14,
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                    >✕</button>
                  </div>
                </div>

                {/* Drill-down contact list */}
                {isExpanded && (
                  <div style={{ background: '#fafafa', border: '1px solid #e8eaed', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '8px 0' }}>
                    {isLoadingContacts ? (
                      <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: '#9ca3af' }}>Loading contacts…</div>
                    ) : contacts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: '#9ca3af' }}>
                        No contacts captured through this org yet.{' '}
                        <a href={`/networking-assistant-beta-2026/capture?org=${m.id}&orgname=${encodeURIComponent(m.org_name ?? '')}`} style={{ color: '#2563eb' }}>Capture first →</a>
                      </div>
                    ) : contacts.map((c: any) => {
                      const p = c.na_persons;
                      if (!p) return null;
                      return (
                        <a key={c.person_id} href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                          textDecoration: 'none', borderBottom: '1px solid #f0f0f0',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ff')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1d4ed8', flexShrink: 0 }}>
                            {initials(p.first_name, p.last_name)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{[p.first_name, p.last_name].filter(Boolean).join(' ')}</div>
                            <div style={{ fontSize: 11, color: '#6b7280' }}>{[p.title, p.company].filter(Boolean).join(' · ')}</div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: REL_COLOR[p.relationship_status] ?? '#6b7280', textTransform: 'uppercase' as const, flexShrink: 0 }}>
                            {REL_LABEL[p.relationship_status] ?? p.relationship_status}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={openOrgPicker} style={{
            width: '100%', height: 38, borderRadius: 8, border: '1.5px dashed #d1d5db',
            background: '#fafafa', color: '#6b7280', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 4,
          }}>+ Add Organization</button>
        </>
      )}
    </div>
  );

  // ── All Contacts (unified CRM view)
  const AllContactsView = () => {
    const filtered = persons.filter(p => {
      const q = contactSearch.toLowerCase();
      const matchSearch = !q || `${p.first_name} ${p.last_name ?? ''} ${p.company ?? ''} ${p.title ?? ''}`.toLowerCase().includes(q);
      const matchRel = relFilter === 'all' || p.relationship_status === relFilter;
      return matchSearch && matchRel;
    });
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' as const }}>
          <input
            value={contactSearch}
            onChange={e => setContactSearch(e.target.value)}
            placeholder="Search name, company, title…"
            style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 7, border: '1px solid #e8eaed', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
          />
          {(['all','prospect','referral','connector'] as const).map(r => (
            <button key={r} onClick={() => setRelFilter(r)} style={{
              height: 34, padding: '0 14px', borderRadius: 20, border: '1.5px solid',
              cursor: 'pointer', fontSize: 12, fontWeight: relFilter === r ? 700 : 400,
              borderColor: relFilter === r ? '#042C53' : '#e8eaed',
              background: relFilter === r ? '#042C53' : '#fff',
              color: relFilter === r ? '#fff' : '#374151',
            }}>{r === 'all' ? 'All' : REL_LABEL[r]}</button>
          ))}
        </div>
        {persons.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 48, fontSize: 13, color: '#6b7280' }}>
            No contacts yet. <a href="/networking-assistant-beta-2026/capture" style={{ color: '#2563eb' }}>Capture your first →</a>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 32, fontSize: 13, color: '#9ca3af' }}>No contacts match your filters.</div>
        ) : filtered.map((p: any) => (
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
              {REL_LABEL[p.relationship_status] ?? p.relationship_status}
            </span>
          </a>
        ))}
      </div>
    );
  };

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
          {!pageLoading && (
            <div style={{ display: 'flex', gap: 20, marginLeft: 24, paddingLeft: 24, borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
              {[
                { label: 'Overdue',  val: overdue.length,  alert: overdue.length > 0 },
                { label: 'Today',    val: today.length,    alert: today.length > 0 },
                { label: 'Queue',    val: upcoming.length, alert: false },
                { label: 'Contacts', val: persons.length,  alert: false },
                { label: 'Orgs',     val: memberships.length, alert: false },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: s.alert ? '#fca5a5' : '#e2e8f0', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: 0.8, textTransform: 'uppercase' as const, marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => helpTriggerRef.current?.()} style={{
            height: 32, padding: '0 14px', borderRadius: 6, background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)', color: '#93b4d4', fontWeight: 600,
            fontSize: 12, cursor: 'pointer',
          }}>? Help</button>
          <a href="/networking-assistant-beta-2026/capture" style={{
            height: 32, padding: '0 16px', borderRadius: 6, background: '#c2410c',
            color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
          }}>+ Capture Contact</a>
        </div>
      </div>

      {/* Body: left nav + main content + right panel */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr 280px', overflow: 'hidden', minHeight: 0 }}>

        {/* Left nav */}
        <div style={{ background: '#fff', borderRight: '1px solid #e8eaed', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
          <NavSection label="Follow-Ups" />
          <NavItem label="Queue" icon="◎" active={desktopView === 'queue'} badge={overdue.length + today.length} onClick={() => setDesktopView('queue')} />
          <NavSection label="My Network" />
          <NavItem label="My Contacts" icon="👤" active={desktopView === 'allcontacts' || desktopView === 'companies'} badge={persons.length > 0 ? persons.length : undefined} onClick={() => { setDesktopView('allcontacts'); setContactSearch(''); setRelFilter('all'); }} />
          <NavItem label="My Organizations" icon="🏛" active={desktopView === 'orgs'} badge={memberships.length > 0 ? memberships.length : undefined} onClick={() => setDesktopView('orgs')} />
          <NavSection label="My Activity" />
          <NavItem label="My Events" icon="📅" active={desktopView === 'events'} onClick={() => setDesktopView('events')} />
          <NavItem label="+ Add Events" icon="↗" href="/networking-assistant-beta-2026/events" />
        </div>

        {/* Main content */}
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
          ) : desktopView === 'allcontacts' ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                My Contacts <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>{persons.length} total</span>
              </div>
              <div style={{ maxWidth: 640 }}><AllContactsView /></div>
            </>
          ) : desktopView === 'companies' ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                All Companies <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>{companyGroups.length}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <input value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Search companies…"
                  style={{ width: '100%', maxWidth: 400, padding: '8px 12px', borderRadius: 7, border: '1px solid #e8eaed', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff', boxSizing: 'border-box' as const }} />
              </div>
              <div style={{ maxWidth: 640 }}><CompaniesView hideSearch={true} /></div>
            </>
          ) : desktopView === 'orgs' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                  My Organizations <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>{memberships.length}</span>
                </div>
                <button onClick={openOrgPicker} style={{
                  height: 34, padding: '0 16px', borderRadius: 7, border: 'none',
                  background: '#042C53', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                }}>+ Add Org</button>
              </div>
              <div style={{ maxWidth: 640 }}><MyOrgsView /></div>
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

        {/* Right panel — contact search */}
        <div style={{ background: '#fff', borderLeft: '1px solid #e8eaed', overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const }}>My Contacts · {persons.length}</div>
          <input
            placeholder="Search contacts…"
            value={contactSearch}
            onChange={e => setContactSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', outline: 'none', color: '#111827' }}
          />
          {persons.length === 0 ? (
            <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', paddingTop: 24 }}>No contacts yet.</div>
          ) : (() => {
            const q = contactSearch.toLowerCase();
            const filtered = q
              ? persons.filter((p: any) => `${p.first_name} ${p.last_name ?? ''} ${p.company ?? ''} ${p.title ?? ''}`.toLowerCase().includes(q))
              : persons;
            return filtered.length === 0 ? (
              <div style={{ fontSize: 12, color: '#9ca3af' }}>No match for "{contactSearch}"</div>
            ) : <div>{filtered.map((p: any) => <ContactRow key={p.id} p={p} />)}</div>;
          })()}
        </div>
      </div>

      <NAAssistant context={{ followUps, persons, events }} onHelpRef={fn => { helpTriggerRef.current = fn; }} />
      {showOrgPicker && <OrgPickerModal />}
      <WelcomeModal />
    </div>
  );

  // ────────────────────────── MOBILE LAYOUT ──────────────────────────
  const hour = new Date().getHours();
  const dow  = new Date().getDay();
  const isEventTime = (hour >= 17 && hour <= 22) || dow === 0 || dow === 6;

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 72, overscrollBehavior: 'none', touchAction: 'pan-y' }}>
      <div style={{ background: '#042C53' }}>
        <div style={{ padding: '0 16px' }}>
          {/* Context-aware event nudge */}
          {isEventTime && followUps.length === 0 && persons.length > 0 && (
            <a href="/networking-assistant-beta-2026/capture" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(194,65,12,0.85)', borderRadius: 8, padding: '7px 12px',
              marginTop: 8, textDecoration: 'none',
            }}>
              <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>🎤 At an event? Capture a contact →</span>
              <span style={{ fontSize: 11, color: '#fca5a5' }}>Tap here</span>
            </a>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
            <div>
              <div style={{ fontSize: 9, color: '#6b93b8', letterSpacing: 1, textTransform: 'uppercase' as const }}>Local Business Calendars</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Networking Assistant</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => helpTriggerRef.current?.()} style={{
                height: 34, width: 34, borderRadius: 7, background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)', color: '#93b4d4', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>?</button>
              <a href="/networking-assistant-beta-2026/capture" style={{
                height: 34, padding: '0 14px', borderRadius: 7, background: '#c2410c',
                color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center',
              }}>+ Capture</a>
            </div>
          </div>
        </div>
        {!pageLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 0 10px' }}>
            {[
              { label: 'Overdue',  val: overdue.length,  color: overdue.length > 0 ? '#f87171' : '#6b93b8' },
              { label: 'Today',    val: today.length,    color: today.length > 0 ? '#93c5fd' : '#6b93b8' },
              { label: 'Queue',    val: upcoming.length, color: '#6b93b8' },
              { label: 'Contacts', val: persons.length,  color: '#6b93b8' },
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
          {(['queue','people','events','orgs'] as const).map(t => (
            <button key={t} onClick={() => setMobileTab(t)} style={{
              flex: 1, height: 36, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: mobileTab === t ? 700 : 400,
              color: mobileTab === t ? '#fff' : '#6b93b8',
              borderBottom: mobileTab === t ? '2px solid #c2410c' : '2px solid transparent',
            }}>
              {t === 'queue' ? 'Queue' : t === 'people' ? 'Contacts' : t === 'events' ? 'Events' : 'Orgs'}
              <span style={{ marginLeft: 3, fontSize: 10, color: mobileTab === t ? '#93c5fd' : '#4a6a8a' }}>
                {t === 'queue' ? followUps.length : t === 'people' ? persons.length : t === 'events' ? events.length : memberships.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 0', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {pageLoading ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 48, fontSize: 13 }}>Loading…</div>
        ) : mobileTab === 'queue' ? <QueueContent />
          : mobileTab === 'people' ? <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 4 }}>
              {contactsView === 'people' ? `People · ${persons.length}` : `Companies · ${companyGroups.length}`}
            </div>
            <ContactsToggle />
            {contactsView === 'people' ? <ContactsList /> : <CompaniesView />}
          </>
          : mobileTab === 'events' ? <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 10 }}>My Events · {events.length}</div>
            <EventsList />
          </>
          : <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase' as const }}>My Organizations · {memberships.length}</div>
              <button onClick={openOrgPicker} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: 'none', background: '#042C53', color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>+ Add</button>
            </div>
            <MyOrgsView />
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
          { key: 'queue',  icon: '◎',  label: 'Queue',    badge: overdue.length + today.length },
          { key: 'people', icon: '👤', label: 'Contacts', badge: 0 },
          { key: 'events', icon: '📅', label: 'Events',   badge: 0 },
          { key: 'orgs',   icon: '🏛', label: 'Orgs',     badge: 0 },
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

      <NAAssistant context={{ followUps, persons, events }} onHelpRef={fn => { helpTriggerRef.current = fn; }} />
      {showOrgPicker && <OrgPickerModal />}
      <WelcomeModal />
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
