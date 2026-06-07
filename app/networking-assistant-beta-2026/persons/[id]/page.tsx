'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../src/contexts/AuthContext';
import {
  fetchPerson, fetchInteractionsForPerson, updateFollowUp,
  linkedInSearchURL, daysAgo, deletePerson, type NAPerson,
} from '../../../../src/lib/networking-assistant';
import { supabase } from '../../../../src/lib/supabase';

const ACTION_LABELS: Record<string, string> = {
  linkedin_connect: 'Connect on LinkedIn',
  linkedin_message: 'LinkedIn message',
  email:            'Send email',
  call:             'Call',
  reminder:         'Reminder',
  re_engage:        'Re-engage',
};

const REL_COLORS: Record<string, { bg: string; text: string }> = {
  hot:      { bg: '#fef2f2', text: '#dc2626' },
  warm:     { bg: '#eff6ff', text: '#1d4ed8' },
  cold:     { bg: '#f9fafb', text: '#6b7280' },
  archived: { bg: '#f9fafb', text: '#9ca3af' },
};

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function dueBucket(d: string): 'overdue' | 'today' | 'upcoming' {
  const t = new Date().toISOString().split('T')[0];
  return d < t ? 'overdue' : d === t ? 'today' : 'upcoming';
}

const BUCKET_COLORS = {
  overdue:  { border: '#ef4444', label: 'Overdue',   text: '#dc2626' },
  today:    { border: '#2563eb', label: 'Due Today',  text: '#1d4ed8' },
  upcoming: { border: '#e5e7eb', label: 'Upcoming',   text: '#6b7280' },
};

const css = {
  page:  { minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 32 } as React.CSSProperties,
  header: { background: '#042C53', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 } as React.CSSProperties,
  card:  { background: '#fff', borderRadius: 12, padding: '16px', marginBottom: 12 } as React.CSSProperties,
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', color: '#111827' },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 },
};

