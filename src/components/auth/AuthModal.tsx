'use client';
import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMode?: 'signin' | 'signup';
  cityName?: string;
};

export function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'signup', cityName }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = mode === 'signup'
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        onSuccess();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: 'signin' | 'signup') {
    setMode(next);
    setError('');
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-modal-hero">
          <div className="auth-modal-hero-inner">
            {cityName && (
              <div className="auth-modal-city-badge">
                <MapPin size={14} />
                <span>{cityName}</span>
              </div>
            )}
            <h2 className="auth-modal-city-name">
              {cityName ? `${cityName} Business Calendar` : 'Local Business Calendar'}
            </h2>
            <p className="auth-modal-hero-sub">
              {mode === 'signup'
                ? 'Create a free account to unlock the full weekly calendar'
                : 'Welcome back — sign in to view the full calendar'}
            </p>
          </div>
        </div>

        <div className="auth-modal-body">
          <div className="auth-tab-row">
            <button
              className={`auth-tab${mode === 'signup' ? ' active' : ''}`}
              onClick={() => switchMode('signup')}
              type="button"
            >
              Create Account
            </button>
            <button
              className={`auth-tab${mode === 'signin' ? ' active' : ''}`}
              onClick={() => switchMode('signin')}
              type="button"
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="auth-field">
              <label htmlFor="am-email">Email</label>
              <input
                id="am-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="am-password">Password</label>
              <input
                id="am-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'signup'
                ? 'Create Free Account'
                : 'Sign In'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="auth-modal-disclaimer">
              Free forever. No credit card required.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
