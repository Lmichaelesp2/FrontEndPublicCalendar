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
import { SHOW_SPONSOR_SECTIONS } from '../lib/featureFlags';

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
  // 'networking': 'Networking', // temporarily hidden
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

function isCityPage(pathname: string): boolean {
  // True for /texas/[city] and /texas/[city]/[subcategory] — NOT for / or /texas
  return /^\/texas\/[a-z-]+(\/[a-z-]+)?$/.test(pathname);
}

function getModalContext(pathname: string): { cityName: string; calendarLabel: string } {
  const subCatMatch = pathname.match(/^\/texas\/([a-z-]+)\/([a-z-]+)/);
  if (subCatMatch) {
    const city = CITY_SLUG_TO_NAME[subCatMatch[1]] || '';
    const cat  = CAT_SLUG_TO_NAME[subCatMatch[2]]  || '';
    return {
      cityName:      city,
      calendarLabel: city && cat ? `${city} ${cat} Calendar` : city ? `${city} Business Calendar` : '',
    };
  }
  const cityMatch = pathname.match(/^\/texas\/([a-z-]+)/);
  if (cityMatch) {
    const city = CITY_SLUG_TO_NAME[cityMatch[1]] || '';
    return { cityName: city, calendarLabel: city ? `${city} Business Calendar` : '' };
  }
  return { cityName: '', calendarLabel: '' };
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
        wordmark: <><span className="wm-city">{cityName}</span><span className="wm-rest"> {catName} Calendar</span></>,
        tagline: 'Part of the Local Business Calendars Network',
      };
    }
    if (cityName) {
      return {
        wordmark: <><span className="wm-city">{cityName}</span><span className="wm-rest"> Business Calendar</span></>,
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
        wordmark: <><span className="wm-city">{cityName}</span><span className="wm-rest"> Business Calendar</span></>,
        tagline: 'Part of the Local Business Calendars Network',
      };
    }
  }
  // /texas
  if (pathname === '/texas' || pathname.startsWith('/texas')) {
    return {
      wordmark: <><span className="wm-city">Texas</span><span className="wm-rest"> Business Calendars</span></>,
      tagline: 'Part of the Local Business Calendars Network',
    };
  }
  // Home / everything else
  return {
    wordmark: <><span className="wm-city">Local</span><span className="wm-rest"> Business Calendars</span></>,
    tagline: 'Networking & Business Events · By City & Industry',
  };
};



function CitiesDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const cities = [
    { name: 'San Antonio', slug: 'san-antonio' },
    { name: 'Austin',      slug: 'austin' },
    { name: 'Dallas',      slug: 'dallas' },
    { name: 'Houston',     slug: 'houston' },
  ];
  const isActive = cities.some(c => pathname.startsWith(`/texas/${c.slug}`));

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="nav-resources-wrap" ref={ref}>
      <button
        className={`nav-link nav-resources-btn${isActive ? ' nav-link--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        Cities <ChevronDown size={12} className={open ? 'nav-chevron-open' : ''} />
      </button>
      {open && (
        <div className="nav-resources-drop nav-cities-drop">
          {cities.map(city => (
            <Link
              key={city.slug}
              href={`/texas/${city.slug}`}
              className={`nav-resources-item nav-cities-item${pathname.startsWith(`/texas/${city.slug}`) ? ' nav-cities-item--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {city.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourcesDropdown() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="nav-resources-wrap" ref={ref}>
      <button
        className="nav-link nav-resources-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        More <ChevronDown size={12} className={open ? 'nav-chevron-open' : ''} />
      </button>
      {open && (
        <div className="nav-resources-drop">
          <Link
            href="/pricing"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Pricing</span>
            <span className="nav-resources-item-desc">Free calendar & Event Assistant plans</span>
          </Link>
          <Link
            href="/event-assistant"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Event Assistant</span>
            <span className="nav-resources-item-desc">Personalized events & weekly digest — $14.99/mo</span>
          </Link>
          <Link
            href="/agency"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Event Networking Studio</span>
            <span className="nav-resources-item-desc">Strategic event networking for professionals</span>
          </Link>
          <Link
            href="/local-business-networking-method"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Local Business Networking Method</span>
            <span className="nav-resources-item-desc">Turn your local network into customers</span>
          </Link>
          <Link
            href="/sponsors"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Our Sponsors</span>
            <span className="nav-resources-item-desc">Meet the organizations that make this free</span>
          </Link>
          <Link
            href="/sponsor"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Become a Sponsor</span>
            <span className="nav-resources-item-desc">Reach local business professionals every week</span>
          </Link>
          <Link
            href="/help"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Help & Getting Started</span>
            <span className="nav-resources-item-desc">How the calendar works, how to subscribe</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function SponsorsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="nav-resources-wrap" ref={ref}>
      <button
        className="nav-link nav-resources-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        Sponsors <ChevronDown size={12} className={open ? 'nav-chevron-open' : ''} />
      </button>
      {open && (
        <div className="nav-resources-drop">
          <Link
            href="/sponsors"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Our Sponsors</span>
            <span className="nav-resources-item-desc">Meet the organizations that make this free</span>
          </Link>
          <Link
            href="/sponsor"
            className="nav-resources-item"
            onClick={() => setOpen(false)}
          >
            <span className="nav-resources-item-title">Become a Sponsor</span>
            <span className="nav-resources-item-desc">Reach local business professionals every week</span>
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Classic Calendar Login Modal (city picker) ───────────────────
const CLASSIC_CITIES = [
  { name: 'San Antonio', slug: 'san-antonio' },
  { name: 'Austin',      slug: 'austin' },
  { name: 'Dallas',      slug: 'dallas' },
  { name: 'Houston',     slug: 'houston' },
];

function PremiumLoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; citySlug?: string }) {
  if (!isOpen) return null;

  return (
    <div className="prem-modal-overlay" onClick={onClose}>
      <div className="prem-modal prem-modal--city" onClick={e => e.stopPropagation()}>
        <button className="prem-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="prem-modal-header">
          <span className="prem-modal-crown">👑</span>
          <h2 className="prem-modal-title">Classic Calendar Login</h2>
          <p className="prem-modal-sub">Select your city to log in</p>
        </div>

        <div className="prem-city-grid">
          {CLASSIC_CITIES.map(city => (
            <a
              key={city.slug}
              className="prem-city-btn"
              href={`https://www.localbusinesscalendars.app/${city.slug}/login`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <span className="prem-city-name">{city.name}</span>
              <span className="prem-city-arrow">→</span>
            </a>
          ))}
        </div>

        <p className="prem-modal-footer">
          Looking for the new calendar?&nbsp;
          <button className="prem-modal-upgrade-link" onClick={() => {
            onClose();
            document.dispatchEvent(new CustomEvent('open-auth-modal'));
          }}>
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}

export function Navigation() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'signin'>('signup');
  const [accountDropOpen, setAccountDropOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
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
    window.location.href = '/';
  }

  const dateline = getDayDateline();
  const { wordmark, tagline } = getWordmarkAndTagline(pathname ?? '/');
  const subscribeUrl = getSubscribeUrl(pathname ?? '/');
  const modalContext = getModalContext(pathname ?? '/');

  // Extract city slug for old-calendar URL in premium modal
  const citySlugMatch = (pathname ?? '').match(/^\/texas\/([a-z-]+)/);
  const currentCitySlug = citySlugMatch ? citySlugMatch[1] : 'san-antonio';

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
              <Link href="/texas" className={`nav-link${pathname === '/texas' ? ' nav-link--active' : ''}`}>Texas</Link>
              <CitiesDropdown pathname={pathname ?? '/'} />
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
              <Link href="/help" className={`nav-link${pathname === '/help' ? ' nav-link--active' : ''}`}>Help</Link>
              {SHOW_SPONSOR_SECTIONS ? <SponsorsDropdown /> : null}
            </nav>

            <div className="nav-actions">
              {/* Networking Assistant — premium users only */}
              {user && profile?.subscription_tier && profile.subscription_tier !== 'free' && (
                <Link
                  href="/networking-assistant"
                  className="nav-link"
                  style={{ marginRight: '4px' }}
                >
                  Networking Assistant ✦
                </Link>
              )}

              {/* Cross-link to LBO */}
              <a
                href="https://www.localbusinessorganizations.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link nav-link--organizations"
                style={{ marginRight: '4px' }}
              >
                Organizations ↗
              </a>

              {/* Premium Login — SA pages only */}
              {!user && /^\/texas\/san-antonio(\/|$)/.test(pathname ?? '') && (
                <a
                  href="https://www.localbusinesscalendars.app/san-antonio/login"
                  className="nav-classic-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Log in to your premium calendar account"
                >
                  Premium Login
                </a>
              )}

              {user && isCityPage(pathname ?? '') ? (
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
              ) : user ? (
                <Link href={subscribeUrl} className="nav-cta">
                  Subscribe Free →
                </Link>
              ) : (
                <>
                  <Link href={subscribeUrl} className="nav-cta">
                    Subscribe Free →
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
        cityName={modalContext.calendarLabel}
      />

      <PremiumLoginModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </>
  );
}