export default function PersonRecordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const personId = params.id as string;

  const [person, setPerson]           = useState<NAPerson | null>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [followUps, setFollowUps]     = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [editing, setEditing]         = useState(false);
  const [editForm, setEditForm]       = useState<Partial<NAPerson>>({});
  const [savingEdit, setSavingEdit]   = useState(false);

  useEffect(() => { if (!loading && !user) router.push('/'); }, [loading, user, router]);

  useEffect(() => {
    if (!user || !personId) return;
    (async () => {
      setPageLoading(true);
      const [p, i, f] = await Promise.all([
        fetchPerson(personId),
        fetchInteractionsForPerson(personId),
        supabase.from('na_follow_ups').select('*, na_events(event_name, event_date)')
          .eq('person_id', personId).in('status', ['pending', 'snoozed']).order('due_date', { ascending: true }),
      ]);
      if (p.data) { setPerson(p.data); setEditForm(p.data); }
      if (i.data) setInteractions(i.data);
      if (f.data) setFollowUps(f.data);
      setPageLoading(false);
    })();
  }, [user, personId]);

  async function handleComplete(id: string) {
    await updateFollowUp(id, { status: 'completed', completed_at: new Date().toISOString() });
    setFollowUps(p => p.filter(f => f.id !== id));
  }
  async function handleSnooze(id: string) {
    const d = new Date(); d.setDate(d.getDate() + 2);
    await updateFollowUp(id, { status: 'snoozed', snooze_until: d.toISOString().split('T')[0] });
    setFollowUps(p => p.filter(f => f.id !== id));
  }
  async function handleSkip(id: string) {
    await updateFollowUp(id, { status: 'skipped' });
    setFollowUps(p => p.filter(f => f.id !== id));
  }

  async function handleSaveEdit() {
    if (!person) return;
    setSavingEdit(true);
    const { data } = await supabase.from('na_persons').update({
      first_name: editForm.first_name, last_name: editForm.last_name,
      company: editForm.company, title: editForm.title,
      email: editForm.email, phone: editForm.phone,
      linkedin_url: editForm.linkedin_url, notes: editForm.notes,
      relationship_status: editForm.relationship_status,
    }).eq('id', person.id).select().single();
    if (data) setPerson(data as NAPerson);
    setSavingEdit(false);
    setEditing(false);
  }

  async function handleDelete() {
    if (!person) return;
    if (!confirm(`Delete ${person.first_name} ${person.last_name ?? ''}? This also removes their follow-ups and interactions.`)) return;
    await deletePerson(person.id);
    router.push('/networking-assistant-beta-2026');
  }

  if (loading || !user) return null;
  if (pageLoading) return <div style={{ ...css.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Loading…</div>;
  if (!person) return <div style={{ ...css.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 14 }}>Contact not found. <a href="/networking-assistant-beta-2026" style={{ color: '#2563eb', marginLeft: 8 }}>← Back</a></div>;

  const fullName = [person.first_name, person.last_name].filter(Boolean).join(' ');
  const relStyle = REL_COLORS[person.relationship_status] ?? REL_COLORS.warm;
  const linkedInURL = person.linkedin_url || linkedInSearchURL(person.first_name, person.last_name, person.company);

  return (
    <div style={css.page}>
      {/* Header */}
      <div style={css.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/networking-assistant-beta-2026" style={{ color: '#93b4d4', fontSize: 20, textDecoration: 'none' }}>‹</a>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{fullName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setEditing(v => !v)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: '#93b4d4', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '5px 12px' }}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 6, color: '#fca5a5', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '5px 12px' }}>
            Delete
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px' }}>

        {/* Contact card */}
        <div style={css.card}>
          {editing ? (
            <div>
              <div style={css.sectionTitle}>Edit Contact</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[['First Name','first_name'],['Last Name','last_name'],['Company','company'],['Title','title'],['Email','email'],['Phone','phone']].map(([lbl, key]) => (
                  <div key={key} style={{ gridColumn: ['company','email'].includes(key) ? '1/-1' : undefined }}>
                    <label style={css.label}>{lbl}</label>
                    <input value={(editForm as any)[key] ?? ''} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} style={css.input} />
                  </div>
                ))}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={css.label}>LinkedIn URL</label>
                  <input value={editForm.linkedin_url ?? ''} onChange={e => setEditForm(p => ({ ...p, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." style={css.input} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={css.label}>Relationship Status</label>
                  <select value={editForm.relationship_status ?? 'warm'} onChange={e => setEditForm(p => ({ ...p, relationship_status: e.target.value as any }))} style={css.input}>
                    {['hot','warm','cold','archived'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={css.label}>Notes</label>
                  <textarea value={editForm.notes ?? ''} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ ...css.input, resize: 'vertical' as const }} />
                </div>
              </div>
              <button onClick={handleSaveEdit} disabled={savingEdit} style={{ width: '100%', height: 44, borderRadius: 10, border: 'none', background: '#042C53', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                {savingEdit ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{fullName}</div>
                  {person.title && <div style={{ fontSize: 14, color: '#374151' }}>{person.title}</div>}
                  {person.company && <div style={{ fontSize: 14, color: '#6b7280' }}>{person.company}</div>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: relStyle.bg, color: relStyle.text, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>
                  {person.relationship_status}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, fontSize: 13, color: '#374151' }}>
                {person.email && <div>✉ {person.email}</div>}
                {person.phone && <div>📞 {person.phone}</div>}
                {person.city && <div style={{ color: '#6b7280' }}>📍 {person.city}</div>}
                {person.first_met_date && <div style={{ color: '#6b7280' }}>First met: {formatDate(person.first_met_date)}</div>}
                {person.notes && <div style={{ marginTop: 4, padding: '10px 12px', background: '#f9fafb', borderRadius: 8, color: '#374151' }}>{person.notes}</div>}
              </div>
              <a href={linkedInURL} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44,
                borderRadius: 10, background: '#0077b5', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
              }}>
                🔗 Open LinkedIn{person.linkedin_url ? ' Profile' : ' Search'}
              </a>
            </div>
          )}
        </div>

        {/* Follow-ups */}
        {followUps.length > 0 && (
          <div style={css.card}>
            <div style={css.sectionTitle}>Open Follow-Ups · {followUps.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {followUps.map(fu => {
                const b = dueBucket(fu.due_date);
                const bc = BUCKET_COLORS[b];
                return (
                  <div key={fu.id} style={{ borderLeft: `4px solid ${bc.border}`, paddingLeft: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{ACTION_LABELS[fu.action_type] ?? fu.action_type}</div>
                    <div style={{ fontSize: 12, color: bc.text, fontWeight: 600, marginBottom: 8 }}>
                      {bc.label} · {new Date(fu.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleComplete(fu.id)} style={{ height: 34, borderRadius: 7, border: 'none', background: '#042C53', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: '0 14px' }}>✓ Done</button>
                      <button onClick={() => handleSnooze(fu.id)} style={{ height: 34, borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: '0 14px' }}>Snooze 2d</button>
                      <button onClick={() => handleSkip(fu.id)} style={{ height: 34, borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: '0 14px' }}>Skip</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interaction timeline */}
        <div style={css.card}>
          <div style={css.sectionTitle}>Interaction History</div>
          {interactions.length === 0 ? (
            <div style={{ fontSize: 13, color: '#9ca3af' }}>No interactions recorded yet.</div>
          ) : interactions.map((int: any) => {
            const isOrg = int.source_type === 'org';
            const orgName = int.na_memberships?.org_name;
            const eventName = int.na_events?.event_name;
            const accentColor = isOrg ? '#7c3aed' : '#2563eb';
            return (
              <div key={int.id} style={{ paddingLeft: 14, borderLeft: `3px solid ${accentColor}`, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                    {isOrg ? (orgName ?? 'Organization') : (eventName ?? 'Unknown event')}
                  </div>
                  {isOrg && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: '#ede9fe', color: '#7c3aed', letterSpacing: 0.3 }}>
                      🏛 Member
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: accentColor, marginTop: 1 }}>
                  {isOrg
                    ? [int.na_memberships?.org_city, int.na_memberships?.org_type].filter(Boolean).join(' · ')
                    : (int.na_events?.event_date ? formatDate(int.na_events.event_date) : '')}
                  {int.interaction_date ? ` · ${daysAgo(int.interaction_date) === 0 ? 'today' : `${daysAgo(int.interaction_date)}d ago`}` : ''}
                </div>
                {int.key_topic && <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>{int.key_topic}</div>}
              </div>
            );
          })}
        </div>

        <a href="/networking-assistant-beta-2026/capture" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44,
          borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151',
          fontWeight: 600, fontSize: 14, textDecoration: 'none',
        }}>+ Capture another interaction</a>
      </div>
    </div>
  );
}
