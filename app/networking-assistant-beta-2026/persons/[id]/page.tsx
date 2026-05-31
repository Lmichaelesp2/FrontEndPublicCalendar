'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../src/contexts/AuthContext';
import {
  fetchPerson,
  fetchInteractionsForPerson,
  fetchFollowUpQueue,
  updateFollowUp,
  linkedInSearchURL,
  daysAgo,
  type NAPerson,
  type NAInteraction,
  type NAFollowUp,
} from '../../../../src/lib/networking-assistant';
import { supabase } from '../../../../src/lib/supabase';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  hot:      { bg: '#fef2f2', color: '#dc2626' },
  warm:     { bg: '#fef3c7', color: '#92400e' },
  cold:     { bg: '#eff6ff', color: '#1d4ed8' },
  archived: { bg: '#f3f4f6', color: '#6b7280' },
};

const ACTION_LABELS: Record<string, string> = {
  linkedin_connect: '🔗 Connect on LinkedIn',
  linkedin_message: '💬 LinkedIn message',
  email:            '✉️ Send email',
  call:             '📞 Call',
  reminder:         '🔔 Reminder',
  re_engage:        '🔄 Re-engage',
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });
}

function dueBucket(dueDateStr: string): 'overdue' | 'today' | 'upcoming' {
  const today = new Date().toISOString().split('T')[0];
  if (dueDateStr < today) return 'overdue';
  if (dueDateStr === today) return 'today';
  return 'upcoming';
}

const BUCKET_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  overdue:  { bg: '#fef2f2', color: '#dc2626', label: 'Overdue' },
  today:    { bg: '#fefce8', color: '#92400e', label: 'Due Today' },
  upcoming: { bg: '#f0fdf4', color: '#166534', label: 'Upcoming' },
};

