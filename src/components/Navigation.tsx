'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

export function Navigation() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [citiesDropdownOpen, setCitiesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const isMainTexasPage = pathname === '/texas';
  const isOnCityOrSubcategoryPage = pathname.startsWith('/texas/') && pathname !== '/texas/';

  useEffect(() => {
    function handleOpenAuth() {
      setAuthModalOpen(true);
    }
    document.addEventListener('open-auth-modal', handleOpenAuth);
    return () => document.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown-wrapper')) {
        setCitiesDropdownOpen(false);
      }
    }

    if (citiesDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [citiesDropdownOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  return (
    <>
      <nav className={`nav${isHomepage ? ' nav-homepage' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className={`nav-logo-text${isHomepage ? ' nav-logo-text-hp' : ''}`}>
              Local <span>Business Calendars</span>
            </span>
          </Link>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-links${mobileMenuOpen ? ' nav-links-mobile-open' : ''}`}>
            {isHomepage || isMainTexasPage ? (
              <>
                <div className="nav-dropdown-wrapper">
                  <button
                    className="nav-dropdown-trigger"
                    onClick={() => setCitiesDropdownOpen(!citiesDropdownOpen)}
                    aria-expanded={citiesDropdownOpen}
                  >
                    Cities <ChevronDown size={16} />
                  </button>
                  {citiesDropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <Link href="/texas" className="nav-dropdown-item">All Texas Cities</Link>
                      {CITY_CONFIGS.map((c) => (
                        <Link key={c.slug} href={`/texas/${c.slug}`} className="nav-dropdown-item">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="nav-dropdown-wrapper">
                  <button
                    className="nav-dropdown-trigger"
                    onClick={() => setCitiesDropdownOpen(!citiesDropdownOpen)}
                    aria-expanded={citiesDropdownOpen}
                  >
                    Texas <ChevronDown size={16} />
                  </button>
                  {citiesDropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <Link href="/texas" className="nav-dropdown-item">All Texas Cities</Link>
                      {CITY_CONFIGS.map((c) => (
                        <Link key={c.slug} href={`/texas/${c.slug}`} className="nav-dropdown-item">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/submit">Submit Event</Link>
            <Link href="/sponsor" className="nav-sponsor-link">Sponsor</Link>
            <Link href="/admin">Admin</Link>
            {user ? (
              <button
                className="nav-auth-badge nav-auth-logged-in"
                onClick={handleLogout}
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                className="nav-auth-badge nav-auth-logged-out"
                onClick={() => setAuthModalOpen(true)}
                title="Sign In"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
