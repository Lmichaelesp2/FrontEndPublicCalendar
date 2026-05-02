import { Star } from 'lucide-react';

const STATS = [
  { number: '500+', label: 'Events added monthly' },
  { number: '5,000+', label: 'Professionals subscribe' },
  { number: '800+', label: 'Business organizations tracked' },
];

const TESTIMONIALS = [
  {
    quote:
      'Finally, all the networking events in one place. No more missing out because I didn\'t know something was happening.',
    name: 'Sarah M.',
    location: 'San Antonio, TX',
  },
  {
    quote:
      'This calendar has become essential for growing my professional network. The weekly email alone saves me hours.',
    name: 'Marcus T.',
    location: 'Houston, TX',
  },
  {
    quote:
      'I used to check Meetup, Eventbrite, and Facebook separately. Now I just check one site.',
    name: 'Jennifer L.',
    location: 'Austin, TX',
  },
];

export function SocialProof() {
  return (
    <section className="sp-section">
      <div className="sp-inner">
        <p className="sp-overline">BY THE NUMBERS &middot; TEXAS, 2026</p>
        <h2>
          Local Business Calendars is read by professionals across{' '}
          <em>every major Texas metro</em> — and we&rsquo;re just getting started.
        </h2>

        <div className="sp-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="sp-stat">
              <span className="sp-stat-number">{stat.number}</span>
              <span className="sp-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="sp-testimonials">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="sp-card">
              <div className="sp-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="sp-quote">&ldquo;{t.quote}&rdquo;</blockquote>
              <div className="sp-author">
                <span className="sp-name">&mdash; {t.name}</span>
                <span className="sp-location">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
