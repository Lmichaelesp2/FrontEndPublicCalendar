'use client';

import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'signup' | 'signin';
  cityName?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'signup', cityName }: AuthModalProps) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode]       = useState<'signup' | 'signin'>(defaultMode);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function switchMode(newMode: 'signup' | 'signin') {
    setMode(newMode);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = mode === 'signup'
        ? await signUp(email, password, '')   // no first name needed in modal
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        onSuccess?.();
        onClose();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        {cityName && (
          <div className="modal-city">
            <MapPin size={14} />
            {cityName}
          </div>
        )}

        <div className="modal-tabs">
          <button className={`modal-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>
            Sign up
          </button>
          <button className={`modal-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => switchMode('signin')}>
            Sign in
          </button>
        </div>

        <p className="modal-sub">
          {mode === 'signup'
            ? 'Create a free account to unlock the full weekly calendar'
            : 'Welcome back — sign in to view the full calendar'}
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="modal-email">Email address</label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="modal-password">Password</label>
            <input
              id="modal-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <div className="modal-error">{error}</div>}

          <button type="submit" className="modal-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create free account' : 'Sign in'}
          </button>
        </form>

        {mode === 'signup' && (
          <p className="modal-fine-print">Free forever. No credit card required.</p>
        )}
      </div>
    </div>
  );
}
