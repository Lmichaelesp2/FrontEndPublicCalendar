'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, LogIn } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// ─── Config ───────────────────────────────────────────────────────────────────

const CITIES = [
  { name: 'Austin',       slug: 'austin' },
  { name: 'Dallas',       slug: 'dallas' },
  { name: 'Houston',      slug: 'houston' },
  { name: 'San Antonio',  slug: 'san-antonio' },
];

const SUB_CALENDARS = [
  { key: 'Networking',     slug: 'networking' },
  { key: 'Technology',     slug: 'technology' },
  { key: 'Real Estate',    slug: 'real-estate' },
  { key: 'Chamber',        slug: 'chamber' },
  { key: 'Small Business', slug: 'small-business' },
];

const CITY_SLUGS: Record<string, string> = {
  'austin':       'Austin',
  'dallas':       'Dallas',
  'houston':      'Houston',
  'san-antonio':  'San Antonio',
};

const SUB_SLUGS: Record<string, string> = {
  'networking':     'Networking',
  'technology':     'Technology',
  'real-estate':    'Real Estate',
  'chamber':        'Chamber',
  'small-business': 'Small Business',
};

const CITY_DESCRIPTIONS: Record<string, string> = {
  'Austin':      "The Texas capital's thriving startup and business community — chambers, tech meetups, industry conferences, and more.",
  'Dallas':      "DFW's professional network is one of the largest in the country. Never miss a chamber event, summit, or mixer again.",
  'Houston':     "From energy sector events to multicultural chambers, Houston has one of the most active business calendars in Texas.",
  'San Antonio': "The Alamo City's booming professional scene — SA Chamber, Hispanic Chamber, SCORE workshops, and local mixers.",
};

const SUB_DESCRIPTIONS: Record<string, string> = {
  'Networking':     'Mixers, meetups, and professional networking events.',
  'Technology':     'Tech meetups, startup events, and innovation summits.',
  'Real Estate':    'Investor meetups, REIA events, and real estate workshops.',
  'Chamber':        'Chamber of commerce events, galas, and business luncheons.',
  'Small Business': 'Small business workshops, SCORE sessions, and entrepreneur events.',
};

