'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

export function Navigation() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [texasDropdownOpen, setTexasDropdownOpen] = useState(false);
  const [floridaDropdownOpen, setFloridaDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  useEffect(() => {
    function handleOpenAuth() {
      setAuthModalOpen(true);
    }
    document.addEventListener('open-auth-modal', handleOpenAuth);
    return () => document.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

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
          <div className="nav-links">
            {isHomepage ? (
              <>
                <div className="nav-dropdown-wrapper">
                  <button
                    className="nav-dropdown-trigger"
                    onClick={() => setTexasDropdownOpen(!texasDropdownOpen)}
                    aria-expanded={texasDropdownOpen}
                  >
                    Texas <ChevronDown size={16} />
                  </button>
                  {texasDropdownOpen && (
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
                <div className="nav-dropdown-wrapper">
                  <button
                    className="nav-dropdown-trigger"
                    onClick={() => setFloridaDropdownOpen(!floridaDropdownOpen)}
                    aria-expanded={floridaDropdownOpen}
                  >
                    Florida <ChevronDown size={16} />
                  </button>
                  {floridaDropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <div className="nav-dropdown-item nav-coming-soon-item">Coming Soon</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/texas" className="nav-city-link">Texas</Link>
                {CITY_CONFIGS.map((c) => (
                  <Link key={c.slug} href={`/texas/${c.slug}`} className="nav-city-link">
                    {c.name}
                  </Link>
                ))}
              </>
            )}
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/submit">Submit Event</Link>
            <Link href="/admin">Admin</Link>
            {user ? (
              <button
                className="nav-logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button
                className="nav-user-btn"
                onClick={() => setAuthModalOpen(true)}
                title="Sign In"
              >
                <User size={18} />
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
