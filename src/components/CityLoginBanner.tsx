'use client';

import Link from 'next/link';
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
      <div className="city-login-banner-inner-centered">
        <div className="city-login-banner-icon">
          <Mail size={28} strokeWidth={1.8} />
        </div>
        <div className="city-login-banner-text-centered">
          <p className="city-login-banner-headline">
            Stop hunting for events. Get them delivered <span className="monday-with-icon"><Mail size={18} />every Monday</span> - Free, No account needed
          </p>
        </div>
      </div>
    </div>
  );
}
