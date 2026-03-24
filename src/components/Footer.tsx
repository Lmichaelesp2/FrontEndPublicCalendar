import { Link } from 'react-router-dom';
import { Monitor, Home, Landmark, Briefcase, Users } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';

type FooterProps = {
  showIndustryCalendars?: boolean;
  variant?: 'default' | 'homepage';
  citySlug?: string;
  cityName?: string;
};

export function Footer({ showIndustryCalendars = false, variant = 'default', citySlug = 'san-antonio', cityName = 'San Antonio' }: FooterProps) {
  return (
    <footer className="footer">
      {variant === 'homepage' ? (
        <nav className="footer-cities" aria-label="City pages">
          <Link to="/texas">Texas</Link>
          {CITY_CONFIGS.map((c) => (
            <Link key={c.slug} to={`/texas/${c.slug}`}>{c.name}</Link>
          ))}
        </nav>
      ) : !showIndustryCalendars ? (
        <nav className="footer-cities" aria-label="City pages">
          {CITY_CONFIGS.map((c) => (
            <Link key={c.slug} to={`/texas/${c.slug}`}>{c.name}</Link>
          ))}
        </nav>
      ) : (
        <nav className="footer-cities footer-industry-calendars" aria-label="Industry calendars">
          <Link to={`/texas/${citySlug}/technology`} className="industry-calendar-button">
            <Monitor size={18} />
            {cityName} Technology Events
          </Link>
          <Link to={`/texas/${citySlug}/real-estate`} className="industry-calendar-button">
            <Home size={18} />
            {cityName} Real Estate Events
          </Link>
          <Link to={`/texas/${citySlug}/networking`} className="industry-calendar-button">
            <Users size={18} />
            {cityName} Networking Events
          </Link>
          <Link to={`/texas/${citySlug}/chamber`} className="industry-calendar-button">
            <Landmark size={18} />
            {cityName} Chamber Events
          </Link>
          <Link to={`/texas/${citySlug}/small-business`} className="industry-calendar-button">
            <Briefcase size={18} />
            {cityName} Small Business Events
          </Link>
        </nav>
      )}
      <p className="footer-ea">
        Coming Soon: Personal Event Assistant — AI-powered event recommendations tailored to you.{' '}
        <a href="#event-assistant">Join the Waitlist &rarr;</a>
      </p>
      <p>
        &copy; 2026 Local Business Calendars — San Antonio &middot; Austin &middot; Dallas &middot; Houston
      </p>
      <p style={{ marginTop: '0.4rem' }}>
        <a href="#privacy">Privacy Policy</a> &middot; <a href="#terms">Terms &amp; Conditions</a>
      </p>
      <div className="footer-disc">
        This website is not affiliated with meetup.com, eventbrite.com, facebook.com, LinkedIn.com,
        or any organizations whose events are listed. We are an independent platform providing event
        information. Verify event details directly with organizers.
      </div>
    </footer>
  );
}
