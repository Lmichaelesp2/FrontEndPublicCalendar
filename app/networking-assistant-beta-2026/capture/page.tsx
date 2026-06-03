'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../src/contexts/AuthContext';
import {
  fetchMyNAEvents, createNAEvent, createPerson, createInteraction, createFollowUp, type NAEvent,
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
const EVENT_TYPES = ['chamber','mixer','conference','startup','informal','coffee','other'] as const;
const CITIES = ['San Antonio','Austin','Dallas','Houston'] as const;

const css = {
  page:   { minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Inter, -apple-system, sans-serif' } as React.CSSProperties,
  header: { background: '#042C53', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 } as React.CSSProperties,
  card:   { background: '#fff', borderRadius: 12, padding: '16px', marginBottom: 12 } as React.CSSProperties,
  label:  { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input:  { width: '100%', padding: '11px 13px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, boxSizing: 'border-box' as const, fontFamily: 'Inter, sans-serif', color: '#111827', outline: 'none' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
};

function CaptureFlowInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preloadEventId = searchParams.get('event');

  const [myEvents, setMyEvents]           = useState<NAEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NAEvent | null>(null);
  const [phase, setPhase]                 = useState<'form' | 'summary'>('form');
  const [savedPersonId, setSavedPersonId] = useState<string | null>(null);

  // Inline event picker state
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showNewEvent, setShowNewEvent]   = useState(false);
  const [newEventName, setNewEventName]   = useState('');
  const [newEventDate, setNewEventDate]   = useState(new Date().toISOString().split('T')[0]);
  const [newEventCity, setNewEventCity]   = useState('San Antonio');
  const [creatingEvent, setCreatingEvent] = useState(false);

  // Contact fields
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [company, setCompany]       = useState('');
  const [title, setTitle]           = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [topic, setTopic]           = useState('');
  const [gotCard, setGotCard]       = useState(false);
  const [followUps, setFollowUps]   = useState<string[]>(['linkedin_connect']);
  const [whenDays, setWhenDays]     = useState(2);
  const [customDate, setCustomDate] = useState('');
  const [saving, setSaving]         = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [savedName, setSavedName]   = useState('');
  const [errors, setErrors]         = useState<string[]>([]);

  // Voice capture
  const [voiceState, setVoiceState]       = useState<'idle' | 'listening' | 'parsing'>('idle');
  const [voiceMode, setVoiceMode]         = useState<'full' | 'followup'>('full');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError]       = useState('');
  const recognitionRef                    = useRef<any>(null);

  // Photo capture
  const [photoState, setPhotoState]       = useState<'idle' | 'parsing'>('idle');
  const [photoPreview, setPhotoPreview]   = useState<string | null>(null);
  const [photoError, setPhotoError]       = useState('');
  const photoInputRef                     = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!loading && !user) router.push('/'); }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchMyNAEvents(user.id).then(({ data }) => {
      if (data) {
        setMyEvents(data);
        // Priority 1: URL param (coming from a specific event's Capture button)
        if (preloadEventId) {
          const found = data.find(e => e.id === preloadEventId);
          if (found) { setSelectedEvent(found); return; }
        }
        // Default: no event pre-selected — open picker
        setShowEventPicker(true);
      }
    });
  }, [user, preloadEventId]);

  async function handleCreateEvent() {
    if (!user || !newEventName.trim()) return;
    setCreatingEvent(true);
    const { data } = await createNAEvent({
      user_profile_id: user.id, source: 'manual', lbc_event_id: null,
      event_name: newEventName.trim(), event_date: newEventDate,
      event_type: 'other', host_org: null, location_name: null,
      city: newEventCity, description: null, user_goal: null, user_rating: null, user_debrief_notes: null,
    });
    setCreatingEvent(false);
    if (data) {
      setMyEvents(p => [data, ...p]);
      setSelectedEvent(data);
      setShowNewEvent(false);
      setNewEventName('');
      setShowNewEvent(false);
      setShowEventPicker(false);
    }
  }

  function toggle(val: string) {
    setFollowUps(p => p.includes(val) ? p.filter(v => v !== val) : [...p, val]);
  }

  function reset() {
    setFirstName(''); setLastName(''); setCompany(''); setTitle('');
    setEmail(''); setPhone(''); setTopic(''); setGotCard(false);
    setLinkedinUrl(''); setFollowUps(['linkedin_connect']); setWhenDays(2); setCustomDate(''); setErrors([]);
    setSavedPersonId(null);
    setVoiceTranscript(''); setVoiceError(''); setVoiceState('idle');
    setPhotoPreview(null); setPhotoError(''); setPhotoState('idle');
    setShowEventPicker(false); setShowNewEvent(false);
  }

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Voice not supported in this browser. Try Chrome.');
      return;
    }
    setVoiceError('');
    setVoiceTranscript('');
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';
    recognition.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += t + ' ';
        else interim = t;
      }
      setVoiceTranscript((finalTranscript + interim).trim());
    };
    recognition.onerror = (e: any) => {
      setVoiceError('Mic error: ' + e.error);
      setVoiceState('idle');
    };
    recognition.onend = () => {
      if (finalTranscript.trim()) {
        parseTranscript(finalTranscript.trim(), voiceMode);
      } else {
        setVoiceState('idle');
      }
    };
    recognition.start();
    setVoiceState('listening');
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  async function parseTranscript(transcript: string, mode: 'full' | 'followup') {
    setVoiceState('parsing');
    try {
      const res = await fetch('/api/na-voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.fields) {
        const f = data.fields;
        if (mode === 'full') {
          if (f.first_name)  setFirstName(f.first_name);
          if (f.last_name)   setLastName(f.last_name);
          if (f.company)     setCompany(f.company);
          if (f.title)       setTitle(f.title);
          if (f.email)       setEmail(f.email);
          if (f.phone)       setPhone(f.phone);
        }
        // Always fill follow-up fields
        if (f.topic)            setTopic(f.topic);
        if (f.follow_up_action) setFollowUps([f.follow_up_action]);
        if (f.follow_up_days)   { setWhenDays(f.follow_up_days); setCustomDate(''); }
      } else {
        setVoiceError('Could not parse — edit fields below.');
      }
    } catch {
      setVoiceError('Parse failed — edit fields below.');
    }
    setVoiceState('idle');
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');

    // Preview
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      setPhotoState('parsing');

      // Strip the data:image/...;base64, prefix
      const [meta, base64] = dataUrl.split(',');
      const mediaType = meta.match(/data:(.*);base64/)?.[1] ?? 'image/jpeg';

      try {
        const res = await fetch('/api/na-photo-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mediaType }),
        });
        const data = await res.json();
        if (data.fields) {
          const f = data.fields;
          if (f.first_name)   setFirstName(f.first_name);
          if (f.last_name)    setLastName(f.last_name);
          if (f.company)      setCompany(f.company);
          if (f.title)        setTitle(f.title);
          if (f.email)        setEmail(f.email);
          if (f.phone)        setPhone(f.phone);
          if (f.linkedin_url) setLinkedinUrl(f.linkedin_url);
          if (f.topic)        setTopic(f.topic);
        } else {
          setPhotoError('Could not read image — fill in manually.');
        }
      } catch {
        setPhotoError('Photo parse failed — fill in manually.');
      }
      setPhotoState('idle');
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    const errs: string[] = [];
    if (!firstName.trim()) errs.push('First name is required.');
    if (followUps.length === 0) errs.push('Select at least one follow-up.');
    if (errs.length) { setErrors(errs); return; }
    setSaving(true);
    const due = customDate || addDays(whenDays);

    // Build notes: include "Got business card" flag if checked
    const notes = gotCard ? 'Business card received — fill in details later.' : null;

    const { data: person } = await createPerson({
      user_profile_id: user!.id,
      first_name: firstName.trim(), last_name: lastName.trim() || null,
      company: company.trim() || null, title: title.trim() || null,
      email: email.trim() || null, phone: phone.trim() || null,
      linkedin_url: linkedinUrl.trim() || null, city: selectedEvent?.city ?? null,
      industry: null, tags: null, relationship_status: 'warm',
      first_met_event_id: selectedEvent?.id ?? null,
      first_met_date: selectedEvent?.event_date ?? null,
      notes, linkedin_connected: false, google_contact_id: null,
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
      setSavedPersonId(person.id);
      setSavedCount(c => c + 1);
    }
    setSaving(false);
    setPhase('summary');
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#6b7280' }}>
      Loading…
    </div>
  );
  if (!user) { router.push('/networking-assistant-beta-2026'); return null; }

  // ── Header
  const Header = ({ onBack }: { onBack: () => void }) => (
    <div style={css.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#93b4d4', fontSize: 20, cursor: 'pointer', padding: 0 }}>‹</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Capture Contact</div>
      </div>
      {selectedEvent && phase === 'form' && (
        <div style={{ fontSize: 11, color: '#93b4d4', maxWidth: 160, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
          {selectedEvent.event_name}
        </div>
      )}
    </div>
  );

  // ── PHASE: Capture form (no separate event selection screen)
  if (phase === 'form') return (
    <div style={css.page}>
      <Header onBack={() => router.push('/networking-assistant-beta-2026')} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 48px' }}>

        {/* Inline Event Selector */}
        {showNewEvent ? (
          <div style={{ ...css.card, marginBottom: 12, border: '1.5px solid #e0e7ff' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>New Event</div>
            <div style={{ marginBottom: 10 }}>
              <label style={css.label}>Event Name *</label>
              <input autoFocus value={newEventName} onChange={e => setNewEventName(e.target.value)}
                placeholder="e.g. SA Chamber Monthly Mixer"
                onKeyDown={e => e.key === 'Enter' && handleCreateEvent()}
                style={css.input} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={css.label}>Date</label>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} style={css.input} />
              </div>
              <div>
                <label style={css.label}>City</label>
                <select value={newEventCity} onChange={e => setNewEventCity(e.target.value)} style={css.input}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCreateEvent} disabled={!newEventName.trim() || creatingEvent} style={{
                flex: 1, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: newEventName.trim() ? '#042C53' : '#e5e7eb',
                color: newEventName.trim() ? '#fff' : '#9ca3af', fontWeight: 700, fontSize: 13,
              }}>{creatingEvent ? 'Creating…' : 'Create Event'}</button>
              <button onClick={() => setShowNewEvent(false)} style={{
                height: 40, padding: '0 14px', borderRadius: 8, border: '1px solid #e5e7eb',
                background: '#fff', color: '#6b7280', fontSize: 13, cursor: 'pointer',
              }}>Cancel</button>
            </div>
          </div>
        ) : showEventPicker ? (
          <div style={{ ...css.card, marginBottom: 12, border: '1.5px solid #e0e7ff' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Select Event</div>
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const todayEvs = myEvents.filter(e => e.event_date === today);
              const otherEvs = myEvents.filter(e => e.event_date !== today);
              return (
                <>
                  {todayEvs.map(ev => (
                    <button key={ev.id} onClick={() => { setSelectedEvent(ev); setShowEventPicker(false); }} style={{
                      width: '100%', background: '#fff7ed', borderRadius: 8, border: '1.5px solid #fed7aa',
                      padding: '10px 12px', cursor: 'pointer', textAlign: 'left' as const, marginBottom: 6,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{ev.event_name}</div>
                      <div style={{ fontSize: 11, color: '#c2410c', fontWeight: 600 }}>Today</div>
                    </button>
                  ))}
                  {otherEvs.map(ev => (
                    <button key={ev.id} onClick={() => { setSelectedEvent(ev); setShowEventPicker(false); }} style={{
                      width: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb',
                      padding: '10px 12px', cursor: 'pointer', textAlign: 'left' as const, marginBottom: 6,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{ev.event_name}</div>
                      <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 500 }}>{formatDate(ev.event_date)}</div>
                    </button>
                  ))}
                  <button onClick={() => { setShowEventPicker(false); setShowNewEvent(true); }} style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px dashed #6b7280',
                    background: '#fff', color: '#6b7280', fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' as const, marginBottom: 6,
                  }}>+ Create new event</button>
                  <button onClick={() => { setSelectedEvent(null); setShowEventPicker(false); }} style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
                    background: '#fff', color: '#9ca3af', fontWeight: 500, fontSize: 13, cursor: 'pointer', textAlign: 'left' as const,
                  }}>No specific event</button>
                  <button onClick={() => setShowEventPicker(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', marginTop: 6, padding: 0 }}>Cancel</button>
                </>
              );
            })()}
          </div>
        ) : (
          /* Event context chip — always visible, tappable to change */
          <button onClick={() => setShowEventPicker(true)} style={{
            width: '100%', background: selectedEvent ? '#eff6ff' : '#f9fafb',
            border: `1.5px solid ${selectedEvent ? '#bfdbfe' : '#e5e7eb'}`,
            borderRadius: 8, padding: '9px 14px', marginBottom: 14, cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' as const,
          }}>
            <span style={{ fontSize: 13, color: selectedEvent ? '#1d4ed8' : '#9ca3af', fontWeight: 500 }}>
              {selectedEvent ? `📍 ${selectedEvent.event_name}` : '📍 Tap to select event (optional)'}
            </span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>change</span>
          </button>
        )}

        {/* Quick Capture */}
        <div style={{ ...css.card, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Quick Capture</div>

          {/* Three method buttons */}
          {voiceState === 'idle' && photoState === 'idle' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: photoPreview ? 10 : 0 }}>
              {/* Voice — full */}
              <button onClick={() => { setVoiceMode('full'); startListening(); }} style={{
                height: 52, borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              }}>
                <span style={{ fontSize: 20 }}>🎤</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>Voice</span>
              </button>

              {/* Photo */}
              <button onClick={() => photoInputRef.current?.click()} style={{
                height: 52, borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              }}>
                <span style={{ fontSize: 20 }}>📷</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>Photo</span>
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} style={{ display: 'none' }} />

              {/* Manual (scroll down) */}
              <button onClick={() => document.getElementById('contact-fields')?.scrollIntoView({ behavior: 'smooth' })} style={{
                height: 52, borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              }}>
                <span style={{ fontSize: 20 }}>✏️</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>Manual</span>
              </button>
            </div>
          )}

          {/* Listening state */}
          {voiceState === 'listening' && (
            <div>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#c2410c', marginBottom: 4 }}>🔴 Listening…</div>
                {voiceMode === 'full' ? (
                  <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                    Name · Company & title · Email & phone · What you talked about · Follow-up action · When
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                    What you talked about · Follow-up action (LinkedIn/email/call) · When (tomorrow, 2 days, next week…)
                  </div>
                )}
                {voiceTranscript && <div style={{ fontSize: 11, color: '#6b7280', fontStyle: 'italic', marginTop: 6 }}>{voiceTranscript}</div>}
              </div>
              <button onClick={stopListening} style={{
                width: '100%', height: 40, borderRadius: 8, border: 'none', background: '#dc2626',
                color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>Stop Recording</button>
            </div>
          )}

          {/* Parsing */}
          {(voiceState === 'parsing' || photoState === 'parsing') && (
            <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 13, color: '#6b7280' }}>
              {voiceState === 'parsing' ? 'Reading your voice…' : 'Reading image…'}
            </div>
          )}

          {/* Photo preview */}
          {photoPreview && photoState === 'idle' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: voiceState === 'idle' ? 0 : 8 }}>
              <img src={photoPreview} alt="Captured" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                {photoError
                  ? <div style={{ fontSize: 12, color: '#dc2626' }}>⚠ {photoError}</div>
                  : <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>✓ Photo read — review fields below</div>
                }
                <button onClick={() => { setPhotoPreview(null); setPhotoError(''); if (photoInputRef.current) photoInputRef.current.value = ''; }} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 11, cursor: 'pointer', padding: 0 }}>Remove</button>
              </div>
            </div>
          )}

          {/* After photo — offer voice for follow-up only */}
          {photoPreview && photoState === 'idle' && !photoError && voiceState === 'idle' && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
              <button onClick={() => { setVoiceMode('followup'); startListening(); }} style={{
                flex: 1, height: 36, borderRadius: 8, border: '1.5px solid #042C53', background: '#fff',
                color: '#042C53', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>🎤 Add follow-up by voice</button>
              <button onClick={() => { setVoiceMode('full'); startListening(); }} style={{
                flex: 1, height: 36, borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff',
                color: '#6b7280', fontWeight: 600, fontSize: 12, cursor: 'pointer',
              }}>🎤 Re-record everything</button>
            </div>
          )}

          {/* Success / error states */}
          {voiceTranscript && voiceState === 'idle' && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#15803d', fontWeight: 600 }}>
              ✓ {voiceMode === 'followup' ? 'Follow-up added' : 'Fields filled'} — review and edit below
            </div>
          )}
          {voiceError && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>⚠ {voiceError}</div>}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
            {errors.map((e, i) => <div key={i} style={{ fontSize: 13, color: '#dc2626' }}>⚠ {e}</div>)}
          </div>
        )}

        {/* Contact info */}
        <div id="contact-fields" style={css.card}>
          <div style={css.sectionTitle}>Contact Info</div>
          <div style={{ marginBottom: 10 }}>
            <label style={css.label}>LinkedIn Profile URL</label>
            <input
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/sarahjohnson"
              style={{ ...css.input, borderColor: '#e0e7ff' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={css.label}>First Name *</label>
              <input autoFocus value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sarah"
                style={{ ...css.input, borderColor: !firstName.trim() && errors.length ? '#fca5a5' : '#e5e7eb' }} />
            </div>
            <div>
              <label style={css.label}>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Johnson" style={css.input} />
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={css.label}>Company</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" style={css.input} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={css.label}>Title / Role</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VP of Sales" style={css.input} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
            <div>
              <label style={css.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@acme.com" style={css.input} />
            </div>
            <div>
              <label style={css.label}>Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="210-555-0100" style={css.input} />
            </div>
          </div>
        </div>

        {/* Topic */}
        <div style={css.card}>
          <div style={css.sectionTitle}>What did you talk about?</div>
          <textarea value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="Key topics, opportunities, anything to remember…"
            rows={3} style={{ ...css.input, resize: 'vertical' as const }} />

          {/* Business card checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={gotCard} onChange={e => setGotCard(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#042C53' }} />
            <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Got their business card — fill in details later</span>
          </label>
        </div>

        {/* Follow-ups */}
        <div style={css.card}>
          <div style={css.sectionTitle}>Follow-Up Actions · select all that apply</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FOLLOW_UPS.map(opt => {
              const sel = followUps.includes(opt.value);
              return (
                <button key={opt.value} onClick={() => toggle(opt.value)} style={{
                  height: 44, borderRadius: 8, border: `2px solid ${sel ? '#042C53' : '#e5e7eb'}`,
                  background: sel ? '#042C53' : '#fff', color: sel ? '#fff' : '#374151',
                  fontWeight: sel ? 700 : 400, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px',
                }}>
                  {opt.label}
                  {sel && <span>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* When */}
        <div style={css.card}>
          <div style={css.sectionTitle}>When to Follow Up</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 12 }}>
            {WHEN.map(w => {
              const active = whenDays === w.days && !customDate;
              return (
                <button key={w.label} onClick={() => { setWhenDays(w.days); setCustomDate(''); }} style={{
                  height: 32, borderRadius: 20, border: `1.5px solid ${active ? '#042C53' : '#e5e7eb'}`,
                  background: active ? '#042C53' : '#fff', color: active ? '#fff' : '#374151',
                  fontWeight: active ? 700 : 400, fontSize: 12, cursor: 'pointer', padding: '0 14px',
                }}>{w.label}</button>
              );
            })}
          </div>
          <div>
            <label style={css.label}>Or pick a specific date</label>
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} style={{ ...css.input, width: 'auto' }} />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', height: 50, borderRadius: 12, border: 'none',
          background: saving ? '#e5e7eb' : '#c2410c', color: saving ? '#9ca3af' : '#fff',
          fontWeight: 700, fontSize: 16, cursor: saving ? 'default' : 'pointer',
        }}>
          {saving ? 'Saving…' : 'Save Contact & Queue Follow-Ups →'}
        </button>
      </div>
    </div>
  );

  // ── PHASE: Summary
  return (
    <div style={css.page}>
      <Header onBack={() => { reset(); setPhase('form'); }} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px 32px', textAlign: 'center' }}>

        {/* Session counter banner */}
        <div style={{ background: '#042C53', borderRadius: 12, padding: '12px 16px', marginBottom: 24, textAlign: 'left' }}>
          <div style={{ fontSize: 12, color: '#93b4d4', marginBottom: 2 }}>{selectedEvent?.event_name}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
            {savedCount} {savedCount === 1 ? 'person' : 'people'} captured
          </div>
          <div style={{ fontSize: 12, color: '#93b4d4', marginTop: 2 }}>Keep going — tap below to add the next person</div>
        </div>

        {/* Last saved confirmation */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#15803d', fontWeight: 700, marginBottom: 2 }}>✓ {savedName} saved</div>
          <div style={{ fontSize: 12, color: '#374151' }}>{followUps.length} follow-up{followUps.length !== 1 ? 's' : ''} queued</div>
          {gotCard && <div style={{ fontSize: 12, color: '#d97706', marginTop: 4 }}>🃏 Business card — fill in details later</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* PRIMARY — capture next person */}
          <button onClick={() => { reset(); setPhase('form'); }} style={{
            height: 54, borderRadius: 12, border: 'none', background: '#c2410c',
            color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
          }}>+ Capture Next Person →</button>

          {savedPersonId && (
            <a href={`/networking-assistant-beta-2026/persons/${savedPersonId}`} style={{
              height: 44, borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff',
              color: '#1652f0', fontWeight: 600, fontSize: 14, textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>View {savedName}'s Record →</a>
          )}

          <a href="/networking-assistant-beta-2026" style={{
            height: 44, borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff',
            color: '#374151', fontWeight: 600, fontSize: 14, textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>Done — View Follow-Up Queue</a>

          <button onClick={() => { reset(); setShowEventPicker(true); }} style={{
            background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', marginTop: 2,
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
