'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { User, Mail, Calendar, MapPin, LogOut, X, Plus, ArrowRight } from 'lucide-react';

const CITY_TO_SLUG: Record<string, string> = {
  'Austin':      'austin',
  'Dallas':      'dallas',
  'Houston':     'houston',
  'San Antonio': 'san-antonio',
};

const CAT_TO_SLUG: Record<string, string> = {
  'Networking':     'networking',
  'Technology':     'technology',
  'Real Estate':    'real-estate',
  'Chamber':        'chamber',
  'Small Business': 'small-business',
};

// ── Login gate shown to unauthenticated visitors ───────────────────────────
function AccountLoginGate() {
  const { signIn, sendMagicLink } = useAuth();
  const [mode, setMode]           = useState<'choose' | 'magic' | 'password'>('choose');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [magicSent, setMagicSent] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await sendMagicLink(email.trim().toLowerCase());
    setLoading(false);
    if (err) { setError(err.message); return; }
    setMagicSent(true);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (err) setError(err.message);
    // on success AuthContext updates user → AccountPage re-renders automatically
  }

  return (
    <>
      <Navigation />
      <div className="sub-success-wrap">
        <div className="sub-form-card" style={{ maxWidth: '420px', margin: '0 auto' }}>

          <h2 style={{ marginBottom: '0.25rem', fontSize: '1.4rem' }}>Manage My Subscriptions</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Log in to view, add, or remove your newsletter subscriptions.
          </p>

          {mode === 'choose' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="sub-submit" onClick={() => setMode('magic')} style={{ justifyContent: 'center' }}>
                <Mail size={16} /> Send me a magic link
              </button>
              <button className="nav-signin-btn" onClick={() => setMode('password')} style={{ width: '100%', padding: '0.75rem', textAlign: 'center' }}>
                Log in with password
              </button>
            </div>
          )}

          {mode === 'magic' && !magicSent && (
            <form onSubmit={handleMagicLink} className="sub-form">
              <div className="sub-field">
                <label htmlFor="ml-email">Your email address</label>
                <input id="ml-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              {error && <div className="sub-error">{error}</div>}
              <button type="submit" className="sub-submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send magic link'} {!loading && <ArrowRight size={16} />}
              </button>
              <button type="button" onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.5rem' }}>← Back</button>
            </form>
          )}

          {mode === 'magic' && magicSent && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <i className="ti ti-mail-check" style={{ fontSize: '2.5rem', color: 'var(--color-accent)' }} />
              <p style={{ marginTop: '0.75rem', fontWeight: '600' }}>Check your inbox!</p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                We sent a link to <strong>{email}</strong>. Click it to manage your subscriptions.
              </p>
            </div>
          )}

          {mode === 'password' && (
            <form onSubmit={handlePassword} className="sub-form">
              <div className="sub-field">
                <label htmlFor="pw-email">Email address</label>
                <input id="pw-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="sub-field">
                <label htmlFor="pw-password">Password</label>
                <input id="pw-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              {error && <div className="sub-error">{error}</div>}
              <button type="submit" className="sub-submit" disabled={loading}>
                {loading ? 'Logging in…' : 'Log in'} {!loading && <ArrowRight size={16} />}
              </button>
              <button type="button" onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.5rem' }}>← Back</button>
            </form>
          )}

          <p className="sub-fine-print" style={{ marginTop: '1.5rem' }}>
            Don't have an account? <a href="/texas/san-antonio/subscribe">Subscribe free →</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export function AccountPage() {
  const { user, profile, preferences, signOut, updatePreferences, loading } = useAuth();
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);

  // Show login gate instead of redirecting
  if (!loading && !user) return <AccountLoginGate />;

  // Still fetching
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="acct-loading">Loading your account…</div>
        <Footer />
      </>
    );
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  // Group preferences by city
  const byCityMap: Record<string, { category: string; prefId: string }[]> = {};
  preferences.forEach(p => {
    const city = p.city || 'All Cities';
    if (!byCityMap[city]) byCityMap[city] = [];
    byCityMap[city].push({ category: p.category, prefId: p.id });
  });
  const byCity = Object.entries(byCityMap);

  async function handleRemove(prefId: string) {
    setRemoving(prefId);
    const remaining = preferences.filter(p => p.id !== prefId);
    await updatePreferences(
      remaining.map(p => ({
        category:           p.category,
        city:               p.city,
        participation_type: p.participation_type,
        time_of_day:        p.time_of_day,
        cost_preference:    p.cost_preference,
      }))
    );
    setRemoving(null);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <>
      <Navigation />
      <main className="acct-page">
        <div className="acct-container">

          {/* Header */}
          <div className="acct-header">
            <div className="acct-avatar">
              <User size={28} />
            </div>
            <div>
              <h1 className="acct-name">Hi, {profile?.first_name || 'Member'}</h1>
              {memberSince && <p className="acct-since">Member since {memberSince}</p>}
            </div>
          </div>

          {/* Info cards */}
          <div className="acct-cards">
            <div className="acct-card">
              <div className="acct-card-label"><Mail size={14} />Email Address</div>
              <div className="acct-card-value">{profile?.email || user?.email}</div>
            </div>
            <div className="acct-card">
              <div className="acct-card-label"><Calendar size={14} />Membership</div>
              <div className="acct-card-value acct-tier">
                {profile?.subscription_tier === 'free' || !profile?.subscription_tier ? 'Free Member' : profile.subscription_tier}
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="acct-section">
            <div className="acct-section-header">
              <h2 className="acct-section-title">
                <MapPin size={16} />
                Your Calendar Subscriptions
              </h2>
              <a href="/texas" className="acct-add-btn">
                <Plus size={13} />
                Add More
              </a>
            </div>

            {byCity.length === 0 ? (
              <div className="acct-empty">
                You haven't subscribed to any calendars yet.{' '}
                <a href="/subscribe" className="acct-link">Browse calendars →</a>
              </div>
            ) : (
              <div className="acct-subs">
                {byCity.map(([city, cats]) => (
                  <div key={city} className="acct-sub-row">
                    <div className="acct-sub-city">{city}</div>
                    <div className="acct-sub-cats">
                      {cats.map(({ category, prefId }) => {
                        const citySlug = CITY_TO_SLUG[city];
                        const catSlug  = CAT_TO_SLUG[category];
                        return (
                          <div key={prefId} className="acct-sub-tag-wrap">
                            <span className="acct-sub-tag">{category}</span>
                            <button
                              className="acct-sub-remove"
                              onClick={() => handleRemove(prefId)}
                              disabled={removing === prefId}
                              title={`Remove ${category}`}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        );
                      })}
                      {/* Add another category in this city */}
                      {CITY_TO_SLUG[city] && (
                        <a
                          href={`/texas/${CITY_TO_SLUG[city]}/subscribe`}
                          className="acct-sub-add"
                          title={`Add a ${city} calendar`}
                        >
                          <Plus size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sign out */}
          <button className="acct-signout" onClick={handleSignOut}>
            <LogOut size={15} />
            Sign Out
          </button>

        </div>
      </main>
      <Footer />
    </>
  );
}
