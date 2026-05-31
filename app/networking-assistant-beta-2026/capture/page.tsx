'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../src/contexts/AuthContext';
import {
  fetchMyNAEvents,
  createPerson,
  createInteraction,
  createFollowUp,
  type NAEvent,
} from '../../../src/lib/networking-assistant';

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

const FOLLOW_UP_OPTIONS = [
  { value: 'linkedin_connect',  label: '🔗 Connect on LinkedIn' },
  { value: 'linkedin_message',  label: '💬 LinkedIn message' },
  { value: 'email',             label: '✉️ Send an email' },
  { value: 'call',              label: '📞 Give them a call' },
  { value: 'reminder',          label: '🔔 Just remind me' },
];

const WHEN_OPTIONS: { label: string; days: number }[] = [
  { label: 'Tomorrow',    days: 1  },
  { label: 'In 2 days',   days: 2  },
  { label: 'This week',   days: 3  },
  { label: 'Next week',   days: 7  },
  { label: 'In 2 weeks',  days: 14 },
];

function CaptureFlowInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preloadEventId = searchParams.get('event');

  const [myEvents, setMyEvents]           = useState<NAEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NAEvent | null>(null);
  const [phase, setPhase]                 = useState<'select_event' | 'capture_form' | 'summary'>('select_event');

  // Form fields
  const [firstName, setFirstName]         = useState('');
  const [lastName, setLastName]           = useState('');
  const [company, setCompany]             = useState('');
  const [title, setTitle]                 = useState('');
  const [topic, setTopic]                 = useState('');
  const [selectedFollowUps, setSelectedFollowUps] = useState<string[]>(['linkedin_connect']);
  const [whenDays, setWhenDays]           = useState(2);
  const [customDate, setCustomDate]       = useState('');

  const [saving, setSaving]               = useState(false);
  const [savedCount, setSavedCount]       = useState(0);
  const [lastSavedName, setLastSavedName] = useState('');
  const [errors, setErrors]               = useState<string[]>([]);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  // Load events
  useEffect(() => {
    if (!user) return;
    fetchMyNAEvents(user.id).then(({ data }) => {
      if (data) {
        setMyEvents(data);
        if (preloadEventId) {
          const found = data.find(e => e.id === preloadEventId);
          if (found) { setSelectedEvent(found); setPhase('capture_form'); }
        }
      }
    });
  }, [user, preloadEventId]);

  function toggleFollowUp(val: string) {
    setSelectedFollowUps(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  }

  function resetForm() {
    setFirstName(''); setLastName(''); setCompany('');
    setTitle(''); setTopic('');
    setSelectedFollowUps(['linkedin_connect']);
    setWhenDays(2); setCustomDate(''); setErrors([]);
  }

  async function handleSave() {
    const errs: string[] = [];
    if (!firstName.trim()) errs.push('First name is required.');
    if (selectedFollowUps.length === 0) errs.push('Pick at least one follow-up action.');
    if (errs.length > 0) { setErrors(errs); return; }

    setSaving(true);
    const dueDate = customDate || addDays(whenDays);

    const { data: person } = await createPerson({
      user_profile_id: user!.id,
      first_name: firstName.trim(),
      last_name: lastName.trim() || null,
      company: company.trim() || null,
      title: title.trim() || null,
      email: null, phone: null, linkedin_url: null,
      city: selectedEvent?.city ?? null,
      industry: null, tags: null,
      relationship_status: 'warm',
      first_met_event_id: selectedEvent?.id ?? null,
      first_met_date: selectedEvent?.event_date ?? null,
      notes: null, linkedin_connected: false, google_contact_id: null,
    });

    if (person) {
      await createInteraction({
        user_profile_id: user!.id,
        person_id: person.id,
        event_id: selectedEvent!.id,
        interaction_date: selectedEvent!.event_date,
        voice_transcript: null,
        key_topic: topic.trim() || null,
        opportunity_notes: null,
        follow_up_intent: null,
        sentiment: 'positive',
      });

      for (const actionType of selectedFollowUps) {
        await createFollowUp({
          user_profile_id: user!.id,
          person_id: person.id,
          event_id: selectedEvent!.id,
          action_type: actionType as any,
          due_date: dueDate,
          status: 'pending',
          ai_draft_message: null, snooze_until: null,
          completed_at: null, skip_reason: null,
        });
      }

      setLastSavedName(`${firstName.trim()}${lastName.trim() ? ' ' + lastName.trim() : ''}`);
      setSavedCount(c => c + 1);
    }

    setSaving(false);
    setPhase('summary');
  }

  if (loading || !user) return null;

  const s = { fontFamily: 'Inter, sans-serif' };

  // ── Header
  const Header = ({ showBack, onBack }: { showBack?: boolean; onBack?: () => void }) => (
    <div style={{ background: '#0a1628', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 11, color: '#a8b8d4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Networking Assistant</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Capture Contact</div>
      </div>
      {showBack
        ? <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#a8b8d4', fontSize: 13, cursor: 'pointer' }}>← Back</button>
        : <a href="/networking-assistant-beta-2026" style={{ color: '#a8b8d4', fontSize: 13, textDecoration: 'none' }}>← Queue</a>
      }
    </div>
  );

  // ── PHASE: Select event
  if (phase === 'select_event') return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', ...s }}>
      <Header />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>Which event are you at?</div>
        <div style={{ fontSize: 14, color: '#5b6678', marginBottom: 24 }}>Pick from your events or add one first.</div>
        {myEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ color: '#5b6678', marginBottom: 16 }}>No events yet. Add one first.</div>
            <a href="/networking-assistant-beta-2026/events" style={{
              display: 'inline-block', padding: '12px 24px', background: '#0a1628',
              color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600,
            }}>Go to Events →</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myEvents.map(ev => (
              <button key={ev.id} onClick={() => { setSelectedEvent(ev); setPhase('capture_form'); }} style={{
                padding: '14px 16px', borderRadius: 10, border: '1.5px solid #e6e2d6',
                background: '#fff', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontWeight: 600, color: '#0a1628', fontSize: 15 }}>{ev.event_name}</div>
                <div style={{ fontSize: 13, color: '#1652f0', marginTop: 2 }}>{formatDate(ev.event_date)}</div>
                {ev.host_org && <div style={{ fontSize: 12, color: '#5b6678', marginTop: 1 }}>{ev.host_org}</div>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── PHASE: Capture form (all fields on one page)
  if (phase === 'capture_form') return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', ...s }}>
      <Header showBack onBack={() => { resetForm(); setPhase('select_event'); }} />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Event context banner */}
        {selectedEvent && (
          <div style={{ background: '#eef3fe', borderRadius: 8, padding: '10px 14px', marginBottom: 24, fontSize: 13, color: '#1652f0' }}>
            📍 <strong>{selectedEvent.event_name}</strong> · {formatDate(selectedEvent.event_date)}
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
            {errors.map((e, i) => <div key={i} style={{ color: '#dc2626', fontSize: 13 }}>⚠️ {e}</div>)}
          </div>
        )}

        {/* Contact fields */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e6e2d6', padding: '20px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#5b6678', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Contact Info</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>First Name *</label>
              <input autoFocus value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder="Sarah"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${!firstName.trim() && errors.length > 0 ? '#fca5a5' : '#e6e2d6'}`, fontSize: 15, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)}
                placeholder="Johnson"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e6e2d6', fontSize: 15, boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>Company</label>
            <input value={company} onChange={e => setCompany(e.target.value)}
              placeholder="Acme Corp"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e6e2d6', fontSize: 15, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>Title / Role</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="VP of Sales"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e6e2d6', fontSize: 15, boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Topic */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e6e2d6', padding: '20px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#5b6678', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>What did you talk about?</div>
          <textarea value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="e.g. They're looking for a CRM solution, interested in real estate tech..."
            rows={3}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e6e2d6', fontSize: 14, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
        </div>

        {/* Follow-ups — multi select */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e6e2d6', padding: '20px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#5b6678', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Follow-Up Actions</div>
          <div style={{ fontSize: 12, color: '#5b6678', marginBottom: 14 }}>Select all that apply</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FOLLOW_UP_OPTIONS.map(opt => {
              const selected = selectedFollowUps.includes(opt.value);
              return (
                <button key={opt.value} onClick={() => toggleFollowUp(opt.value)} style={{
                  padding: '12px 14px', borderRadius: 8, border: '2px solid', cursor: 'pointer', textAlign: 'left',
                  borderColor: selected ? '#0a1628' : '#e6e2d6',
                  background: selected ? '#0a1628' : '#fff',
                  color: selected ? '#fff' : '#1f2a3d',
                  fontWeight: selected ? 600 : 400, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  {opt.label}
                  {selected && <span style={{ fontSize: 16 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* When */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e6e2d6', padding: '20px 16px', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#5b6678', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>When to Follow Up</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {WHEN_OPTIONS.map(opt => {
              const active = whenDays === opt.days && !customDate;
              return (
                <button key={opt.label} onClick={() => { setWhenDays(opt.days); setCustomDate(''); }} style={{
                  padding: '8px 16px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer',
                  borderColor: active ? '#0a1628' : '#e6e2d6',
                  background: active ? '#0a1628' : '#fff',
                  color: active ? '#fff' : '#1f2a3d',
                  fontWeight: active ? 600 : 400, fontSize: 13,
                }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#5b6678', marginBottom: 4 }}>Or pick a specific date</label>
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e6e2d6', fontSize: 14 }} />
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', padding: '16px', borderRadius: 12, border: 'none',
          background: saving ? '#e6e2d6' : '#c2410c',
          color: saving ? '#5b6678' : '#fff',
          fontWeight: 700, fontSize: 17, cursor: saving ? 'default' : 'pointer',
        }}>
          {saving ? 'Saving…' : 'Save Contact & Queue Follow-Ups →'}
        </button>
      </div>
    </div>
  );

  // ── PHASE: Summary
  if (phase === 'summary') return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', ...s }}>
      <Header showBack onBack={() => { resetForm(); setPhase('capture_form'); }} />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '48px 16px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>{lastSavedName} saved</div>
        <div style={{ fontSize: 14, color: '#5b6678', marginBottom: 8 }}>
          {selectedFollowUps.length} follow-up{selectedFollowUps.length !== 1 ? 's' : ''} queued
        </div>
        <div style={{ fontSize: 13, color: '#a8b8d4', marginBottom: 40 }}>
          {savedCount} contact{savedCount !== 1 ? 's' : ''} captured at {selectedEvent?.event_name}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => { resetForm(); setPhase('capture_form'); }} style={{
            width: '100%', padding: '15px', borderRadius: 12, border: 'none',
            background: '#0a1628', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}>+ Capture Another Person</button>

          <a href="/networking-assistant-beta-2026" style={{
            display: 'block', padding: '15px', borderRadius: 12,
            border: '1.5px solid #e6e2d6', background: '#fff', color: '#1f2a3d',
            fontWeight: 600, fontSize: 15, textDecoration: 'none', textAlign: 'center',
          }}>View Follow-Up Queue →</a>

          <button onClick={() => { resetForm(); setPhase('select_event'); }} style={{
            background: 'none', border: 'none', color: '#5b6678', fontSize: 13, cursor: 'pointer', paddingTop: 8,
          }}>← Switch Event</button>
        </div>
      </div>
    </div>
  );

  return null;
}

export default function CaptureFlowPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#fafaf7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#5b6678' }}>
        Loading…
      </div>
    }>
      <CaptureFlowInner />
    </Suspense>
  );
}
