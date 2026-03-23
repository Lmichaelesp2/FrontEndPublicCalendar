import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { Footer } from './Footer';
import { HomepageCities } from './HomepageCities';
import { CityProvider } from '../contexts/CityContext';
import { SocialProof } from './SocialProof';
import { FAQ } from './FAQ';
import { Mail, CalendarDays, MapPin, Search } from 'lucide-react';

function TexasContent() {
  return (
    <div>
      <Navigation />
      <Hero />

      <section className="benefits-bar">
        <div className="benefits-bar-inner">
          <div className="benefit-item">
            <div className="benefit-icon">
              <CalendarDays size={20} strokeWidth={2} />
            </div>
            <span>Events aggregated every week</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <Mail size={20} strokeWidth={2} />
            </div>
            <span>Delivered every Monday morning</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <span>Access calendar anytime</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-inner">
          <h2>We Do the Searching So You Don't Have To</h2>
          <p className="features-subtitle">We aggregate sources across Texas so you don't have to — then deliver the best event opportunities straight to your newsletter every Monday.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>Subscribe to your city</h3>
              <p>Click your city above. Enter your email. That's it — no account, no credit card, no setup. Takes 10 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>Get your Monday newsletter</h3>
              <p>Every Monday morning you'll receive a curated digest of that week's networking events, meetups, and business gatherings in your city.</p>
            </div>

            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>Pick events & show up</h3>
              <p>Scan the list, click the events that fit your schedule, and walk in ready to meet the right people. We handle the research — you handle the relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <h2>Why Use Texas Business Calendars?</h2>
          <p className="why-subtitle">Most professionals miss events because they're scattered across multiple platforms and websites. We bring them together in one city-focused calendar — updated weekly.</p>
          <div className="why-grid">
            <div className="why-card">
              <h3>The problem</h3>
              <p>Events are spread across Eventbrite, Meetup, LinkedIn, Facebook, chambers, and associations. It takes time to find what's worth attending.</p>
            </div>
            <div className="why-card">
              <h3>What we do</h3>
              <p>We track business event hosts and organize their public events into one simple calendar per city.</p>
            </div>
            <div className="why-card">
              <h3>What you get</h3>
              <p>Faster discovery, fewer missed opportunities, and a weekly reminder that keeps you consistent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section" style={{ paddingTop: '2rem' }}>
        <div className="value-inner">
          <h2>Never Miss an Event That Matters</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><MapPin size={40} strokeWidth={2} /></div>
              <h3>Get the free weekly newsletter</h3>
              <p>Sign up for your city and get that week's business events in your inbox every Monday. Free.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Search size={40} strokeWidth={2} /></div>
              <h3>Check the calendar anytime</h3>
              <p>No signup needed. Browse your city's business events on the calendar whenever you want.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Mail size={40} strokeWidth={2} /></div>
              <h3>Never miss what matters</h3>
              <p>The email and the calendar work together so you always know what's coming up.</p>
            </div>
          </div>
        </div>
      </section>

      <HomepageCities />
      <SocialProof />
      <FAQ />
      <Footer />
    </div>
  );
}

export function TexasPage() {
  return (
    <CityProvider>
      <TexasContent />
    </CityProvider>
  );
}
