'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, CalendarDays, Search, ArrowRight, LogIn } from 'lucide-react';
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
  { icon: Mail,         title: 'Weekly Monday newsletter', desc: "A curated digest of the week's best events lands in your inbox every Monday morning." },
  { icon: CalendarDays, title: 'Never miss an event',      desc: 'Stop checking multiple sites. We do the searching so you can focus on showing up.' },
  { icon: Search,       title: 'Curated for your city',    desc: 'Only events that matter to professionals in your area — no noise, no fluff.' },
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
  const [mode,       setMode]      = useState<'signup' | 'signin'>('signup');
  const [firstName,  setFirstName] = useState('');
  const [email,      setEmail]     = useState('');
  const [password,   setPassword]  = useState('');
  const [error,      setError]     = useState('');
  const [loading,    setLoading]   = useState(false);
  const [success,    setSuccess]   = useState(false);

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

      // Save the single subscription row
      const { error: insertError } = await supabase
        .from('newsletter_subscriptions')
        .upsert({
          user_id:      userId,
          email:        email.trim().toLowerCase(),
          first_name:   firstName.trim() || null,
          city:         cityName,
          sub_calendar: subCalName ?? null,
          status:       'active',
          source:       'new_signup',
        }, { onConflict: 'email,city,sub_calendar' });

      if (insertError) {
        console.error('Subscription error:', insertError.message);
        // Non-fatal — account was created, subscription may already exist
      }

      setSuccess(true);
      setTimeout(() => router.push(cityRoute), 5000);

    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen
  if (success || user) {
    return (
      <div>
        <Navigation />
        <div className="sub-success-wrap">
          <div className="sub-success-card">
            <div className="sub-success-icon"><CheckCircle size={48} strokeWidth={1.5} /></div>
            <h2>
              {firstName ? `Welcome, ${firstName}!` : "You're on the list!"}
            </h2>
            <p>
              You're now subscribed to the <strong>{subscriptionLabel}</strong> weekly newsletter.
              Your first digest arrives next Monday morning.
            </p>
            <p className="sub-success-redirect">Taking you to the calendar...</p>
            <Link href={cityRoute} className="sub-go-btn">
              Go to {isSubCal ? `${cityName} ${subCalName}` : cityName} calendar <ArrowRight size={16} />
            </Link>
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
              {PERKS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="sub-perk-card">
                  <div className="sub-perk-icon"><Icon size={26} strokeWidth={1.7} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

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

                {error && <div className="sub-error">{error}</div>}

                <button type="submit" className="sub-submit" disabled={loading}>
                  {loading ? 'Please wait...' : mode === 'signup' ? 'Subscribe — Free' : 'Log in'}
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
