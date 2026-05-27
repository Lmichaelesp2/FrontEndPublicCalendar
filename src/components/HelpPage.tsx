'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

const SECTIONS = [
  {
    icon: '📅',
    title: 'What is Local Business Calendars?',
    body: `Local Business Calendars is a free weekly event calendar for Texas business professionals. We track networking mixers, chamber luncheons, technology meetups, real estate gatherings, small business workshops, and more — across San Antonio, Austin, Dallas, and Houston.

Instead of checking multiple websites, Facebook groups, and Eventbrite pages, everything is organized in one place and updated every week.`,
  },
  {
    icon: '🗺️',
    title: 'Browsing by City',
    body: `We cover four Texas cities — each with its own calendar:

• San Antonio — sanantonio.localbusinesscalendars.com
• Austin — austin.localbusinesscalendars.com
• Dallas — dallas.localbusinesscalendars.com
• Houston — houston.localbusinesscalendars.com

Click any city in the Cities menu at the top of the page to browse that city's events for the current week.`,
  },
  {
    icon: '🏷️',
    title: 'Browsing by Category',
    body: `Each city has sub-calendars organized by industry or event type:

• Chamber Events — chamber luncheons, ribbon cuttings, Business After Hours, and association events
• Technology Events — tech meetups, startup events, developer gatherings, and innovation talks
• Real Estate Events — realtor mixers, investor meetups, property management events, and industry conferences
• Small Business Events — entrepreneur workshops, SCORE sessions, small business networking, and vendor expos

Browse the city calendar to see all event types together, or go directly to a sub-calendar to focus on one category.`,
  },
  {
    icon: '📬',
    title: 'Getting the Free Weekly Email',
    body: `The easiest way to stay up to date is to subscribe to the free Monday morning email. Every Monday, we send a curated digest of that week's best events in your city — straight to your inbox.

It's completely free. No credit card. No spam. Just the week's events, organized and delivered.

To subscribe, click the "Sign Up — Free →" button in the top right corner, or visit any city page and click the newsletter signup button.`,
  },
  {
    icon: '📋',
    title: 'Reading an Event Listing',
    body: `Each event listing shows:

• Event name and organizing group
• Date and time
• Location or virtual link (when available)
• Whether it's free or paid
• A link to the event page for full details and registration

We always link directly to the original event page so you can register and get the most up-to-date information from the organizer.`,
  },
  {
    icon: '➕',
    title: 'Submitting an Event',
    body: `Have an event that should be on the calendar? Submit it for free.

We review all submissions and add qualifying business and professional events. Your event reaches thousands of Texas professionals who check the calendar each week.

Click "+ Submit an Event" in the footer, or visit the Submit page directly.`,
  },
  {
    icon: '⭐',
    title: 'Event Assistant (Premium)',
    body: `Want more than this week's events? Event Assistant is our premium upgrade at $14.99/month.

With Event Assistant you get:
• 30 days of upcoming events — plan a full month ahead
• Choose your city — San Antonio, Austin, Dallas, or Houston
• Personalized event recommendations based on your goals and industry
• Advanced filters — by city, cost, time of day, and category
• Personalized event recommendations based on your goals

Click "Sign Up — Free →" to create a free account, then upgrade to Event Assistant from your account page.`,
  },
  {
    icon: '❓',
    title: 'Still have questions?',
    body: `We're happy to help. Reach out anytime:

• Email: louis@localbusinesscalendars.com
• Use the Contact page to send us a message

We respond the same day.`,
  },
];

export function HelpPage() {
  return (
    <div className="help-page">
      <Navigation />

      <section className="help-hero">
        <div className="help-hero-inner">
          <p className="help-eyebrow">Help & Getting Started</p>
          <h1 className="help-h1">How Local Business Calendars Works</h1>
          <p className="help-sub">Everything you need to know to get the most out of the free Texas business event calendar.</p>
        </div>
      </section>

      <div className="help-body">
        <div className="help-inner">

          {/* Quick links */}
          <nav className="help-toc">
            {SECTIONS.map((s, i) => (
              <a key={i} href={`#section-${i}`} className="help-toc-item">
                <span className="help-toc-icon">{s.icon}</span>
                <span>{s.title}</span>
              </a>
            ))}
          </nav>

          {/* Sections */}
          <div className="help-sections">
            {SECTIONS.map((s, i) => (
              <div key={i} id={`section-${i}`} className="help-section">
                <div className="help-section-icon">{s.icon}</div>
                <h2 className="help-section-title">{s.title}</h2>
                <div className="help-section-body">
                  {s.body.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="help-cta-block">
            <h2>Ready to get started?</h2>
            <p>Browse this week's events in your city — free, no account needed.</p>
            <div className="help-cta-buttons">
              <Link href="/texas/san-antonio" className="help-cta-btn help-cta-btn--primary">San Antonio Events</Link>
              <Link href="/texas/austin" className="help-cta-btn help-cta-btn--primary">Austin Events</Link>
              <Link href="/texas/dallas" className="help-cta-btn help-cta-btn--primary">Dallas Events</Link>
              <Link href="/texas/houston" className="help-cta-btn help-cta-btn--primary">Houston Events</Link>
            </div>
            <Link href="/subscribe" className="help-cta-btn help-cta-btn--secondary">Get the Free Weekly Email →</Link>
          </div>

        </div>
      </div>

      <Footer variant="homepage" />
    </div>
  );
}