export default function PersonRecordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const personId = params.id as string;

  const [person, setPerson]             = useState<NAPerson | null>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [followUps, setFollowUps]       = useState<any[]>([]);
  const [pageLoading, setPageLoading]   = useState(true);
  const [editing, setEditing]           = useState(false);
  const [editForm, setEditForm]         = useState<Partial<NAPerson>>({});
  const [savingEdit, setSavingEdit]     = useState(false);
  const [snoozeId, setSnoozeId]         = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !personId) return;
    async function load() {
      setPageLoading(true);
      const [p, i, f] = await Promise.all([
        fetchPerson(personId),
        fetchInteractionsForPerson(personId),
        supabase
          .from('na_follow_ups')
          .select('*, na_events(event_name, event_date)')
          .eq('person_id', personId)
          .in('status', ['pending', 'snoozed'])
          .order('due_date', { ascending: true }),
      ]);
      if (p.data) { setPerson(p.data); setEditForm(p.data); }
      if (i.data) setInteractions(i.data);
      if (f.data) setFollowUps(f.data);
      setPageLoading(false);
    }
    load();
  }, [user, personId]);

  async function handleComplete(followUpId: string) {
    await updateFollowUp(followUpId, { status: 'completed', completed_at: new Date().toISOString() });
    setFollowUps(prev => prev.filter(f => f.id !== followUpId));
  }

  async function handleSnooze(followUpId: string) {
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + 2);
    await updateFollowUp(followUpId, {
      status: 'snoozed',
      snooze_until: snoozeDate.toISOString().split('T')[0],
    });
    setFollowUps(prev => prev.filter(f => f.id !== followUpId));
    setSnoozeId(null);
  }

  async function handleSkip(followUpId: string) {
    await updateFollowUp(followUpId, { status: 'skipped' });
    setFollowUps(prev => prev.filter(f => f.id !== followUpId));
  }

  async function handleSaveEdit() {
    if (!person) return;
    setSavingEdit(true);
    const { data } = await supabase
      .from('na_persons')
      .update({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        company: editForm.company,
        title: editForm.title,
        email: editForm.email,
        phone: editForm.phone,
        linkedin_url: editForm.linkedin_url,
        notes: editForm.notes,
        relationship_status: editForm.relationship_status,
      })
      .eq('id', person.id)
      .select()
      .single();
    if (data) setPerson(data as NAPerson);
    setSavingEdit(false);
    setEditing(false);
  }

  if (loading || !user) return null;

  if (pageLoading) return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#5b6678' }}>
      Loading…
    </div>
  );

  if (!person) return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#5b6678' }}>
      Contact not found. <a href="/networking-assistant-beta-2026" style={{ color: '#1652f0', marginLeft: 8 }}>← Back to Queue</a>
    </div>
  );

  const statusStyle = STATUS_COLORS[person.relationship_status] ?? STATUS_COLORS.warm;
  const fullName = [person.first_name, person.last_name].filter(Boolean).join(' ');
  const linkedInURL = person.linkedin_url || linkedInSearchURL(person.first_name, person.last_name, person.company);

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#0a1628', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: '#a8b8d4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Networking Assistant</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{fullName}</div>
        </div>
        <a href="/networking-assistant-beta-2026" style={{ color: '#a8b8d4', fontSize: 13, textDecoration: 'none' }}>← Queue</a>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Contact card */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e6e2d6', padding: '20px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628', marginBottom: 4 }}>{fullName}</div>
              {person.title && <div style={{ fontSize: 14, color: '#1f2a3d' }}>{person.title}</div>}
              {person.company && <div style={{ fontSize: 14, color: '#5b6678' }}>{person.company}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: statusStyle.bg, color: statusStyle.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {person.relationship_status}
              </span>
              <button onClick={() => setEditing(v => !v)} style={{ fontSize: 12, color: '#1652f0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Edit form */}
          {editing ? (
            <div>
              {[
                { label: 'First Name', key: 'first_name' },
                { label: 'Last Name', key: 'last_name' },
                { label: 'Company', key: 'company' },
                { label: 'Title', key: 'title' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'LinkedIn URL', key: 'linkedin_url' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 3 }}>{f.label}</label>
                  <input
                    value={(editForm as any)[f.key] ?? ''}
                    onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 11px', borderRadius: 7, border: '1.5px solid #e6e2d6', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 3 }}>Relationship Status</label>
                <select value={editForm.relationship_status ?? 'warm'} onChange={e => setEditForm(prev => ({ ...prev, relationship_status: e.target.value as any }))}
                  style={{ width: '100%', padding: '9px 11px', borderRadius: 7, border: '1.5px solid #e6e2d6', fontSize: 14 }}>
                  {['hot','warm','cold','archived'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 3 }}>Notes</label>
                <textarea value={editForm.notes ?? ''} onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3} style={{ width: '100%', padding: '9px 11px', borderRadius: 7, border: '1.5px solid #e6e2d6', fontSize: 14, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
              </div>
              <button onClick={handleSaveEdit} disabled={savingEdit} style={{
                width: '100%', padding: '11px', borderRadius: 8, border: 'none',
                background: '#0a1628', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>
                {savingEdit ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div>
              {/* Contact details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {person.email && <div style={{ fontSize: 13, color: '#1f2a3d' }}>✉️ {person.email}</div>}
                {person.phone && <div style={{ fontSize: 13, color: '#1f2a3d' }}>📞 {person.phone}</div>}
                {person.city && <div style={{ fontSize: 13, color: '#5b6678' }}>📍 {person.city}</div>}
                {person.first_met_date && <div style={{ fontSize: 13, color: '#5b6678' }}>First met: {formatDate(person.first_met_date)}</div>}
                {person.notes && <div style={{ fontSize: 13, color: '#1f2a3d', marginTop: 4, padding: '8px 10px', background: '#fafaf7', borderRadius: 6 }}>{person.notes}</div>}
              </div>

              {/* LinkedIn button */}
              <a href={linkedInURL} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px', borderRadius: 8, background: '#0077b5', color: '#fff',
                fontWeight: 600, fontSize: 14, textDecoration: 'none',
              }}>
                🔗 Open LinkedIn{person.linkedin_url ? ' Profile' : ' Search'}
              </a>
            </div>
          )}
        </div>

        {/* Follow-ups */}
        {followUps.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e6e2d6', padding: '20px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#5b6678', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
              Open Follow-Ups ({followUps.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {followUps.map(fu => {
                const bucket = dueBucket(fu.due_date);
                const bs = BUCKET_STYLE[bucket];
                return (
                  <div key={fu.id} style={{ padding: '12px', borderRadius: 8, background: bs.bg, border: `1px solid ${bs.color}22` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#0a1628' }}>{ACTION_LABELS[fu.action_type] ?? fu.action_type}</div>
                        <div style={{ fontSize: 12, color: bs.color, fontWeight: 600, marginTop: 2 }}>
                          {bs.label} · {formatShortDate(fu.due_date)}
                        </div>
                        {fu.na_events?.event_name && (
                          <div style={{ fontSize: 12, color: '#5b6678', marginTop: 2 }}>
                            {fu.na_events.event_name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleComplete(fu.id)} style={{
                        flex: 1, padding: '7px', borderRadius: 6, border: 'none',
                        background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                      }}>✓ Done</button>
                      <button onClick={() => handleSnooze(fu.id)} style={{
                        flex: 1, padding: '7px', borderRadius: 6, border: '1.5px solid #e6e2d6',
                        background: '#fff', color: '#1f2a3d', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                      }}>Snooze 2d</button>
                      <button onClick={() => handleSkip(fu.id)} style={{
                        padding: '7px 12px', borderRadius: 6, border: '1.5px solid #e6e2d6',
                        background: '#fff', color: '#5b6678', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                      }}>Skip</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interaction timeline */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e6e2d6', padding: '20px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#5b6678', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            Interaction History
          </div>
          {interactions.length === 0 ? (
            <div style={{ color: '#5b6678', fontSize: 13 }}>No interactions recorded yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {interactions.map((int: any) => (
                <div key={int.id} style={{ paddingLeft: 12, borderLeft: '3px solid #1652f0' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0a1628' }}>
                    {int.na_events?.event_name ?? 'Unknown event'}
                  </div>
                  <div style={{ fontSize: 12, color: '#1652f0', marginTop: 1 }}>
                    {int.na_events?.event_date ? formatDate(int.na_events.event_date) : ''}
                    {' · '}{daysAgo(int.interaction_date) === 0 ? 'Today' : `${daysAgo(int.interaction_date)} days ago`}
                  </div>
                  {int.key_topic && (
                    <div style={{ fontSize: 13, color: '#1f2a3d', marginTop: 4 }}>
                      💬 {int.key_topic}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Capture again */}
        <a href={`/networking-assistant-beta-2026/capture`} style={{
          display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10,
          border: '1.5px solid #e6e2d6', background: '#fff', color: '#1f2a3d',
          fontWeight: 600, fontSize: 14, textDecoration: 'none',
        }}>
          + Capture another interaction
        </a>
      </div>
    </div>
  );
}
