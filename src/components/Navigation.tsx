'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, ChevronDown, User } from 'lucide-react';
import { useRef } from 'react';
import { CITY_CONFIGS } from '../lib/cities';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

function getDayDateline(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();
}

const CITY_SLUG_TO_NAME: Record<string, string> = {
  'san-antonio': 'San Antonio',
  'austin': 'Austin',
  'dallas': 'Dallas',
  'houston': 'Houston',
};

const CAT_SLUG_TO_NAME: Record<string, string> = {
  'technology': 'Technology',
  'chamber': 'Chamber',
  'networking': 'Networking',
  'real-estate': 'Real Estate',
  'small-business': 'Small Business',
};

function getSubscribeUrl(pathname: string): string {
  // /texas/city/category → /texas/city/category/subscribe
  const subCatMatch = pathname.match(/^(\/texas\/[a-z-]+\/[a-z-]+)/);
  if (subCatMatch) {
    const base = subCatMatch[1];
    if (!base.endsWith('/subscribe')) return `${base}/subscribe`;
  }
  // /texas/city → /texas/city/subscribe
  const cityMatch = pathname.match(/^(\/texas\/[a-z-]+)/);
  if (cityMatch) {
    const base = cityMatch[1];
    if (!base.endsWith('/subscribe')) return `${base}/subscribe`;
  }
  // Homepage or /texas → use San Antonio as a sensible default
  return '/subscribe';
}

function getWordmarkAndTagline(pathname: string): { wordmark: React.ReactNode; tagline: string } {
  // /texas/san-antonio/technology, /texas/austin/chamber, etc.
  const subCatMatch = pathname.match(/^\/texas\/([a-z-]+)\/([a-z-]+)/);
  if (subCatMatch) {
    const citySlug = subCatMatch[1];
    const catSlug = subCatMatch[2];
    const cityName = CITY_SLUG_TO_NAME[citySlug];
    const catName = CAT_SLUG_TO_NAME[catSlug];
    if (cityName && catName) {
      return {
        wordmark: <><em>{cityName}</em> {catName} Calendar</>,
        tagline: 'Part of the Local Business Calendars Network',
      };
    }
    if (cityName) {
      return {
        wordmark: <><em>{cityName}</em> Business Calendar</>,
        tagline: 'Part of the Local Business Calendars Network',
      };
    }
  }
  // /texas/san-antonio etc.
  const cityMatch = pathname.match(/^\/texas\/([a-z-]+)/);
  if (cityMatch) {
    const cityName = CITY_SLUG_TO_NAME[cityMatch[1]];
    if (cityName) {
      return {
        wordmark: <><em>{cityName}</em> Business Calendar</>,
        tagline: 'Part of the Local Business Calendars Network',
      };
    }
  }
  // /texas
  if (pathname === '/texas' || pathname.startsWith('/texas')) {
    return {
      wordmark: <>Texas <em>Business</em> Calendars</>,
      tagline: 'Part of the Local Business Calendars Network',
    };
  }
  // Home / everything else
  return {
    wordmark: <>Local <em>Business</em> Calendars</>,
    tagline: 'Networking & Business Events · By City & Industry',
  };
};


export function Navigation() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'signin'>('signup');
  const [accountDropOpen, setAccountDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleOpenAuth() { setAuthModalOpen(true); }
    document.addEventListener('open-auth-modal', handleOpenAuth);
    return () => document.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function openAuth(mode: 'signup' | 'signin') {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  const dateline = getDayDateline();
  const { wordmark, tagline } = getWordmarkAndTagline(pathname ?? '/');
  const subscribeUrl = getSubscribeUrl(pathname ?? '/');

  return (
    <>
      <header className="nav">
        <div className="nav-inner">

          {/* ── Dateline (left) ── */}
          <span className="nav-dateline">{dateline}</span>

          {/* ── Wordmark (center) ── */}
          <Link href="/" className="nav-logo">
            <span className="nav-logo-text wordmark">
              {wordmark}
            </span>
            <span className="nav-tagline">
              {tagline}
            </span>
          </Link>

          {/* ── Live indicator ── */}
          <span className="nav-live">
            <span className="nav-live-dot" />
            This Week's Events&nbsp;&middot;&nbsp;Live
          </span>

          {/* ── Mobile toggle ── */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Bottom nav bar ── */}
        <div className={`nav-links${mobileMenuOpen ? ' nav-links-mobile-open' : ''}`}>
          <div className="nav-links-inner">

            <nav className="nav-city-links" aria-label="Browse by city">
              <Link href="/texas" className="nav-link">Texas</Link>
              {CITY_CONFIGS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/texas/${c.slug}`}
                  className="nav-link"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/submit" className="nav-link">Submit Event</Link>
            </nav>

            <div className="nav-actions">
              {user ? (
                <div className="nav-account-wrap" ref={dropRef}>
                  <button
                    className="nav-account-btn"
                    onClick={() => setAccountDropOpen(o => !o)}
                  >
                    <User size={14} />
                    <span>Hi, {profile?.first_name || 'Member'}</span>
                    <ChevronDown size={13} className={accountDropOpen ? 'nav-chevron-open' : ''} />
                  </button>
                  {accountDropOpen && (
                    <div className="nav-account-drop">
                      <div className="nav-account-email">{user.email}</div>
                      <Link
                        href="/account"
                        className="nav-account-drop-item"
                        onClick={() => setAccountDropOpen(false)}
                      >
                        <User size={13} />
                        My Account
                      </Link>
                      <button
                        className="nav-account-drop-item nav-account-signout"
                        onClick={() => { setAccountDropOpen(false); handleLogout(); }}
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="nav-signin-btn" onClick={() => openAuth('signin')}>
                    Sign In
                  </button>
                  <Link href={subscribeUrl} className="nav-cta">
                    Sign Up — Free →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </>
  );
}
