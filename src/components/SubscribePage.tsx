import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Mail, CalendarDays, Search, ArrowRight, LogIn } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useAuth } from '../contexts/AuthContext';

const CITY_SLUGS: Record<string, string> = {
  austin: 'Austin',
  dallas: 'Dallas',
  houston: 'Houston',
  'san-antonio': 'San Antonio',
};

const CITY_DESCRIPTIONS: Record<string, string> = {
  Austin: "The Texas capital's thriving startup and business community — chambers, tech meetups, industry conferences, and more.",
  Dallas: "DFW's professional network is one of the largest in the country. Never miss a chamber event, summit, or mixer again.",
  Houston: "From energy sector events to multicultural chambers, Houston has one of the most active business calendars in Texas.",
  'San Antonio': "The Alamo City's booming professional scene — SA Chamber, Hispanic Chamber, SCORE workshops, and local mixers.",
};

const PERKS = [
  { icon: Mail, title: 'Weekly Monday newsletter', desc: 'A curated digest of the week\'s best events lands in your inbox every Monday morning.' },
  { icon: CalendarDays, title: 'Never miss an event', desc: 'Stop checking multiple sites. We do the searching so you can focus on showing up.' },
  { icon: Search, title: 'Curated for your city', desc: 'Only events that matter to professionals in your area — no noise, no fluff.' },
];

export function SubscribePage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();

  const cityName = citySlug ? CITY_SLUGS[citySlug] : undefined;
  const cityDesc = cityName ? CITY_DESCRIPTIONS[cityName] : '';

  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!cityName) {
    return (
      <div>
        <Navigation />
        <div className="sub-not-found">
          <h2>City not found</h2>
          <Link to="/" className="btn-primary">Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cityRoute = `/texas/${citySlug}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = mode === 'signup'
        ? await signUp(email, password)
        : await signIn(email, password);
      if (authError) {
        setError(authError.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate(cityRoute), 2000);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (user || success) {
    return (
      <div>
        <Navigation />
        <div className="sub-success-wrap">
          <div className="sub-success-card">
            <div className="sub-success-icon"><CheckCircle size={48} strokeWidth={1.5} /></div>
            <h2>You're on the list for {cityName}!</h2>
            <p>You'll get your first weekly newsletter next Monday. Redirecting to the calendar now...</p>
            <Link to={cityRoute} className="sub-go-btn">
              Go to {cityName} calendar <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navigation />

      <div className="sub-hero">
        <div className="sub-hero-inner">
          <div className="sub-hero-badge">Free Weekly Newsletter</div>
          <h1>Get {cityName} Events in Your Inbox</h1>
          <p className="sub-hero-desc">Don't want to check back every week? Get the full week's events delivered to your inbox every Monday morning. {cityDesc}</p>
        </div>
      </div>

      <div className="sub-body">
        <div className="sub-body-inner">

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

          <div className="sub-form-wrap">
            <div className="sub-form-card">
              <div className="sub-form-tabs">
                <button
                  className={`sub-tab ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => setMode('signup')}
                >
                  Create account
                </button>
                <button
                  className={`sub-tab ${mode === 'signin' ? 'active' : ''}`}
                  onClick={() => setMode('signin')}
                >
                  <LogIn size={14} />
                  Log in
                </button>
              </div>

              <p className="sub-form-sub">
                {mode === 'signup'
                  ? `Sign up to get ${cityName}'s best networking and business events delivered to your inbox every Monday.`
                  : `Welcome back — log in to manage your ${cityName} newsletter subscription.`}
              </p>

              <form onSubmit={handleSubmit} className="sub-form">
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
                  {loading
                    ? 'Please wait...'
                    : mode === 'signup'
                    ? `Get the Weekly Newsletter — Free`
                    : 'Log in'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              <p className="sub-fine-print">No credit card required. Unsubscribe any time.</p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
