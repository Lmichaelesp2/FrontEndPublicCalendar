import { useState } from 'react';
import { LogIn, CalendarDays, Mail, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

type CityLoginBannerProps = {
  cityName: string;
};

export function CityLoginBanner({ cityName }: CityLoginBannerProps) {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading || user) return null;

  return (
    <>
      <div className="city-login-banner">
        <div className="city-login-banner-inner">
          <div className="city-login-banner-left">
            <div className="city-login-banner-icon">
              <CalendarDays size={28} strokeWidth={1.8} />
            </div>
            <div className="city-login-banner-text">
              <p className="city-login-banner-headline">
                Already subscribed to {cityName}?
              </p>
              <p className="city-login-banner-sub">
                Log in to access your full calendar and weekly event updates.
              </p>
            </div>
          </div>
          <div className="city-login-banner-right">
            <div className="city-login-banner-perks">
              <span><Mail size={13} /> Weekly digest</span>
              <span><Star size={13} /> Full calendar access</span>
            </div>
            <button
              className="city-login-btn"
              onClick={() => setAuthModalOpen(true)}
            >
              <LogIn size={16} />
              Log In to Your Account
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
