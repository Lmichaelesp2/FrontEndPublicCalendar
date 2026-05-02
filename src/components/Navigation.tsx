'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
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

export function Navigation() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
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

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  const dateline = getDayDateline();

  return (
    <>
      <header className="nav">
        <div className="nav-inner">

          {/* ── Dateline (left) ── */}
          <span className="nav-dateline">{dateline}</span>

          {/* ── Wordmark (center) ── */}
          <Link href="/" className="nav-logo">
            <span className="nav-logo-text wordmark">
              Local <em>Business</em> Calendars
            </span>
            <span className="nav-tagline">
              Networking &amp; Business Events&nbsp;&middot;&nbsp;By City &amp; Industry
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
                <button
                  className="nav-auth-badge nav-auth-logged-in"
                  onClick={handleLogout}
                  title="Log Out"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              ) : (
                <button
                  className="nav-cta"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Sign Up — Free →
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
