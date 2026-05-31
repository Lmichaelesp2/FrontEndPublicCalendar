'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../src/contexts/AuthContext';
import {
  fetchMyNAEvents, createPerson, createInteraction, createFollowUp, type NAEvent,
} from '../../../src/lib/networking-assistant';

function addDays(days: number) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const FOLLOW_UPS = [
  { value: 'linkedin_connect', label: 'Connect on LinkedIn' },
  { value: 'linkedin_message', label: 'Send LinkedIn message' },
  { value: 'email',            label: 'Send an email' },
  { value: 'call',             label: 'Give them a call' },
  { value: 'reminder',         label: 'Just remind me' },
];

const WHEN = [
  { label: 'Tomorrow',   days: 1  },
  { label: 'In 2 days',  days: 2  },
  { label: 'This week',  days: 3  },
  { label: 'Next week',  days: 7  },
  { label: 'In 2 weeks', days: 14 },
];

const css = {
  page:  { minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif' } as React.CSSProperties,
  header: { background: '#042C53', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 } as React.CSSProperties,
  card:  { background: '#fff', borderRadius: 12, padding: '16px', marginBottom: 12 } as React.CSSProperties,
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: { width: '100%', padding: '11px 13px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', color: '#111827', outline: 'none' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
};

function CaptureFlowInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preloadEventId = searchParams.get('event');

  const [myEvents, setMyEvents]           = useState<NAEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NAEvent | null>(null);
  const [phase, setPhase]                 = useState<'select_event' | 'form' | 'summary'>('select_event');

  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [company, setCompany]       = useState('');
  const [title, setTitle]           = useState('');
  const [topic, setTopic]           = useState('');
  const [followUps, setFollowUps]   = useState<string[]>(['linkedin_connect']);
  const [whenDays, setWhenDays]     = useState(2);
  const [customDate, setCustomDate] = useState('');
  const [saving, setSaving]         = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [savedName, setSavedName]   = useState('');
  const [errors, setErrors]         = useState<string[]>([]);

  useEffect(() => { if (!loading && !user) router.push('/'); }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchMyNAEvents(user.id).then(({ data }) => {
      if (data) {
        setMyEvents(data);
        if (preloadEventId) {
          const found = data.find(e => e.id === preloadEventId);
          if (found) { setSelectedEvent(found); setPhase('form'); }
        }
      }
    });
  }, [user, preloadEventId]);

  function toggle(val: string) {
    setFollowUps(p => p.includes(val) ? p.filter(v => v !== val) : [...p, val]);
  }

  function reset() {
    setFirstName(''); setLastName(''); setCompany(''); setTitle(''); setTopic('');
    setFollowUps(['linkedin_connect']); setWhenDays(2); setCustomDate(''); setErrors([]);
  }

  async function handleSave() {
    const errs: string[] = [];
    if (!firstName.trim()) errs.push('First name is required.');
    if (followUps.length === 0) errs.push('Select at least one follow-up.');
    if (errs.length) { setErrors(errs); return; }
    setSaving(true);
    const due = customDate || addDays(whenDays);
    const { data: person } = await createPerson({
      user_profile_id: user!.id,
      first_name: firstName.trim(), last_name: lastName.trim() || null,
      company: company.trim() || null, title: title.trim() || null,
      email: null, phone: null, linkedin_url: null,
      city: selectedEvent?.city ?? null, industry: null, tags: null,
      relationship_status: 'warm',
      first_met_event_id: selectedEvent?.id ?? null,
      first_met_date: selectedEvent?.event_date ?? null,
      notes: null, linkedin_connected: false, google_contact_id: null,
    });
    if (person) {
      await createInteraction({
        user_profile_id: user!.id, person_id: person.id,
        event_id: selectedEvent!.id, interaction_date: selectedEvent!.event_date,
        voice_transcript: null, key_topic: topic.trim() || null,
        opportunity_notes: null, follow_up_intent: null, sentiment: 'positive',
      });
      for (const type of followUps) {
        await createFollowUp({
          user_profile_id: user!.id, person_id: person.id,
          event_id: selectedEvent!.id, action_type: type as any,
          due_date: due, status: 'pending',
          ai_draft_message: null, snooze_until: null, completed_at: null, skip_reason: null,
        });
      }
      setSavedName([firstName.trim(), lastName.trim()].filter(Boolean).join(' '));
      setSavedCount(c => c + 1);
    }
    setSaving(false);
    setPhase('summary');
  }

  if (loading || !user) return null;

  // ── Select event phase
  if (phase === 'select_event') return (
    <div style={css.page}>
      <div style={css.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/networking-assistant-beta-2026" style={{ color: '#93b4d4', fontSize: 20, textDecoration: 'none' }}>‹</a>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Capture Contact</div>
        </div>
        <a href="/networking-assistant-beta-2026/events" style={{ fontSize: 12, color: '#93b4d4', textDecoration: 'none' }}>+ Add Event</a>
      </div>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Which event are you at?</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>Pick an event to attach this contact to.</div>
        {myEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, background: '#fff', borderRadius: 12 }}>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>No events yet. Add one first.</div>
            <a href="/networking-assistant-beta-2026/events" style={{ height: 44, display: 'inline-flex', alignItems: 'center', padding: '0 24px', background: '#042C53', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Browse Events →</a>
          </div>
        ) : myEvents.map(ev => (
          <button key={ev.id} onClick={() => { setSelectedEvent(ev); setPhase('form'); }} style={{
            width: '100%', background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb',
            padding: '14px 16px', cursor: 'pointer', textAlign: 'left', marginBottom: 10,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{ev.event_name}</div>
            <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 500, marginTop: 2 }}>{formatDate(ev.event_date)}</div>
            {ev.host_org && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{ev.host_org}</div>}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Capture form phase
  if (phase === 'form') return (
    <div style={css.page}>
      <div style={css.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { reset(); setPhase('select_event'); }} style={{ background: 'none', border: 'none', color: '#93b4d4', fontSize: 20, cursor: 'pointer', padding: 0 }}>‹</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>New Contact</div>
        </div>
        <div style={{ fontSize: 12, color: '#93b4d4' }}>{selectedEvent?.event_name}</div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '16px 16px 48px' }}>

        {/* Event context */}
        <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#1d4ed8', fontWeight: 500 }}>
          📍 {selectedEvent?.event_name} · {selectedEvent ? formatDate(selectedEvent.event_date) : ''}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            {errors.map((e, i) => <div key={i} style={{ fontSize: 13, color: '#dc2626' }}>⚠ {e}</div>)}
          </div>
        )}

        {/* Contact info */}
        <div style={css.card}>
          <div style={css.sectionTitle}>Contact Info</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={css.label}>First Name *</label>
              <input autoFocus value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sarah" style={{ ...css.input, borderColor: !firstName.trim() && errors.length ? '#fca5a5' : '#e5e7eb' }} />
            </div>
            <div>
              <label style={css.label}>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Johnson" style={css.input} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={css.label}>Company</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" style={css.input} />
          </div>
          <div>
            <label style={css.label}>Title / Role</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VP of Sales" style={css.input} />
          </div>
        </div>

        {/* Topic */}
        <div style={css.card}>
          <div style={css.sectionTitle}>What did you talk about?</div>
          <textarea value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="Key topics, opportunities, anything to remember…"
            rows={3} style={{ ...css.input, resize: 'vertical' as const }} />
        </div>

        {/* Follow-ups */}
        <div style={css.card}>
          <div style={css.sectionTitle}>Follow-Up Actions · select all that apply</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FOLLOW_UPS.map(opt => {
              const sel = followUps.includes(opt.value);
              return (
                <button key={opt.value} onClick={() => toggle(opt.value)} style={{
                  height: 46, borderRadius: 8, border: `2px solid ${sel ? '#042C53' : '#e5e7eb'}`,
                  background: sel ? '#042C53' : '#fff', color: sel ? '#fff' : '#374151',
                  fontWeight: sel ? 700 : 400, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px',
                }}>
                  {opt.label}
                  {sel && <span style={{ fontSize: 16 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* When */}
        <div style={css.card}>
          <div style={css.sectionTitle}>When to Follow Up</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 14 }}>
            {WHEN.map(w => {
              const active = whenDays === w.days && !customDate;
              return (
                <button key={w.label} onClick={() => { setWhenDays(w.days); setCustomDate(''); }} style={{
                  height: 34, borderRadius: 20, border: `1.5px solid ${active ? '#042C53' : '#e5e7eb'}`,
                  background: active ? '#042C53' : '#fff', color: active ? '#fff' : '#374151',
                  fontWeight: active ? 700 : 400, fontSize: 13, cursor: 'pointer', padding: '0 14px',
                }}>{w.label}</button>
              );
            })}
          </div>
          <div>
            <label style={css.label}>Or pick a specific date</label>
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} style={{ ...css.input, width: 'auto' }} />
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', height: 52, borderRadius: 12, border: 'none', cursor: saving ? 'default' : 'pointer',
          background: saving ? '#e5e7eb' : '#c2410c', color: saving ? '#9ca3af' : '#fff',
          fontWeight: 700, fontSize: 16,
        }}>
          {saving ? 'Saving…' : 'Save Contact & Queue Follow-Ups →'}
        </button>
      </div>
    </div>
  );

  // ── Summary phase
  return (
    <div style={css.page}>
      <div style={css.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { reset(); setPhase('form'); }} style={{ background: 'none', border: 'none', color: '#93b4d4', fontSize: 20, cursor: 'pointer', padding: 0 }}>‹</button>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Saved</div>
        </div>
      </div>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '48px 16px 32px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#042C53', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#fff' }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{savedName} saved</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>{followUps.length} follow-up{followUps.length !== 1 ? 's' : ''} queued</div>
        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 40 }}>
          {savedCount} contact{savedCount !== 1 ? 's' : ''} captured · {selectedEvent?.event_name}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => { reset(); setPhase('form'); }} style={{
            height: 50, borderRadius: 12, border: 'none', background: '#042C53', color: '#fff',
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>+ Capture Another Person</button>
          <a href="/networking-assistant-beta-2026" style={{
            height: 50, borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151',
            fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>View Follow-Up Queue →</a>
          <button onClick={() => { reset(); setPhase('select_event'); }} style={{
            background: 'none', border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer', marginTop: 4,
          }}>← Switch Event</button>
        </div>
      </div>
    </div>
  );
}

export default function CaptureFlowPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#6b7280' }}>Loading…</div>}>
      <CaptureFlowInner />
    </Suspense>
  );
}
