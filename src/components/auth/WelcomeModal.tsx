'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const CATEGORIES = ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'];

interface WelcomeModalProps {
  userId: string;
  email: string;
  city: string;
  onComplete: (firstName: string) => void;
}

export function WelcomeModal({ userId, email, city, onComplete }: WelcomeModalProps) {
  const [firstName, setFirstName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleCategory(cat: string) {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) { setError('Please enter your first name.'); return; }
    setLoading(true);

    // Save first name to user_profiles
    await supabase
      .from('user_profiles')
      .update({ first_name: firstName.trim() })
      .eq('id', userId);

    // Add selected category newsletters to newsletter_subscriptions
    if (selected.length > 0) {
      const rows = selected.map(cat => ({
        email,
        first_name: firstName.trim(),
        city,
        sub_calendar: cat,
        status: 'active',
        source: 'welcome_modal',
      }));

      // Only insert ones not already subscribed
      for (const row of rows) {
        const { data: existing } = await supabase
          .from('newsletter_subscriptions')
          .select('id')
          .eq('email', email)
          .eq('city', city)
          .eq('sub_calendar', row.sub_calendar)
          .maybeSingle();

        if (!existing) {
          await supabase.from('newsletter_subscriptions').insert(row);
        }
      }
    }

    setLoading(false);
    onComplete(firstName.trim());
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal-card" style={{ maxWidth: 480 }}>

        <div className="auth-modal-hero">
          <div className="auth-modal-hero-inner">
            <h2 className="auth-modal-city-name">Welcome to Local Business Calendars!</h2>
            <p className="auth-modal-hero-sub">
              You're subscribed to the {city} Events Newsletter. Let's get your account set up.
            </p>
          </div>
        </div>

        <div className="auth-modal-body">
          <form onSubmit={handleSubmit} className="auth-modal-form">

            <div className="auth-field">
              <label htmlFor="welcome-firstname">What's your first name?</label>
              <input
                id="welcome-firstname"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Your first name"
                required
                autoFocus
              />
            </div>

            <div className="auth-field" style={{ marginTop: '1.25rem' }}>
              <label style={{ marginBottom: '0.5rem', display: 'block' }}>
                Would you like to receive any of our other {city} Events Newsletters?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {CATEGORIES.map(cat => (
                  <label
                    key={cat}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      padding: '0.4rem 0',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Saving…' : 'Save & Continue →'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
