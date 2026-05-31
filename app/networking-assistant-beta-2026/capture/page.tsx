'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../src/contexts/AuthContext';
import {
  fetchMyNAEvents,
  createPerson,
  createInteraction,
  createFollowUp,
  type NAEvent,
} from '../../../src/lib/networking-assistant';

// ─── Step definitions ─────────────────────────────────────────────────────────
type Step = 'select_event' | 'first_name' | 'last_name' | 'company' | 'title' | 'topic' | 'followup' | 'followup_date' | 'summary';

const FOLLOW_UP_DAYS: Record<string, number> = {
  'Tomorrow': 1,
  'In 2 days': 2,
  'This week': 3,
  'Next week': 7,
  'In 2 weeks': 14,
};

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

export default function CaptureFlowPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preloadEventId = searchParams.get('event');

  const [myEvents, setMyEvents]       = useState<NAEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NAEvent | null>(null);
  const [step, setStep]               = useState<Step>('select_event');
  const [saving, setSaving]           = useState(false);
  const [savedCount, setSavedCount]   = useState(0);

  // Per-person capture state
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [company, setCompany]         = useState('');
  const [title, setTitle]             = useState('');
  const [topic, setTopic]             = useState('');
  const [followUpType, setFollowUpType] = useState('linkedin_connect');
  const [followUpWhen, setFollowUpWhen] = useState('In 2 days');
  const [customDate, setCustomDate]   = useState('');

  // ── Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  // ── Load user's events
  useEffect(() => {
    if (!user) return;
    fetchMyNAEvents(user.id).then(({ data }) => {
      if (data) {
        setMyEvents(data);
        if (preloadEventId) {
          const found = data.find(e => e.id === preloadEventId);
          if (found) { setSelectedEvent(found); setStep('first_name'); }
        }
      }
    });
  }, [user, preloadEventId]);

  function resetPerson() {
    setFirstName(''); setLastName(''); setCompany('');
    setTitle(''); setTopic(''); setFollowUpType('linkedin_connect');
    setFollowUpWhen('In 2 days'); setCustomDate('');
  }

  async function savePerson() {
    if (!user || !selectedEvent) return;
    setSaving(true);

    const dueDate = customDate || addDays(FOLLOW_UP_DAYS[followUpWhen] ?? 2);

    // 1. Create person
    const { data: person } = await createPerson({
      user_profile_id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim() || null,
      company: company.trim() || null,
      title: title.trim() || null,
      email: null, phone: null, linkedin_url: null,
      city: selectedEvent.city,
      industry: null, tags: null,
      relationship_status: 'warm',
      first_met_event_id: selectedEvent.id,
      first_met_date: selectedEvent.event_date,
      notes: null, linkedin_connected: false, google_contact_id: null,
    });

    if (person) {
      // 2. Create interaction
      await createInteraction({
        user_profile_id: user.id,
        person_id: person.id,
        event_id: selectedEvent.id,
        interaction_date: selectedEvent.event_date,
        voice_transcript: null,
        key_topic: topic.trim() || null,
        opportunity_notes: null,
        follow_up_intent: null,
        sentiment: 'positive',
      });

      // 3. Always create LinkedIn connect follow-up
      await createFollowUp({
        user_profile_id: user.id,
        person_id: person.id,
        event_id: selectedEvent.id,
        action_type: 'linkedin_connect',
        due_date: addDays(1),
        status: 'pending',
        ai_draft_message: null, snooze_until: null,
        completed_at: null, skip_reason: null,
      });

      // 4. Create additional follow-up if different type chosen
      if (followUpType !== 'linkedin_connect') {
        await createFollowUp({
          user_profile_id: user.id,
          person_id: person.id,
          event_id: selectedEvent.id,
          action_type: followUpType as any,
          due_date: dueDate,
          status: 'pending',
          ai_draft_message: null, snooze_until: null,
          completed_at: null, skip_reason: null,
        });
      }

      setSavedCount(c => c + 1);
    }

    setSaving(false);
    setStep('summary');
  }

  if (loading || !user) return null;

  // ── Shared card wrapper
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#0a1628', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: '#a8b8d4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Networking Assistant</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Capture Contact</div>
        </div>
        <a href="/networking-assistant-beta-2026" style={{ color: '#a8b8d4', fontSize: 13, textDecoration: 'none' }}>← Queue</a>
      </div>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 16px' }}>
        {selectedEvent && step !== 'select_event' && (
          <div style={{ background: '#eef3fe', borderRadius: 8, padding: '10px 14px', marginBottom: 24, fontSize: 13, color: '#1652f0' }}>
            📍 <strong>{selectedEvent.event_name}</strong> · {formatDate(selectedEvent.event_date)}
          </div>
        )}
        {children}
      </div>
    </div>
  );

  const InputCard = ({ question, value, onChange, onNext, onSkip, placeholder, autoFocus = true }: {
    question: string; value: string; onChange: (v: string) => void;
    onNext: () => void; onSkip?: () => void; placeholder?: string; autoFocus?: boolean;
  }) => (
    <Card>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628', marginBottom: 24, lineHeight: 1.3 }}>{question}</div>
      <input
        autoFocus={autoFocus}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onNext(); }}
        style={{ width: '100%', padding: '14px 16px', fontSize: 18, borderRadius: 10, border: '2px solid #e6e2d6', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
      />
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onNext} disabled={!value.trim()} style={{
          flex: 1, padding: '14px', borderRadius: 10, border: 'none', cursor: value.trim() ? 'pointer' : 'default',
          background: value.trim() ? '#0a1628' : '#e6e2d6', color: value.trim() ? '#fff' : '#5b6678',
          fontWeight: 700, fontSize: 16,
        }}>Next →</button>
        {onSkip && (
          <button onClick={onSkip} style={{
            padding: '14px 20px', borderRadius: 10, border: '1.5px solid #e6e2d6',
            background: '#fff', color: '#5b6678', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>Skip</button>
        )}
      </div>
    </Card>
  );

  // ─── Steps ────────────────────────────────────────────────────────────────

  // STEP: Select event
  if (step === 'select_event') return (
    <Card>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>Which event are you at?</div>
      <div style={{ fontSize: 14, color: '#5b6678', marginBottom: 24 }}>Pick from your events or go add one first.</div>
      {myEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ color: '#5b6678', marginBottom: 16 }}>No events yet. Add one first.</div>
          <a href="/networking-assistant-beta-2026/events" style={{
            display: 'inline-block', padding: '12px 24px', background: '#0a1628', color: '#fff',
            borderRadius: 10, textDecoration: 'none', fontWeight: 600,
          }}>Go to Events →</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myEvents.map(ev => (
            <button key={ev.id} onClick={() => { setSelectedEvent(ev); setStep('first_name'); }} style={{
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
    </Card>
  );

  // STEP: First name
  if (step === 'first_name') return (
    <InputCard
      question="Who did you meet? First name."
      value={firstName} onChange={setFirstName}
      placeholder="e.g. Sarah"
      onNext={() => setStep('last_name')}
    />
  );

  // STEP: Last name
  if (step === 'last_name') return (
    <InputCard
      question={`${firstName}'s last name?`}
      value={lastName} onChange={setLastName}
      placeholder="e.g. Johnson"
      onNext={() => setStep('company')}
      onSkip={() => setStep('company')}
    />
  );

  // STEP: Company
  if (step === 'company') return (
    <InputCard
      question={`What company is ${firstName} with?`}
      value={company} onChange={setCompany}
      placeholder="e.g. Acme Corp"
      onNext={() => setStep('title')}
      onSkip={() => setStep('title')}
    />
  );

  // STEP: Title
  if (step === 'title') return (
    <InputCard
      question={`What's ${firstName}'s role or title?`}
      value={title} onChange={setTitle}
      placeholder="e.g. VP of Sales"
      onNext={() => setStep('topic')}
      onSkip={() => setStep('topic')}
    />
  );

  // STEP: Topic
  if (step === 'topic') return (
    <InputCard
      question={`What did you talk about with ${firstName}?`}
      value={topic} onChange={setTopic}
      placeholder="e.g. They're looking for a CRM solution"
      onNext={() => setStep('followup')}
      onSkip={() => setStep('followup')}
    />
  );

  // STEP: Follow-up type
  if (step === 'followup') return (
    <Card>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628', marginBottom: 24 }}>What's the follow-up with {firstName}?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { value: 'linkedin_connect', label: '🔗 Connect on LinkedIn' },
          { value: 'linkedin_message', label: '💬 Send LinkedIn message' },
          { value: 'email', label: '✉️ Send an email' },
          { value: 'call', label: '📞 Give them a call' },
          { value: 'reminder', label: '🔔 Just remind me about them' },
        ].map(opt => (
          <button key={opt.value} onClick={() => setFollowUpType(opt.value)} style={{
            padding: '14px 16px', borderRadius: 10, border: '2px solid', cursor: 'pointer', textAlign: 'left',
            borderColor: followUpType === opt.value ? '#0a1628' : '#e6e2d6',
            background: followUpType === opt.value ? '#0a1628' : '#fff',
            color: followUpType === opt.value ? '#fff' : '#1f2a3d',
            fontWeight: followUpType === opt.value ? 600 : 400, fontSize: 15,
          }}>{opt.label}</button>
        ))}
      </div>
      <button onClick={() => setStep('followup_date')} style={{
        width: '100%', padding: '14px', borderRadius: 10, border: 'none',
        background: '#0a1628', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
      }}>Next →</button>
    </Card>
  );

  // STEP: Follow-up date
  if (step === 'followup_date') return (
    <Card>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628', marginBottom: 24 }}>When should you follow up?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {Object.keys(FOLLOW_UP_DAYS).map(when => (
          <button key={when} onClick={() => { setFollowUpWhen(when); setCustomDate(''); }} style={{
            padding: '14px 16px', borderRadius: 10, border: '2px solid', cursor: 'pointer', textAlign: 'left',
            borderColor: followUpWhen === when && !customDate ? '#0a1628' : '#e6e2d6',
            background: followUpWhen === when && !customDate ? '#0a1628' : '#fff',
            color: followUpWhen === when && !customDate ? '#fff' : '#1f2a3d',
            fontWeight: followUpWhen === when && !customDate ? 600 : 400, fontSize: 15,
          }}>{when}</button>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: '#5b6678', display: 'block', marginBottom: 6 }}>Or pick a specific date</label>
        <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1.5px solid #e6e2d6', fontSize: 15, boxSizing: 'border-box' }} />
      </div>
      <button onClick={savePerson} disabled={saving} style={{
        width: '100%', padding: '14px', borderRadius: 10, border: 'none',
        background: saving ? '#e6e2d6' : '#c2410c', color: saving ? '#5b6678' : '#fff',
        fontWeight: 700, fontSize: 16, cursor: saving ? 'default' : 'pointer',
      }}>
        {saving ? 'Saving…' : `Save ${firstName} →`}
      </button>
    </Card>
  );

  // STEP: Summary
  if (step === 'summary') return (
    <Card>
      <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>
          {firstName} {lastName} saved
        </div>
        <div style={{ fontSize: 14, color: '#5b6678', marginBottom: 32 }}>
          LinkedIn connect queued for tomorrow. Follow-up scheduled.
        </div>
        <div style={{ fontSize: 13, color: '#a8b8d4', marginBottom: 24 }}>
          {savedCount} contact{savedCount !== 1 ? 's' : ''} captured at {selectedEvent?.event_name}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => { resetPerson(); setStep('first_name'); }} style={{
          width: '100%', padding: '14px', borderRadius: 10, border: 'none',
          background: '#0a1628', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>+ Capture Another Person</button>
        <a href="/networking-assistant-beta-2026" style={{
          display: 'block', width: '100%', padding: '14px', borderRadius: 10,
          border: '1.5px solid #e6e2d6', background: '#fff', color: '#1f2a3d',
          fontWeight: 600, fontSize: 15, textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box',
        }}>View Follow-Up Queue</a>
        <a href="/networking-assistant-beta-2026/events" style={{
          display: 'block', textAlign: 'center', color: '#5b6678', fontSize: 13,
          textDecoration: 'none', paddingTop: 8,
        }}>← Back to Events</a>
      </div>
    </Card>
  );

  return null;
}
