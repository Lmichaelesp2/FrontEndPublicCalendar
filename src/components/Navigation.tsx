import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

export function Navigation() {
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCitiesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleOpenAuth() {
      setAuthModalOpen(true);
    }
    document.addEventListener('open-auth-modal', handleOpenAuth);
    return () => document.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-text">
              Texas <span>Business Calendars</span>
            </span>
          </Link>
          <div className="nav-links">
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                className="nav-dropdown-trigger"
                onClick={() => setCitiesOpen(!citiesOpen)}
                aria-expanded={citiesOpen}
              >
                Cities <ChevronDown size={14} />
              </button>
              {citiesOpen && (
                <div className="nav-dropdown-menu">
                  <Link to="/" onClick={() => setCitiesOpen(false)}>
                    All Texas
                  </Link>
                  {CITY_CONFIGS.map((c) => (
                    <Link key={c.slug} to={`/${c.slug}`} onClick={() => setCitiesOpen(false)}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <a href="#calendar">Calendar</a>
            <Link to="/submit">Submit Event</Link>
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
            <Link to="/admin" className="text-sm opacity-60 hover:opacity-100">Admin</Link>
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
