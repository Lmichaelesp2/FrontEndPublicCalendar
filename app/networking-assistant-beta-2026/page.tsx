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

const ACTION_ICONS: Record<string, string> = {
  linkedin_connect: '↗',
  linkedin_message: '↗',
  email:            '✉',
  call:             '↗',
  reminder:         '◎',
  re_engage:        '↺',
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dueBucket(dueDateStr: string): 'overdue' | 'today' | 'upcoming' {
  const today = new Date().toISOString().split('T')[0];
  if (dueDateStr < today) return 'overdue';
  if (dueDateStr === today) return 'today';
  return 'upcoming';
}

function metLabel(eventDateStr: string): string {
  const days = daysAgo(eventDateStr);
  if (days < 0) return `in ${Math.abs(days)}d`;
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

const RELATIONSHIP_COLORS: Record<string, string> = {
  hot: '#c2410c', warm: '#1652f0', cold: '#5b6678', archived: '#5b6678',
};

export default function NAHomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [followUps, setFollowUps]     = useState<any[]>([]);
  const [persons, setPersons]         = useState<any[]>([]);
  const [events, setEvents]           = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab]     = useState<'queue' | 'contacts' | 'events'>('queue');

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
      if (pp.data) setPersons(pp.data);
      if (ev.data) setEvents(ev.data);
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
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Masthead */}
      <div style={{ background: '#042C53', borderBottom: '1px solid #1f2a3d' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 10, color: '#5b6678', letterSpacing: 1.5, textTransform: 'uppercase' }}>{todayDate}</span>
            <span style={{ fontSize: 10, color: '#5b6678', letterSpacing: 1, textTransform: 'uppercase' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#c2410c', marginRight: 5, verticalAlign: 'middle' }} />
              Beta
            </span>
          </div>

          {/* Wordmark */}
          <div style={{ padding: '16px 0 12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 10, color: '#5b6678', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
              Local Business Calendars
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -0.5, fontFamily: 'Georgia, serif' }}>
              Networking Assistant
            </div>
            {profile?.first_name && (
              <div style={{ fontSize: 12, color: '#5b6678', marginTop: 4 }}>
                {profile.first_name} · {profile.subscription_tier === 'premium' ? 'Premium' : 'Free'}
              </div>
            )}
          </div>

          {/* Stats row */}
          {!pageLoading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Overdue',  value: overdue.length,   alert: overdue.length > 0 },
                { label: 'Due Today', value: today.length,    alert: today.length > 0 },
                { label: 'Upcoming', value: upcoming.length,  alert: false },
                { label: 'Contacts', value: persons.length,   alert: false },
              ].map(stat => (
                <div key={stat.label} style={{ padding: '12px 0', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: stat.alert ? '#c2410c' : '#fff', fontFamily: 'Georgia, serif' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 9, color: '#5b6678', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, padding: '12px 0' }}>
            <a href="/networking-assistant-beta-2026/capture" style={{
              flex: 1, display: 'block', textAlign: 'center', padding: '10px',
              background: '#c2410c', color: '#fff', fontWeight: 700, fontSize: 13,
              textDecoration: 'none', borderRadius: 2, letterSpacing: 0.3,
            }}>
              + Capture Contact
            </a>
            <a href="/networking-assistant-beta-2026/events" style={{
              flex: 1, display: 'block', textAlign: 'center', padding: '10px',
              background: 'transparent', color: '#a8b8d4', fontWeight: 600, fontSize: 13,
              textDecoration: 'none', borderRadius: 2, border: '1px solid #1f2a3d',
            }}>
              Browse Events
            </a>
          </div>
        </div>
      </div>

      {/* ── Tab nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e6e2d6' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex' }}>
          {([
            { key: 'queue',    label: `Follow-Up Queue`, count: followUps.length },
            { key: 'contacts', label: 'Contacts',        count: persons.length },
            { key: 'events',   label: 'My Events',       count: events.length },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
              color: activeTab === tab.key ? '#042C53' : '#5b6678',
              borderBottom: activeTab === tab.key ? '2px solid #042C53' : '2px solid transparent',
              textTransform: 'uppercase',
            }}>
              {tab.label}
              <span style={{ marginLeft: 6, fontSize: 11, color: activeTab === tab.key ? '#1652f0' : '#a8b8d4', fontWeight: 700 }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 64px' }}>

        {pageLoading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#5b6678', fontSize: 13 }}>Loading…</div>
        ) : (

          /* QUEUE TAB */
          activeTab === 'queue' ? (
            followUps.length === 0 ? (
              <div style={{ padding: '64px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#5b6678', marginBottom: 20 }}>No follow-ups pending. All caught up.</div>
                <a href="/networking-assistant-beta-2026/capture" style={{
                  display: 'inline-block', padding: '10px 24px', background: '#c2410c',
                  color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', borderRadius: 2,
                }}>Capture contacts →</a>
              </div>
            ) : (
              <div>
                {/* Overdue */}
                {overdue.length > 0 && (
                  <div>
                    <div style={{ padding: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#c2410c', letterSpacing: 1.5, textTransform: 'uppercase' }}>Overdue</span>
                      <span style={{ flex: 1, height: 1, background: '#fca5a522' }} />
                      <span style={{ fontSize: 10, color: '#c2410c', fontWeight: 700 }}>{overdue.length}</span>
                    </div>
                    {overdue.map(fu => <FollowUpRow key={fu.id} fu={fu} onComplete={handleComplete} onSnooze={handleSnooze} />)}
                  </div>
                )}

                {/* Today */}
                {today.length > 0 && (
                  <div>
                    <div style={{ padding: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#1652f0', letterSpacing: 1.5, textTransform: 'uppercase' }}>Due Today</span>
                      <span style={{ flex: 1, height: 1, background: '#e6e2d6' }} />
                      <span style={{ fontSize: 10, color: '#1652f0', fontWeight: 700 }}>{today.length}</span>
                    </div>
                    {today.map(fu => <FollowUpRow key={fu.id} fu={fu} onComplete={handleComplete} onSnooze={handleSnooze} />)}
                  </div>
                )}

                {/* Upcoming */}
                {upcoming.length > 0 && (
                  <div>
                    <div style={{ padding: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#5b6678', letterSpacing: 1.5, textTransform: 'uppercase' }}>Upcoming</span>
                      <span style={{ flex: 1, height: 1, background: '#e6e2d6' }} />
                      <span style={{ fontSize: 10, color: '#5b6678', fontWeight: 700 }}>{upcoming.length}</span>
                    </div>
                    {upcoming.map(fu => <FollowUpRow key={fu.id} fu={fu} onComplete={handleComplete} onSnooze={handleSnooze} />)}
                  </div>
                )}
              </div>
            )

          /* CONTACTS TAB */
          ) : activeTab === 'contacts' ? (
            persons.length === 0 ? (
              <div style={{ padding: '64px 0', textAlign: 'center', fontSize: 13, color: '#5b6678' }}>
                No contacts yet.{' '}
                <a href="/networking-assistant-beta-2026/capture" style={{ color: '#1652f0' }}>Capture your first one →</a>
              </div>
            ) : (
              <div>
                <div style={{ padding: '16px 0 8px', fontSize: 10, fontWeight: 700, color: '#5b6678', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  All Contacts · {persons.length}
                </div>
                {persons.map((p, i) => (
                  <a key={p.id} href={`/networking-assistant-beta-2026/persons/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                      padding: '14px 0', borderBottom: '1px solid #e6e2d6',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#042C53' }}>
                          {[p.first_name, p.last_name].filter(Boolean).join(' ')}
                        </div>
                        <div style={{ fontSize: 12, color: '#5b6678', marginTop: 2 }}>
                          {[p.title, p.company].filter(Boolean).join(' · ')}
                        </div>
                        {p.first_met_date && (
                          <div style={{ fontSize: 11, color: '#a8b8d4', marginTop: 2 }}>
                            Met {metLabel(p.first_met_date)}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: RELATIONSHIP_COLORS[p.relationship_status] ?? '#5b6678', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {p.relationship_status}
                        </span>
                        <span style={{ color: '#a8b8d4', fontSize: 14 }}>→</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )

          /* EVENTS TAB */
          ) : (
            events.length === 0 ? (
              <div style={{ padding: '64px 0', textAlign: 'center', fontSize: 13, color: '#5b6678' }}>
                No events yet.{' '}
                <a href="/networking-assistant-beta-2026/events" style={{ color: '#1652f0' }}>Browse LBC events →</a>
              </div>
            ) : (
              <div>
                <div style={{ padding: '16px 0 8px', fontSize: 10, fontWeight: 700, color: '#5b6678', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  My Events · {events.length}
                </div>
                {events.map(ev => (
                  <div key={ev.id} style={{ padding: '14px 0', borderBottom: '1px solid #e6e2d6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#042C53' }}>{ev.event_name}</div>
                      <div style={{ fontSize: 12, color: '#1652f0', marginTop: 2 }}>{formatDate(ev.event_date)}</div>
                      {ev.host_org && <div style={{ fontSize: 11, color: '#5b6678', marginTop: 1 }}>{ev.host_org}</div>}
                    </div>
                    <a href={`/networking-assistant-beta-2026/capture?event=${ev.id}`} style={{
                      padding: '7px 14px', background: '#c2410c', color: '#fff',
                      fontWeight: 700, fontSize: 12, textDecoration: 'none', borderRadius: 2,
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

// ── Follow-up row component
function FollowUpRow({ fu, onComplete, onSnooze }: {
  fu: any;
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
}) {
  const bucket = dueBucket(fu.due_date);
  const accentColor = bucket === 'overdue' ? '#c2410c' : bucket === 'today' ? '#1652f0' : '#5b6678';
  const name = [fu.na_persons?.first_name, fu.na_persons?.last_name].filter(Boolean).join(' ');

  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid #e6e2d6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
            <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`} style={{ fontWeight: 700, fontSize: 15, color: '#042C53', textDecoration: 'none' }}>
              {name || 'Unknown'}
            </a>
            {fu.na_persons?.company && (
              <span style={{ fontSize: 12, color: '#5b6678' }}>{fu.na_persons.company}</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: accentColor, fontWeight: 600 }}>
            {ACTION_ICONS[fu.action_type]} {ACTION_LABELS[fu.action_type] ?? fu.action_type}
          </div>
          {fu.na_events?.event_name && (
            <div style={{ fontSize: 11, color: '#a8b8d4', marginTop: 3 }}>
              {fu.na_events.event_name} · {fu.na_events.event_date ? metLabel(fu.na_events.event_date) : ''}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>{formatShortDate(fu.due_date)}</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onComplete(fu.id)} style={{
          padding: '7px 16px', borderRadius: 2, border: 'none', cursor: 'pointer',
          background: '#042C53', color: '#fff', fontWeight: 700, fontSize: 12,
        }}>Done</button>
        <button onClick={() => onSnooze(fu.id)} style={{
          padding: '7px 16px', borderRadius: 2, border: '1px solid #e6e2d6', cursor: 'pointer',
          background: '#fff', color: '#5b6678', fontWeight: 600, fontSize: 12,
        }}>Snooze 2d</button>
        <a href={`/networking-assistant-beta-2026/persons/${fu.person_id}`} style={{
          padding: '7px 16px', borderRadius: 2, border: '1px solid #e6e2d6',
          background: '#fff', color: '#1652f0', fontWeight: 600, fontSize: 12, textDecoration: 'none',
        }}>View →</a>
      </div>
    </div>
  );
}
