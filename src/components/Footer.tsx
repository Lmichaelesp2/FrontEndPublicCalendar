'use client';

import Link from 'next/link';
import { Monitor, Home, Landmark, Briefcase, Users } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';

interface CategoryLink {
  label: string;
  href: string;
}

type FooterProps = {
  showIndustryCalendars?: boolean;
  variant?: 'default' | 'homepage';
  citySlug?: string;
  cityName?: string;
  isTexasPage?: boolean;
  categoryNav?: {
    cityLabel: string;
    links: CategoryLink[];
  };
};

export function Footer({ showIndustryCalendars = false, variant = 'default', citySlug, cityName, isTexasPage = false, categoryNav }: FooterProps) {
  const getCitySpecificText = () => {
    if (isTexasPage) {
      return 'Texas Business Calendars is part of the Local Business Calendars network.';
    }
    if (!citySlug) return null;

    const cityTexts: Record<string, string> = {
      'san-antonio': 'San Antonio Business Calendar is part of the Local Business Calendars network.',
      austin: 'Austin Business Calendar is part of the Local Business Calendars network.',
      dallas: 'Dallas Business Calendar is part of the Local Business Calendars network.',
      houston: 'Houston Business Calendar is part of the Local Business Calendars network.',
    };

    return cityTexts[citySlug] || null;
  };
  return (
    <footer className="footer">
      {categoryNav ? (
        <nav className="footer-category-nav" aria-label="Category pages">
          <span className="footer-category-label">{categoryNav.cityLabel}</span>
          <div className="footer-category-links">
            {categoryNav.links.map((link) => (
              <Link key={link.href} href={link.href} className="footer-category-link">{link.label}</Link>
            ))}
          </div>
        </nav>
      ) : variant === 'homepage' ? (
        <nav className="footer-cities" aria-label="State pages">
          <Link href="/texas">Texas Calendars</Link>
          <span className="footer-cities-coming">More Coming Soon</span>
        </nav>
      ) : !showIndustryCalendars ? (
        <nav className="footer-cities" aria-label="State pages">
          <Link href="/texas">Texas Calendars</Link>
          <span className="footer-cities-coming">More Coming Soon</span>
        </nav>
      ) : (
        <nav className="footer-cities footer-industry-calendars" aria-label="Industry calendars">
          <Link href={`/texas/${citySlug}/technology`} className="industry-calendar-button">
            <Monitor size={18} />
            {cityName} Technology Events
          </Link>
          <Link href={`/texas/${citySlug}/real-estate`} className="industry-calendar-button">
            <Home size={18} />
            {cityName} Real Estate Events
          </Link>
          <Link href={`/texas/${citySlug}/networking`} className="industry-calendar-button">
            <Users size={18} />
            {cityName} Networking Events
          </Link>
          <Link href={`/texas/${citySlug}/chamber`} className="industry-calendar-button">
            <Landmark size={18} />
            {cityName} Chamber Events
          </Link>
          <Link href={`/texas/${citySlug}/small-business`} className="industry-calendar-button">
            <Briefcase size={18} />
            {cityName} Small Business Events
          </Link>
        </nav>
      )}
      {variant !== 'homepage' && getCitySpecificText() && (
        <p style={{ marginBottom: '0.8rem', fontSize: '0.95rem', color: '#f0f0f0', fontWeight: '500' }}>
          {getCitySpecificText()}
        </p>
      )}
      <p>
        &copy; 2026 Local Business Calendars — <Link href="/texas/san-antonio">San Antonio</Link> &middot; <Link href="/texas/austin">Austin</Link> &middot; <Link href="/texas/dallas">Dallas</Link> &middot; <Link href="/texas/houston">Houston</Link>
      </p>
      <p style={{ marginTop: '0.4rem' }}>
        <Link href="/privacy">Privacy Policy</Link> &middot; <Link href="/terms">Terms &amp; Conditions</Link> &middot; <Link href="/sponsor">Sponsorship</Link>
      </p>
      <div className="footer-disc">
        This website is not affiliated with meetup.com, eventbrite.com, facebook.com, LinkedIn.com,
        or any organizations whose events are listed. We are an independent platform providing event
        information. Verify event details directly with organizers.
      </div>
    </footer>
  );
}
