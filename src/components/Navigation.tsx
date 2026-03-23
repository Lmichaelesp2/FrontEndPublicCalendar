import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

export function Navigation() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
              Local <span>Business Calendars</span>
            </span>
          </Link>
          <div className="nav-links">
            <Link to="/texas" className="nav-city-link">Texas</Link>
            {CITY_CONFIGS.map((c) => (
              <Link key={c.slug} to={`/texas/${c.slug}`} className="nav-city-link">
                {c.name}
              </Link>
            ))}
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
