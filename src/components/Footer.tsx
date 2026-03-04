import { Link } from 'react-router-dom';
import { CITY_CONFIGS } from '../lib/cities';

export function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-cities" aria-label="City pages">
        {CITY_CONFIGS.map((c) => (
          <Link key={c.slug} to={`/${c.slug}`}>{c.name}</Link>
        ))}
      </nav>
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
