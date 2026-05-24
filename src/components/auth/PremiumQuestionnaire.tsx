'use client';
import { useState } from 'react';
import { useAuth, NetworkProfile } from '../../contexts/AuthContext';

// ─── Step config ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'Networking',    label: 'Business Networkers',      icon: '🤝' },
  { value: 'Technology',    label: 'Tech & Startup Community', icon: '💻' },
  { value: 'Real Estate',   label: 'Real Estate Professionals',icon: '🏢' },
  { value: 'Chambers',      label: 'Chamber & Civic Leaders',  icon: '🏛️' },
  { value: 'Small Business',label: 'Small Business Owners',    icon: '🛍️' },
];

const CITIES = [
  { value: 'San Antonio', label: 'San Antonio' },
  { value: 'Austin',      label: 'Austin' },
  { value: 'Dallas',      label: 'Dallas' },
  { value: 'Houston',     label: 'Houston' },
  { value: '',            label: 'All Texas Cities' },
];

const TIMES = [
  { value: 'Morning',  label: 'Morning',  sub: 'Before noon' },
  { value: 'Midday',   label: 'Midday',   sub: 'Lunch events' },
  { value: 'Evening',  label: 'Evening',  sub: 'After 5pm' },
  { value: 'Any',      label: 'Any time', sub: 'No preference' },
];

const PARTICIPATION = [
  { value: 'In-Person', label: 'In-Person only',     sub: 'I want to be in the room' },
  { value: 'Both',      label: 'Open to Virtual too', sub: 'Either format works for me' },
];

