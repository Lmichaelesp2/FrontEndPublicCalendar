'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  fetchFollowUpQueue,
  fetchPersons,
  fetchMyNAEvents,
  updateFollowUp,
  linkedInSearchURL,
  daysAgo,
} from '../../src/lib/networking-assistant';

const ACTION_LABELS: Record<string, string> = {
  linkedin_connect: '🔗 Connect on LinkedIn',
  linkedin_message: '💬 LinkedIn message',
  email:            '✉️ Send email',
  call:             '📞 Call',
  reminder:         '🔔 Reminder',
  re_engage:        '🔄 Re-engage',
};

function formatShortDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dueBucket(dueDateStr: string): 'overdue' | 'today' | 'upcoming' {
  const today = new Date().toISOString().split('T')[0];
  if (dueDateStr < today) return 'overdue';
  if (dueDateStr === today) return 'today';
  return 'upcoming';
}

export default function NAHomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [followUps, setFollowUps]   = useState<any[]>([]);
  const [personCount, setPersonCount] = useState(0);
  const [eventCount, setEventCount]   = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab]     = useState<'queue' | 'contacts' | 'events'>('queue');
  const [persons, setPersons]         = useState<any[]>([]);
  const [events, setEvents]           = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setPageLoading(true);
      const [fq, pp, ev] = await Promise.all([
        fetchFollowUpQueue(user!.id),
        fetchPersons(user!.id),
        fetchMyNAEvents(user!.id),
      ]);
      if (fq.data) setFollowUps(fq.data);
      if (pp.data) { setPersons(pp.data); setPersonCount(pp.data.length); }
      if (ev.data) { setEvents(ev.data); setEventCount(ev.data.length); }
      setPageLoading(false);
    }
    load();
  }, [user]);

  async function handleComplete(id: string) {
    await updateFollowUp(id, { status: 'completed', completed_at: new Date().toISOString() });
    setFollowUps(prev => prev.filter(f => f.id !== id));
  }

  async function handleSnooze(id: string) {
    const d = new Date(); d.setDate(d.getDate() + 2);
    await updateFollowUp(id, { status: 'snoozed', snooze_until: d.toISOString().split('T')[0] });
    setFollowUps(prev => prev.filter(f => f.id !== id));
  }

  if (loading || !user) return null;

  const overdue  = followUps.filter(f => dueBucket(f.due_date) === 'overdue');
  const today    = followUps.filter(f => dueBucket(f.due_date) === 'today');
  const upcoming = followUps.filter(f => dueBucket(f.due_date) === 'upcoming');

  const FollowUpCard = ({ fu }: { fu: any }) => {
    const bucket = dueBucket(fu.due_date);
    const styles = {
      overdue:  { border: '#fca5a5', bg: '#fef2f2', dot: '#dc2626', label: 'Overdue' },
      today:    { border: '#fde68a', bg: '#fefce8', dot: '#d97706', label: 'Due Today' },
      upcoming: { border: '#bbf7d0', bg: '#f0fdf4', dot: '#16a34a', label: 'Upcoming' },
    }[bucket];

    const name = [fu.na_persons?.first_name, fu.na_persons?.last_name].filter(Boolean).join(' ');
    const company = fu.na_persons?.company;
    const metDaysAgo = fu.na_events?.event_date ? daysAgo(fu.na_events.event_date) : null;

    return (
      <div style={{ borderRadius: 10, border: `1.5px solid ${styles.border}`, background: styles.bg, padding: '14px', marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: styles.dot, display: 'inline-block', flexShrink: 0 }} />
              <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`} style={{ fontWeight: 700, fontSize: 15, color: '#0a1628', textDecoration: 'none' }}>
                {name || 'Unknown'}
              </a>
            </div>
            <div style={{ fontSize: 13, color: '#1f2a3d', paddingLeft: 16 }}>{ACTION_LABELS[fu.action_type] ?? fu.action_type}</div>
            {company && <div style={{ fontSize: 12, color: '#5b6678', paddingLeft: 16, marginTop: 1 }}>{company}</div>}
            {fu.na_events?.event_name && (
              <div style={{ fontSize: 11, color: '#5b6678', paddingLeft: 16, marginTop: 2 }}>
                Met at {fu.na_events.event_name}{metDaysAgo !== null ? ` · ${metDaysAgo === 0 ? 'today' : `${metDaysAgo}d ago`}` : ''}
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: styles.dot, textAlign: 'right', flexShrink: 0 }}>
            <div>{styles.label}</div>
            <div style={{ fontWeight: 400, color: '#5b6678' }}>{formatShortDate(fu.due_date)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => handleComplete(fu.id)} style={{
            flex: 1, padding: '8px', borderRadius: 7, border: 'none',
            background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer',
          }}>✓ Done</button>
          <button onClick={() => handleSnooze(fu.id)} style={{
            flex: 1, padding: '8px', borderRadius: 7, border: '1.5px solid #e6e2d6',
            background: '#fff', color: '#1f2a3d', fontWeight: 600, fontSize: 12, cursor: 'pointer',
          }}>Snooze 2d</button>
          <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`} style={{
            padding: '8px 12px', borderRadius: 7, border: '1.5px solid #e6e2d6',
            background: '#fff', color: '#5b6678', fontWeight: 600, fontSize: 12, textDecoration: 'none',
          }}>View</a>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#0a1628', color: '#fff', padding: '16px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: '#a8b8d4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
              Local Business Calendars
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Networking Assistant</div>
            {profile?.first_name && (
              <div style={{ fontSize: 13, color: '#a8b8d4', marginTop: 2 }}>Hi, {profile.first_name} 👋</div>
            )}
          </div>
          {/* Quick action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <a href="/networking-assistant-beta-2026/capture" style={{
              padding: '8px 14px', borderRadius: 8, background: '#c2410c', color: '#fff',
              fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>+ Capture</a>
            <a href="/networking-assistant-beta-2026/events" style={{
              padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#fff',
              fontWeight: 600, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>Events</a>
          </div>
        </div>

        {/* Stats bar */}
        {!pageLoading && (
          <div style={{ display: 'flex', gap: 24, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: overdue.length > 0 ? '#fca5a5' : '#fff' }}>{overdue.length}</div>
              <div style={{ fontSize: 10, color: '#a8b8d4', textTransform: 'uppercase', letterSpacing: 0.5 }}>Overdue</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: today.length > 0 ? '#fde68a' : '#fff' }}>{today.length}</div>
              <div style={{ fontSize: 10, color: '#a8b8d4', textTransform: 'uppercase', letterSpacing: 0.5 }}>Due Today</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{upcoming.length}</div>
              <div style={{ fontSize: 10, color: '#a8b8d4', textTransform: 'uppercase', letterSpacing: 0.5 }}>Upcoming</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{personCount}</div>
              <div style={{ fontSize: 10, color: '#a8b8d4', textTransform: 'uppercase', letterSpacing: 0.5 }}>Contacts</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginTop: 4 }}>
          {([
            { key: 'queue',    label: `Queue (${followUps.length})` },
            { key: 'contacts', label: `Contacts (${personCount})` },
            { key: 'events',   label: `Events (${eventCount})` },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 400,
              color: activeTab === tab.key ? '#fff' : '#a8b8d4',
              borderBottom: activeTab === tab.key ? '2px solid #c2410c' : '2px solid transparent',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px 48px' }}>

        {pageLoading ? (
          <div style={{ textAlign: 'center', color: '#5b6678', padding: 48 }}>Loading…</div>
        ) : (

          /* ── QUEUE TAB */
          activeTab === 'queue' ? (
            followUps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>All caught up</div>
                <div style={{ fontSize: 14, color: '#5b6678', marginBottom: 24 }}>No follow-ups pending. Go capture some contacts.</div>
                <a href="/networking-assistant-beta-2026/capture" style={{
                  display: 'inline-block', padding: '12px 24px', background: '#c2410c',
                  color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
                }}>+ Capture Contacts</a>
              </div>
            ) : (
              <div>
                {overdue.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                      ⚠️ Overdue ({overdue.length})
                    </div>
                    {overdue.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
                  </div>
                )}
                {today.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                      Today ({today.length})
                    </div>
                    {today.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
                  </div>
                )}
                {upcoming.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                      Upcoming ({upcoming.length})
                    </div>
                    {upcoming.map(fu => <FollowUpCard key={fu.id} fu={fu} />)}
                  </div>
                )}
              </div>
            )

          /* ── CONTACTS TAB */
          ) : activeTab === 'contacts' ? (
            persons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#5b6678' }}>
                No contacts yet. <a href="/networking-assistant-beta-2026/capture" style={{ color: '#1652f0' }}>Capture your first one →</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {persons.map(p => {
                  const statusColors: Record<string, string> = { hot: '#dc2626', warm: '#d97706', cold: '#1d4ed8', archived: '#6b7280' };
                  return (
                    <a key={p.id} href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e6e2d6', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#0a1628' }}>
                            {[p.first_name, p.last_name].filter(Boolean).join(' ')}
                          </div>
                          {p.title && <div style={{ fontSize: 13, color: '#1f2a3d' }}>{p.title}</div>}
                          {p.company && <div style={{ fontSize: 12, color: '#5b6678' }}>{p.company}</div>}
                          {p.first_met_date && <div style={{ fontSize: 11, color: '#5b6678', marginTop: 2 }}>Met {daysAgo(p.first_met_date)}d ago</div>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: statusColors[p.relationship_status] ?? '#5b6678', textTransform: 'uppercase' }}>
                            {p.relationship_status}
                          </span>
                          <span style={{ fontSize: 12, color: '#a8b8d4' }}>→</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )

          /* ── EVENTS TAB */
          ) : (
            events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#5b6678' }}>
                No events yet. <a href="/networking-assistant-beta-2026/events" style={{ color: '#1652f0' }}>Browse LBC events →</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {events.map(ev => (
                  <div key={ev.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e6e2d6', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: '#0a1628' }}>{ev.event_name}</div>
                      <div style={{ fontSize: 13, color: '#1652f0', marginTop: 2 }}>
                        {new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      {ev.host_org && <div style={{ fontSize: 12, color: '#5b6678', marginTop: 1 }}>{ev.host_org}</div>}
                    </div>
                    <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
                      padding: '7px 12px', borderRadius: 7, background: '#c2410c', color: '#fff',
                      fontWeight: 600, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap',
                    }}>Capture →</a>
                  </div>
                ))}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