const PERKS = [
  { icon: 'ti-mail',     title: 'Weekly Monday newsletter', desc: "A curated digest of the week's best events lands in your inbox every Monday morning." },
  { icon: 'ti-calendar', title: 'Never miss an event',      desc: 'Stop checking multiple sites. We do the searching so you can focus on showing up.' },
  { icon: 'ti-search',   title: 'Curated for your city',    desc: 'Only events that matter to professionals in your area — no noise, no fluff.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SubscribePage() {
  const params   = useParams();
  const router   = useRouter();
  const { user, signUp, signIn } = useAuth();

  // Determine city and sub-calendar from URL params
  const citySlug    = params?.citySlug as string | undefined;
  const subSlug     = params?.subSlug  as string | undefined;

  const cityName    = citySlug ? CITY_SLUGS[citySlug]  : undefined;
  const subCalName  = subSlug  ? SUB_SLUGS[subSlug]    : undefined;

  // What are they subscribing to?
  const isSubCal    = !!subCalName;
  const subscriptionLabel = isSubCal
    ? `${cityName} — ${subCalName}`
    : `${cityName} (city-wide)`;

  const pageDesc = isSubCal
    ? SUB_DESCRIPTIONS[subCalName!]
    : cityName ? CITY_DESCRIPTIONS[cityName] : '';

  const cityRoute = citySlug
    ? (subSlug ? `/texas/${citySlug}/${subSlug}` : `/texas/${citySlug}`)
    : '/';

  // ── Form state
  const [mode,           setMode]          = useState<'signup' | 'signin'>('signup');
  const [firstName,      setFirstName]     = useState('');
  const [email,          setEmail]         = useState('');
  const [password,       setPassword]      = useState('');
  const [error,          setError]         = useState('');
  const [loading,        setLoading]       = useState(false);
  const [success,        setSuccess]       = useState(false);
  const [isReturning,      setIsReturning]     = useState(false); // existing subscriber adding a new calendar
  const [alreadyHasThis,   setAlreadyHasThis]  = useState(false); // already subscribed to this exact calendar
  const [emailIsKnown,     setEmailIsKnown]    = useState(false); // email found in active subscriptions — hide password

  // ── City not found
  if (citySlug && !cityName) {
    return (
      <div>
        <Navigation />
        <div className="sub-not-found">
          <h2>Page not found</h2>
          <Link href="/" className="btn-primary">Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check if this email already exists as an active subscriber
      const { data: existingRows } = await supabase
        .from('newsletter_subscriptions')
        .select('id, first_name, user_id')
        .eq('email', cleanEmail)
        .eq('status', 'active')
        .limit(1);

      const alreadySubscriber = existingRows && existingRows.length > 0;

      if (alreadySubscriber) {
        // Check if they already have THIS specific calendar active
        const exactQuery = supabase
          .from('newsletter_subscriptions')
          .select('id')
          .eq('email', cleanEmail)
          .eq('city', cityName ?? '')
          .eq('status', 'active');
        const { data: exactMatch } = subCalName
          ? await exactQuery.eq('sub_calendar', subCalName)
          : await exactQuery.is('sub_calendar', null);

        if (exactMatch && exactMatch.length > 0) {
          setAlreadyHasThis(true);
          setSuccess(true);
          setLoading(false);
          return;
        }

        // Returning subscriber — just add this calendar, no auth needed
        const existing = existingRows[0];
        await supabase
          .from('newsletter_subscriptions')
          .upsert({
            user_id:      existing.user_id ?? null,
            email:        cleanEmail,
            first_name:   (existing.first_name ?? firstName.trim()) || null,
            city:         cityName,
            sub_calendar: subCalName ?? null,
            status:       'active',
            source:       'added_calendar',
          }, { onConflict: 'email,city,sub_calendar' });

        setIsReturning(true);
        setSuccess(true);
        setLoading(false);
        return;
      }

      // New subscriber — full signup/signin flow
      let userId: string | null = null;

      if (mode === 'signup') {
        const { error: authError, data } = await signUp(email, password, firstName);
        if (authError) { setError(authError.message); setLoading(false); return; }
        userId = data?.user?.id ?? null;
      } else {
        const { error: authError, data } = await signIn(email, password);
        if (authError) { setError(authError.message); setLoading(false); return; }
        userId = data?.user?.id ?? user?.id ?? null;
      }

      // Save the subscription row
      const { error: insertError } = await supabase
        .from('newsletter_subscriptions')
        .upsert({
          user_id:      userId,
          email:        cleanEmail,
          first_name:   firstName.trim() || null,
          city:         cityName,
          sub_calendar: subCalName ?? null,
          status:       'active',
          source:       'new_signup',
        }, { onConflict: 'email,city,sub_calendar' });

      if (insertError) {
        console.error('Subscription error:', insertError.message);
      }

      // Auto-enroll in LBO for this city (same Supabase auth — account already exists)
      if (cityName) {
        supabase.from('lbo_users').upsert({
          email:  cleanEmail,
          city:   cityName,
          source: 'lbc_signup',
        }, { onConflict: 'email' }).then(({ error }) => {
          if (error) console.error('LBO upsert error:', error.message);
        });
      }

      // Send welcome email (new signups only)
      if (mode === 'signup') {
        fetch('/api/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:       cleanEmail,
            firstName:   firstName.trim() || null,
            city:        cityName,
            subCalendar: subCalName ?? null,
          }),
        }).catch(err => console.error('Welcome email error:', err));
      }

      setSuccess(true);
      // No auto-redirect — user chooses where to go from success screen

    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen
  if (success) {
    return (
      <div>
        <Navigation />
        <div className="sub-success-wrap">
          <div className="sub-success-card">
            <div className="sub-success-icon"><i className="ti ti-circle-check" style={{ fontSize: '3rem', color: 'var(--color-accent)' }} aria-hidden="true" /></div>
            {alreadyHasThis ? (
              <>
                <h2>You're already subscribed!</h2>
                <p>
                  You're already getting the <strong>{subscriptionLabel}</strong> newsletter every Monday.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                  <Link href="/account">Manage my subscriptions →</Link>
                </p>
              </>
            ) : isReturning ? (
              <>
                <h2>Added to your subscriptions!</h2>
                <p>
                  The <strong>{subscriptionLabel}</strong> newsletter has been added to your account.
                  You'll start receiving it in your next Monday digest.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                  <Link href="/account">View all my subscriptions →</Link>
                </p>
              </>
            ) : (
              <>
                <h2>{firstName ? `Welcome, ${firstName}!` : "You're on the list!"}</h2>
                <p>
                  You're now subscribed to the <strong>{subscriptionLabel}</strong> weekly newsletter.
                  Your first digest arrives next Monday morning.
                </p>
                {cityName && (
                  <p style={{ fontSize: '0.9rem', background: '#f0f4ff', borderLeft: '3px solid #1a3a5c', padding: '0.75rem 1rem', borderRadius: '4px', textAlign: 'left', lineHeight: '1.5' }}>
                    <strong>Bonus:</strong> Your account also gives you free access to{' '}
                    <a href={`https://www.localbusinessorganizations.com`} target="_blank" rel="noopener noreferrer" style={{ color: '#1a3a5c', fontWeight: '600' }}>
                      Local Business Organizations
                    </a>
                    {' '}— a directory of {cityName} business organizations, chambers, and associations. Same login, no extra signup needed.
                  </p>
                )}
              </>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
              <Link href={cityRoute} className="sub-go-btn">
                Go to {isSubCal ? `${cityName} ${subCalName}` : cityName} calendar <ArrowRight size={16} />
              </Link>
              <Link href="/account" style={{ fontSize: '0.88rem', color: 'var(--color-muted)', textAlign: 'center', textDecoration: 'none' }}>
                View all my subscriptions →
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Other calendars to cross-promote (exclude current city if sub-cal page, or current city-wide)
  const otherCities = CITIES.filter(c => c.name !== cityName);
  // Always show current city's sub-cals if on a city-wide page, or other cities fully
  const currentCitySubCals = isSubCal
    ? SUB_CALENDARS.filter(s => s.key !== subCalName)
    : SUB_CALENDARS;

  // ── Main page
  return (
    <div>
      <Navigation />

      {/* Hero */}
      <div className="sub-hero">
        <div className="sub-hero-inner">
          <div className="sub-hero-badge">Free Weekly Newsletter</div>
          <h1>
            {isSubCal
              ? `Get ${cityName} ${subCalName} Events in Your Inbox`
              : `Get ${cityName} Business Events in Your Inbox`}
          </h1>
          <p className="sub-hero-desc">{pageDesc} Get the full week's events delivered every Monday morning — free.</p>
        </div>
      </div>

      <div className="sub-body">

        {/* Two-column section: perks + form */}
        <div className="sub-body-inner">

          {/* Perks */}
          <div className="sub-perks">
            <h2 className="sub-perks-title">What you get — completely free</h2>
            <div className="sub-perks-grid">
              {PERKS.map(({ icon, title, desc }) => (
                <div key={title} className="sub-perk-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <i className={`ti ${icon}`} style={{ position: 'absolute', bottom: '-4px', right: '6px', fontSize: '2.25rem', color: '#c2410c', opacity: 0.15, pointerEvents: 'none' }} aria-hidden="true" />
                  <h3 style={{ position: 'relative' }}>{title}</h3>
                  <p style={{ position: 'relative' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="sub-form-wrap">
            <div className="sub-form-card">

              {/* What they're signing up for */}
              <div className="sub-subscribing-to">
                Subscribing to: <strong>{subscriptionLabel}</strong>
              </div>

              {/* Tabs */}
              <div className="sub-form-tabs">
                <button className={`sub-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
                  Create account
                </button>
                <button className={`sub-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>
                  <LogIn size={14} /> Log in
                </button>
              </div>

              <p className="sub-form-sub">
                {mode === 'signup'
                  ? `Create a free account to subscribe to the ${subscriptionLabel} newsletter.`
                  : `Welcome back — log in to add the ${subscriptionLabel} newsletter to your account.`}
              </p>

              <form onSubmit={handleSubmit} className="sub-form">

                {mode === 'signup' && (
                  <div className="sub-field">
                    <label htmlFor="sub-firstname">First name</label>
                    <input
                      id="sub-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      required
                    />
                  </div>
                )}

                <div className="sub-field">
                  <label htmlFor="sub-email">Email address</label>
                  <input
                    id="sub-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailIsKnown(false); }}
                    onBlur={async (e) => {
                      const val = e.target.value.trim().toLowerCase();
                      if (!val.includes('@')) return;
                      const { data } = await supabase
                        .from('newsletter_subscriptions')
                        .select('id')
                        .eq('email', val)
                        .eq('status', 'active')
                        .limit(1);
                      setEmailIsKnown(!!(data && data.length > 0));
                    }}
                    placeholder="you@example.com"
                    required
                  />
                  {emailIsKnown && (
                    <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem' }}>
                      ✓ We recognize this email — just click Subscribe below, no password needed.
                    </p>
                  )}
                </div>

                {!emailIsKnown && (
                  <div className="sub-field">
                    <label htmlFor="sub-password">Password</label>
                    <input
                      id="sub-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                )}

                {error && <div className="sub-error">{error}</div>}

                <button type="submit" className="sub-submit" disabled={loading}>
                  {loading ? 'Please wait...' : emailIsKnown ? 'Subscribe — Free' : mode === 'signup' ? 'Subscribe — Free' : 'Log in'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              <p className="sub-fine-print">No credit card required. Unsubscribe any time.</p>
            </div>
          </div>

        </div>{/* end sub-body-inner */}

        {/* ── Other Calendars Section — full width below the two-column grid ── */}
        <div className="sub-other-cals">
            <h2 className="sub-other-title">Explore other calendars</h2>
            <p className="sub-other-desc">
              Feel free to sign up for any of our other city and industry-specific newsletters — each one is a free, independent weekly email.
            </p>

            <div className="sub-other-grid">

              {/* Current city's other sub-calendars (if on city-wide page) */}
              {!isSubCal && cityName && (
                <div className="sub-other-city-block">
                  <div className="sub-other-city-name">{cityName} — Sub-Calendars</div>
                  <div className="sub-other-links">
                    {SUB_CALENDARS.map(({ key, slug }) => (
                      <Link
                        key={key}
                        href={`/texas/${citySlug}/${slug}/subscribe`}
                        className="sub-other-link"
                      >
                        {cityName} {key} <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Current city's other sub-cals (if on a sub-cal page) */}
              {isSubCal && cityName && (
                <div className="sub-other-city-block">
                  <div className="sub-other-city-name">More {cityName} Calendars</div>
                  <div className="sub-other-links">
                    <Link href={`/texas/${citySlug}/subscribe`} className="sub-other-link">
                      {cityName} (all events) <ArrowRight size={12} />
                    </Link>
                    {currentCitySubCals.map(({ key, slug }) => (
                      <Link
                        key={key}
                        href={`/texas/${citySlug}/${slug}/subscribe`}
                        className="sub-other-link"
                      >
                        {cityName} {key} <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Other cities */}
              {otherCities.map(({ name, slug }) => (
                <div key={name} className="sub-other-city-block">
                  <div className="sub-other-city-name">{name}</div>
                  <div className="sub-other-links">
                    <Link href={`/texas/${slug}/subscribe`} className="sub-other-link sub-other-link--city">
                      {name} (all events) <ArrowRight size={12} />
                    </Link>
                    {SUB_CALENDARS.map(({ key, slug: subSlugVal }) => (
                      <Link
                        key={key}
                        href={`/texas/${slug}/${subSlugVal}/subscribe`}
                        className="sub-other-link"
                      >
                        {name} {key} <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </div>

      </div>{/* end sub-body */}

      <Footer />
    </div>
  );
}
