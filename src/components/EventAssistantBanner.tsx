'use client';
import { useState } from 'react';
import { Sparkles, ArrowRight, Check, Radar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function EventAssistantBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase
      .from('assistant_waitlist')
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        return;
      }
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    setStatus('success');
  }

  return (
    <div className="ea-wrapper" id="event-assistant">
      <div className="ea-card">
        <div className="ea-graphic" aria-hidden="true">
          <Radar size={200} strokeWidth={0.8} />
        </div>
        <div className="ea-card-inner">
          <div className="ea-left">
            <h3 className="ea-title">
              Your Personal <span>Event Assistant</span>
            </h3>
            <div className="ea-badge">
              <Sparkles size={11} />
              Coming Soon
            </div>
            <p className="ea-desc">
              An intelligent assistant for individuals and teams that matches you with the best
              events for your goals and objectives. Be the first to know when it's available.
            </p>
          </div>

          <div className="ea-right">
            {status === 'success' ? (
              <div className="ea-success">
                <Check size={16} />
                <span>You're on the list!</span>
              </div>
            ) : (
              <form className="ea-form" onSubmit={handleSubmit}>
                <div className="ea-input-wrap">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="ea-input"
                  />
                  <button
                    type="submit"
                    className="ea-submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Joining...' : 'Notify Me'}
                    {status !== 'loading' && <ArrowRight size={13} />}
                  </button>
                </div>
                {status === 'error' && <p className="ea-error">{errorMsg}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
