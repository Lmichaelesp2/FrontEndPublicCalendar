import { Link } from 'react-router-dom';
import { Mail, CalendarDays } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';

type CityLoginBannerProps = {
  cityName: string;
};

export function CityLoginBanner({ cityName }: CityLoginBannerProps) {
  const cityConfig = CITY_CONFIGS.find((c) => c.name === cityName);
  const slug = cityConfig?.slug ?? cityName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="city-login-banner">
      <div className="city-login-banner-inner">
        <div className="city-login-banner-left">
          <div className="city-login-banner-icon">
            <Mail size={28} strokeWidth={1.8} />
          </div>
          <div className="city-login-banner-text">
            <p className="city-login-banner-headline">
              Get {cityName} events in your inbox
            </p>
            <p className="city-login-banner-sub">
              Every Monday we send a curated list of the week's best networking and business events. Free, no spam.
            </p>
          </div>
        </div>
        <div className="city-login-banner-right">
          <div className="city-login-banner-perks">
            <span><CalendarDays size={13} /> Weekly Monday digest</span>
            <span><Mail size={13} /> Free to subscribe</span>
          </div>
          <Link
            to={`/${slug}/subscribe`}
            className="city-login-btn"
          >
            <Mail size={16} />
            Subscribe to the Weekly Email
          </Link>
        </div>
      </div>
    </div>
  );
}
