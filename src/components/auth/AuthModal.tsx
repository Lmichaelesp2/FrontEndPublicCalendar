'use client';
import { useState } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMode?: 'signin' | 'signup';
};

export function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'signup' }: AuthModalProps) {
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

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-icon">
            <CalendarDays size={22} />
          </div>
          <h2 className="auth-modal-title">
            {mode === 'signup' ? 'See the Full Week' : 'Welcome Back'}
          </h2>
          <p className="auth-modal-sub">
            {mode === 'signup'
              ? 'Create a free account to unlock the full weekly calendar.'
              : 'Sign in to access your weekly calendar view.'}
          </p>
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

        <div className="auth-modal-toggle">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setError(''); }}>Sign in</button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setError(''); }}>Sign up free</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
