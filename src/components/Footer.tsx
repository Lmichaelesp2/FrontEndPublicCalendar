import { Link } from 'react-router-dom';
import { Monitor, Home, Landmark, Briefcase } from 'lucide-react';
import { CITY_CONFIGS } from '../lib/cities';

type FooterProps = {
  showIndustryCalendars?: boolean;
};

export function Footer({ showIndustryCalendars = false }: FooterProps) {
  return (
    <footer className="footer">
      {!showIndustryCalendars ? (
        <nav className="footer-cities" aria-label="City pages">
          {CITY_CONFIGS.map((c) => (
            <Link key={c.slug} to={`/${c.slug}`}>{c.name}</Link>
          ))}
        </nav>
      ) : (
        <nav className="footer-cities footer-industry-calendars" aria-label="Industry calendars">
          <Link to="/san-antonio/technology" className="industry-calendar-button">
            <Monitor size={18} />
            San Antonio Technology Events
          </Link>
          <Link to="/san-antonio/real-estate" className="industry-calendar-button">
            <Home size={18} />
            San Antonio Real Estate Events
          </Link>
          <Link to="/san-antonio/chamber" className="industry-calendar-button">
            <Landmark size={18} />
            San Antonio Chamber Events
          </Link>
          <Link to="/san-antonio/small-business" className="industry-calendar-button">
            <Briefcase size={18} />
            San Antonio Small Business Events
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
