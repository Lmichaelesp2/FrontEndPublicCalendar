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
  const [mode, setMode]           = useState<'signup' | 'signin'>(defaultMode);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  if (!isOpen) return null;

  function switchMode(newMode: 'signup' | 'signin') {
    setMode(newMode);
    setError('');
    setFirstName('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = mode === 'signup'
        ? await signUp(email, password, firstName)
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
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={e => e.stopPropagation()}>

        {/* Hero section */}
        <div className="auth-modal-hero">
          <button className="auth-modal-close" onClick={onClose}><X size={18} /></button>
          <div className="auth-modal-hero-inner">
            {cityName && (
              <div className="auth-modal-city-badge">
                <MapPin size={12} />
                {cityName}
              </div>
            )}
            <h2 className="auth-modal-city-name">
              {mode === 'signup' ? 'Create a Free Account' : 'Welcome Back'}
            </h2>
            <p className="auth-modal-hero-sub">
              {mode === 'signup'
                ? cityName
                  ? `Sign up to unlock full event details for the ${cityName}`
                  : 'Unlock full event details, end times & more'
                : cityName
                  ? `Sign in to access your ${cityName}`
                  : 'Sign in to access your full calendar'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="auth-modal-body">
          <div className="auth-tab-row">
            <button
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              Sign up
            </button>
            <button
              className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => switchMode('signin')}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-modal-form">
            {mode === 'signup' && (
              <div className="auth-field">
                <label htmlFor="auth-firstname">First name</label>
                <input
                  id="auth-firstname"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  required
                />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create free account' : 'Sign in'}
            </button>
          </form>

          {mode === 'signup' && (
            <p style={{ textAlign: 'center', fontSize: '.78rem', color: '#94a3b8', marginTop: '1rem' }}>
              Free forever · No credit card required
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
