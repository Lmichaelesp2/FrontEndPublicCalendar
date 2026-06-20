'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface WelcomeModalProps {
  userId: string;
  email: string;
  city: string;
  onComplete: (firstName: string) => void;
}

export function WelcomeModal({ userId, city, onComplete }: WelcomeModalProps) {
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) { setError('Please enter your first name.'); return; }
    setLoading(true);

    // Save first name to user_profiles
    await supabase
      .from('user_profiles')
      .update({ first_name: firstName.trim() })
      .eq('id', userId);

    setLoading(false);
    onComplete(firstName.trim());
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal-card" style={{ maxWidth: 480 }}>

        <div className="auth-modal-hero">
          <div className="auth-modal-hero-inner">
            <h2 className="auth-modal-city-name">Welcome to the new {city} Calendar!</h2>
            <p className="auth-modal-hero-sub">
              You're subscribed to the {city} Events Newsletter. Good news — you don't need to log in
              to browse the calendar anymore, it's open to everyone. We just need your name to finish
              setting up your account.
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
