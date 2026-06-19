'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { User, Mail, Calendar, MapPin, LogOut, X, ArrowRight, Sparkles, Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CITY_TO_SLUG: Record<string, string> = {
  'Austin':      'austin',
  'Dallas':      'dallas',
  'Houston':     'houston',
  'San Antonio': 'san-antonio',
};

const SLUG_TO_CITY_NAME: Record<string, string> = {
  'san-antonio': 'San Antonio',
  austin:        'Austin',
  dallas:        'Dallas',
  houston:       'Houston',
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
  const [mode, setMode]             = useState<'choose' | 'magic' | 'password' | 'forgot'>('choose');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [magicSent, setMagicSent]   = useState(false);
  const [resetSent, setResetSent]   = useState(false);

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/account` }
    );
    setLoading(false);
    if (err) { setError(err.message); return; }
    setResetSent(true);
  }

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
        <div className="acct-gate-body">

          <a href="/texas" className="acct-back-btn" style={{ marginBottom: '1.25rem' }}>
            <ArrowLeft size={14} />
            Back to Texas Business Calendars
          </a>

          <h2 style={{ marginBottom: '0.25rem', fontSize: '1.4rem' }}>Manage My Subscriptions</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            This is for your free account — your weekly newsletter emails and your Local Business Organizations directory access. Log in to view, add, or remove what you're subscribed to.
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>← Back</button>
                <button type="button" onClick={() => { setMode('forgot'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>Forgot password?</button>
              </div>
            </form>
          )}

          {mode === 'forgot' && !resetSent && (
            <form onSubmit={handleForgotPassword} className="sub-form">
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Enter your email and we'll send a password reset link.</p>
              <div className="sub-field">
                <label htmlFor="reset-email">Email address</label>
                <input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              {error && <div className="sub-error">{error}</div>}
              <button type="submit" className="sub-submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'} {!loading && <ArrowRight size={16} />}
              </button>
              <button type="button" onClick={() => setMode('password')} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.5rem' }}>← Back</button>
            </form>
          )}

          {mode === 'forgot' && resetSent && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <i className="ti ti-mail-check" style={{ fontSize: '2.5rem', color: 'var(--color-accent)' }} />
              <p style={{ marginTop: '0.75rem', fontWeight: '600' }}>Check your inbox!</p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>We sent a password reset link to <strong>{email}</strong>.</p>
            </div>
          )}

          <p className="sub-fine-print" style={{ marginTop: '1.5rem', padding: 0 }}>
            Don't have an account? <a href="/texas/san-antonio/subscribe">Subscribe free →</a>
          </p>

        </div>

        <div className="acct-premium-callout">
          <span className="acct-premium-callout-label">Premium subscriber?</span>
          <p className="acct-premium-callout-desc">
            This page is for free newsletter accounts only. Premium Event Assistant members should log in here instead:
          </p>
          <div className="acct-premium-callout-links">
            {(['san-antonio', 'austin', 'dallas', 'houston'] as const).map(slug => (
              <a
                key={slug}
                href={`https://www.localbusinesscalendars.app/${slug}/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="acct-premium-callout-link"
              >
                {SLUG_TO_CITY_NAME[slug]}
              </a>
            ))}
          </div>
        </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export function AccountPage() {
  const { user, profile, newsletterSubs, signOut, removeNewsletterSub, addNewsletterSub, loading } = useAuth();
  const router = useRouter();
  const [removing, setRemoving]     = useState<number | null>(null);
  const [timedOut, setTimedOut]     = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<{ subId: number; label: string } | null>(null);
  const [addingCity, setAddingCity] = useState<string | null>(null);

  // Safety timeout — if still loading after 4s, stop waiting and show login gate
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setTimedOut(true), 4000);
    return () => clearTimeout(t);
  }, [loading]);

  // Show login gate instead of redirecting
  if ((!loading && !user) || timedOut) return <AccountLoginGate />;

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

  // Logged in but no profile row yet — show minimal page with sign out
  if (!profile) {
    return (
      <>
        <Navigation />
        <div className="sub-success-wrap">
          <div className="sub-form-card" style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
            <div className="acct-gate-body">
              <a href="/texas" className="acct-back-btn" style={{ marginBottom: '1.25rem' }}>
                <ArrowLeft size={14} />
                Back to Texas Business Calendars
              </a>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>Hi, {user?.email}</h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Your subscriptions are managed by email. Visit any city page and subscribe to add calendars to your account.
              </p>
              <a href="/subscribe" className="sub-submit" style={{ display: 'inline-flex', textDecoration: 'none', justifyContent: 'center' }}>
                Browse Calendars <ArrowRight size={16} />
              </a>
              <button
                onClick={async () => { await signOut(); router.push('/'); }}
                style={{ display: 'block', margin: '1rem auto 0', background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                <LogOut size={13} style={{ marginRight: '4px' }} /> Sign Out
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  // Only the city-wide newsletter subscriptions are shown/managed here
  // (sub-calendar lists are paused). One chip per city the member is on.
  const ALL_CITIES = ['San Antonio', 'Austin', 'Dallas', 'Houston'];
  const cityWideSubs = newsletterSubs
    .filter(s => !s.sub_calendar && (s.status ?? 'active') === 'active')
    .sort((a, b) => a.id - b.id); // oldest subscription (lowest id) first

  const byCityMap: Record<string, { label: string; subId: number; source: string | null }> = {};
  cityWideSubs.forEach(s => {
    const city = s.city || 'Unknown';
    if (byCityMap[city]) return; // one chip per city — keeps the earliest since list is sorted
    byCityMap[city] = {
      label:  `${city} Newsletter`,
      subId:  s.id,
      source: s.source ?? null,
    };
  });
  const subscribedCities = Object.keys(byCityMap);
  const byCity = Object.entries(byCityMap);
  const availableCities = ALL_CITIES.filter(c => !subscribedCities.includes(c));

  // "Back to [City] Business Calendar" — the FIRST city they ever subscribed to
  // (lowest subscription id, since cityWideSubs is sorted oldest-first above).
  // Falls back to the Texas overview only if they have no active city subscription at all.
  const primaryCity = cityWideSubs.length > 0 ? (cityWideSubs[0].city || null) : null;
  const primaryCitySlug = primaryCity ? CITY_TO_SLUG[primaryCity] : null;
  const backHref = primaryCitySlug ? `/texas/${primaryCitySlug}` : '/texas';
  const backLabel = primaryCity ? `Back to ${primaryCity} Business Calendar` : 'Back to Texas Business Calendars';

  async function handleRemove(subId: number) {
    setRemoving(subId);
    await removeNewsletterSub(subId);
    setRemoving(null);
    setConfirmRemove(null);
  }

  async function handleAddCity(city: string) {
    setAddingCity(city);
    await addNewsletterSub(city);
    setAddingCity(null);
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      window.location.href = '/';
    }
  }

  return (
    <>
      <Navigation />
      <main className="acct-page">
        <div className="acct-container">

          {/* Back to calendar */}
          <a href={backHref} className="acct-back-btn">
            <ArrowLeft size={14} />
            {backLabel}
          </a>

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
                Your Newsletter Subscriptions
              </h2>
            </div>

            {byCity.length === 0 ? (
              <div className="acct-empty">
                You're not subscribed to any city newsletters yet.
              </div>
            ) : (
              <div className="acct-subs">
                <div className="acct-sub-row">
                  <div className="acct-sub-cats">
                    {byCity.map(([city, { label, subId, source }]) => (
                      <div key={subId} className="acct-sub-tag-wrap" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="acct-sub-tag">{label}</span>
                          <button
                            className="acct-sub-remove"
                            onClick={() => setConfirmRemove({ subId, label })}
                            disabled={removing === subId}
                            title={`Unsubscribe from ${label}`}
                          >
                            <X size={11} />
                          </button>
                        </div>
                        {source === 'lbo_signup' && (
                          <span style={{ fontSize: '0.75rem', color: '#888', paddingLeft: '2px' }}>
                            Enrolled via your{' '}
                            <a href="https://www.localbusinessorganizations.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1a3a5c', textDecoration: 'none', fontWeight: '600' }}>
                              Local Business Organizations
                            </a>{' '}account
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Add another city — inline, no extra screen */}
            {availableCities.length > 0 && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                background: '#f0f4ff',
                borderLeft: '4px solid #1a3a5c',
                borderRadius: '4px',
              }}>
                <p style={{ margin: '0 0 0.75rem', fontWeight: '600', fontSize: '0.95rem', color: '#1a3a5c' }}>
                  Add another city
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {availableCities.map(city => (
                    <button
                      key={city}
                      onClick={() => handleAddCity(city)}
                      disabled={addingCity === city}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: '#fff', border: '1.5px solid #1a3a5c', borderRadius: '999px',
                        padding: '7px 14px', fontSize: '0.88rem', fontWeight: 600,
                        color: '#1a3a5c', cursor: addingCity === city ? 'default' : 'pointer',
                        opacity: addingCity === city ? 0.6 : 1,
                      }}
                    >
                      <Plus size={14} />
                      {addingCity === city ? 'Adding…' : `${city} Newsletter`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LBO Directory Access */}
          <div className="acct-section">
            <div className="acct-section-header">
              <h2 className="acct-section-title">
                <Sparkles size={16} />
                Business Organizations Directory
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Your account gives you access to the full <strong>Local Business Organizations</strong> directory — complete org profiles, contact info, membership details, and social links for every city you're subscribed to.
            </p>
            {subscribedCities.length === 0 ? (
              <div className="acct-empty">
                Subscribe to a city newsletter to unlock directory access.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {subscribedCities.map(city => {
                  const slug = CITY_TO_SLUG[city] || city.toLowerCase().replace(' ', '-');
                  return (
                    <a
                      key={city}
                      href={`https://www.localbusinessorganizations.com/texas/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: '#f0f4ff', border: '1.5px solid #1a3a5c',
                        borderRadius: '8px', padding: '10px 16px',
                        fontSize: '0.875rem', fontWeight: 600, color: '#1a3a5c',
                        textDecoration: 'none',
                      }}
                    >
                      <MapPin size={14} />
                      {city} Organizations
                      <ArrowRight size={13} />
                    </a>
                  );
                })}
              </div>
            )}
            {subscribedCities.length === 0 && (
              <a
                href="https://www.localbusinessorganizations.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '0.75rem', fontSize: '0.85rem', color: '#1a3a5c', fontWeight: 600, textDecoration: 'none' }}
              >
                Browse the directory → <ArrowRight size={13} />
              </a>
            )}
          </div>

          {/* Sign out */}
          <button className="acct-signout" onClick={handleSignOut}>
            <LogOut size={15} />
            Sign Out
          </button>

        </div>
      </main>

      {/* Unsubscribe confirmation */}
      {confirmRemove && (
        <div
          onClick={() => removing === null && setConfirmRemove(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '12px', padding: '1.5rem',
              maxWidth: '380px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#1a1a1a' }}>
              Unsubscribe?
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', color: '#555', lineHeight: 1.5 }}>
              Are you sure you want to unsubscribe from <strong>{confirmRemove.label}</strong>? You'll stop receiving its weekly email.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                onClick={() => setConfirmRemove(null)}
                disabled={removing !== null}
                style={{
                  background: '#fff', border: '1.5px solid #d0d7de', borderRadius: '8px',
                  padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: '#475569', cursor: 'pointer',
                }}
              >
                Keep it
              </button>
              <button
                onClick={() => handleRemove(confirmRemove.subId)}
                disabled={removing !== null}
                style={{
                  background: '#b91c1c', border: 'none', borderRadius: '8px',
                  padding: '8px 16px', fontSize: '0.88rem', fontWeight: 700, color: '#fff',
                  cursor: removing !== null ? 'default' : 'pointer', opacity: removing !== null ? 0.7 : 1,
                }}
              >
                {removing !== null ? 'Unsubscribing…' : 'Yes, unsubscribe'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