const TOTAL_STEPS = 4;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modal: {
    background: '#151828',
    border: '1px solid #2a2f45',
    borderRadius: '20px',
    padding: '36px 32px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  progress: {
    display: 'flex',
    gap: '6px',
    marginBottom: '28px',
  },
  dot: (active: boolean, done: boolean) => ({
    height: '4px',
    flex: 1,
    borderRadius: '2px',
    background: done ? '#f5a623' : active ? '#f5a62380' : '#2a2f45',
    transition: 'background 0.3s',
  }),
  eyebrow: {
    color: '#f5a623',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  },
  heading: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: '6px',
  },
  sub: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '24px',
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  option: (selected: boolean) => ({
    background: selected ? '#f5a62315' : '#1e2130',
    border: `1px solid ${selected ? '#f5a623' : '#2a2f45'}`,
    borderRadius: '12px',
    padding: '14px 18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    transition: 'all 0.15s',
    width: '100%',
    textAlign: 'left' as const,
  }),
  optionIcon: {
    fontSize: '20px',
    lineHeight: 1,
    flexShrink: 0,
  },
  optionLabel: (selected: boolean) => ({
    color: selected ? '#f5a623' : '#ddd',
    fontSize: '15px',
    fontWeight: selected ? 700 : 400,
  }),
  optionSub: {
    color: '#666',
    fontSize: '12px',
    marginTop: '2px',
  },
  footer: {
    marginTop: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '8px 0',
  },
  nextBtn: (disabled: boolean) => ({
    background: disabled ? '#2a2f45' : '#f5a623',
    border: 'none',
    borderRadius: '10px',
    color: disabled ? '#555' : '#000',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    padding: '12px 28px',
    transition: 'all 0.15s',
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PremiumQuestionnaire() {
  const { profile, saveNetworkProfile } = useAuth();
  const firstName = profile?.first_name ?? 'there';

  const [step, setStep]               = useState(1);
  const [categories, setCategories]   = useState<string[]>([]);
  const [city, setCity]               = useState<string>('');
  const [timeOfDay, setTimeOfDay]     = useState<string[]>([]);
  const [participation, setParticip]  = useState<string>('');
  const [saving, setSaving]           = useState(false);

  function toggleCategory(val: string) {
    setCategories(prev =>
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    );
  }

  function toggleTime(val: string) {
    if (val === 'Any') {
      setTimeOfDay(['Any']);
      return;
    }
    setTimeOfDay(prev => {
      const without = prev.filter(t => t !== 'Any');
      return without.includes(val) ? without.filter(t => t !== val) : [...without, val];
    });
  }

  function canProceed() {
    if (step === 1) return categories.length > 0;
    if (step === 2) return true; // city has a default (empty = all cities)
    if (step === 3) return timeOfDay.length > 0;
    if (step === 4) return participation !== '';
    return false;
  }

  async function handleFinish() {
    setSaving(true);
    const networkProfile: NetworkProfile = { categories, city, timeOfDay, participation };
    await saveNetworkProfile(networkProfile);
    setSaving(false);
  }

  return (
    <div style={s.overlay}>
      <div style={s.modal}>

        {/* Progress bar */}
        <div style={s.progress}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} style={s.dot(i + 1 === step, i + 1 < step)} />
          ))}
        </div>

        {/* Step 1 — Who to meet */}
        {step === 1 && (
          <>
            <p style={s.eyebrow}>Step 1 of 4 · Your Network</p>
            <h2 style={s.heading}>Who do you want to be in the room with, {firstName}?</h2>
            <p style={s.sub}>Select all that apply. We'll find events where these professionals show up.</p>
            <div style={s.optionsGrid}>
              {CATEGORIES.map(c => (
                <button key={c.value} style={s.option(categories.includes(c.value))} onClick={() => toggleCategory(c.value)}>
                  <span style={s.optionIcon}>{c.icon}</span>
                  <span style={s.optionLabel(categories.includes(c.value))}>{c.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2 — City */}
        {step === 2 && (
          <>
            <p style={s.eyebrow}>Step 2 of 4 · Your City</p>
            <h2 style={s.heading}>Which city are you networking in?</h2>
            <p style={s.sub}>We'll prioritize events in your area.</p>
            <div style={s.optionsGrid}>
              {CITIES.map(c => (
                <button key={c.value} style={s.option(city === c.value)} onClick={() => setCity(c.value)}>
                  <span style={s.optionLabel(city === c.value)}>{c.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3 — Time of day */}
        {step === 3 && (
          <>
            <p style={s.eyebrow}>Step 3 of 4 · Your Schedule</p>
            <h2 style={s.heading}>When can you typically make it out?</h2>
            <p style={s.sub}>Pick everything that works for you.</p>
            <div style={s.optionsGrid}>
              {TIMES.map(t => (
                <button key={t.value} style={s.option(timeOfDay.includes(t.value))} onClick={() => toggleTime(t.value)}>
                  <div>
                    <div style={s.optionLabel(timeOfDay.includes(t.value))}>{t.label}</div>
                    <div style={s.optionSub}>{t.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 4 — Participation */}
        {step === 4 && (
          <>
            <p style={s.eyebrow}>Step 4 of 4 · How You Meet</p>
            <h2 style={s.heading}>How do you prefer to meet?</h2>
            <p style={s.sub}>We'll match events to how you show up.</p>
            <div style={s.optionsGrid}>
              {PARTICIPATION.map(p => (
                <button key={p.value} style={s.option(participation === p.value)} onClick={() => setParticip(p.value)}>
                  <div>
                    <div style={s.optionLabel(participation === p.value)}>{p.label}</div>
                    <div style={s.optionSub}>{p.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={s.footer}>
          {step > 1
            ? <button style={s.backBtn} onClick={() => setStep(s => s - 1)}>← Back</button>
            : <div />
          }
          {step < TOTAL_STEPS ? (
            <button
              style={s.nextBtn(!canProceed())}
              onClick={() => canProceed() && setStep(s => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              style={s.nextBtn(!canProceed() || saving)}
              onClick={() => canProceed() && !saving && handleFinish()}
            >
              {saving ? 'Saving...' : 'Build My Calendar →'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
