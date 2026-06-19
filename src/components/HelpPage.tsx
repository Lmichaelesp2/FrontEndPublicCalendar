'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

const SECTIONS = [
  {
    icon: 'ti-calendar',
    title: 'What is Local Business Calendars?',
    body: `Local Business Calendars is a free weekly event calendar for Texas business professionals. We track networking mixers, chamber luncheons, technology meetups, real estate gatherings, small business workshops, and more — across San Antonio, Austin, Dallas, and Houston.

Instead of checking multiple websites, Facebook groups, and Eventbrite pages, everything is organized in one place and updated every week.`,
  },
  {
    icon: 'ti-map-pin',
    title: 'Browsing by City',
    body: `We cover four Texas cities — each with its own calendar:

• San Antonio — localbusinesscalendar.com/texas/san-antonio
• Austin — localbusinesscalendar.com/texas/austin
• Dallas — localbusinesscalendar.com/texas/dallas
• Houston — localbusinesscalendar.com/texas/houston

Click any city in the navigation menu at the top of the page to browse that city's events for the current week.`,
  },
  {
    icon: 'ti-mail',
    title: 'Getting the Free Weekly Email',
    body: `The easiest way to stay up to date is to subscribe to the free Monday morning email. Every Monday, we send a curated digest of that week's best events in your city — straight to your inbox.

It's completely free. No credit card. No spam. Just the week's events, organized and delivered.

To subscribe, click the "Sign Up — Free →" button in the top right corner, or visit any city page and click the newsletter signup button.`,
  },
  {
    icon: 'ti-list',
    title: 'Reading an Event Listing',
    body: `Each event card shows the event name, date and time, organizing group, location, whether it's free or paid, and a description.

• Event Page button — opens the original event page for full details and registration
• Organizing group link — if the hosting organization has a website, their name is clickable and takes you directly to it
• Add button — saves the event to your personal calendar (Google, Apple, Outlook)
• Share button — copies a link to the event so you can send it to a colleague

We always link to the organizer's original page so you get the most current information directly from the source.`,
  },
  {
    icon: 'ti-circle-plus',
    title: 'Submitting an Event',
    body: `Have an event that should be on the calendar? Submit it for free.

We review all submissions and add qualifying business and professional events. Your event reaches thousands of Texas professionals who check the calendar each week.

Click "Submit Your Event" in the footer, or visit the Submit page directly at localbusinesscalendar.com/submit.`,
  },
  {
    icon: 'ti-heart-handshake',
    title: 'Sponsors',
    body: `Local Business Calendars is free to use because local sponsors help cover the cost of running it. You may see sponsor names or logos in a few places around the site as a result.

Click "Sponsors" in the navigation menu to see who currently supports the calendar, or to learn about becoming a sponsor yourself.`,
  },
  {
    icon: 'ti-crown',
    title: 'Premium / Classic Calendar Login',
    body: `If you were a paid subscriber on our previous calendar, you still have an account — it just lives on a separate login from the free newsletter account described above.

Click "Login" in the navigation menu, then choose "Premium member?" to go to your city's Classic Calendar login. This is different from "Manage My Subscription," which only covers the free weekly newsletter.

New Event Assistant signups are paused right now, but existing premium accounts are unaffected and continue to work as before.`,
  },
  {
    icon: 'ti-building',
    title: 'Local Business Organizations Directory',
    body: `The events on this calendar come from chambers, associations, networking groups, and business alliances across Texas. If you want to learn more about a specific organization — who they are, what they do, and how to get involved — visit the Local Business Organizations directory.

The directory lists hundreds of Texas business organizations by city. You can browse by San Antonio, Austin, Dallas, or Houston, and see each organization's description, website, and event history.

Visit localbusinessorganizations.com to explore the directory. You'll also find a link to it in the "Discover the Organizations Behind These Events" section at the bottom of each calendar page.`,
  },
  {
    icon: 'ti-message-circle',
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
                <i className={`ti ${s.icon} help-toc-icon`} aria-hidden="true" />
                <span>{s.title}</span>
              </a>
            ))}
          </nav>

          {/* Sections */}
          <div className="help-sections">
            {SECTIONS.map((s, i) => (
              <div key={i} id={`section-${i}`} className="help-section">
                <i className={`ti ${s.icon}`} style={{ position: 'absolute', bottom: '-4px', right: '6px', fontSize: '2.25rem', color: 'var(--fg-1)', opacity: 0.07, pointerEvents: 'none' }} aria-hidden="true" />
                <h2 className="help-section-title" style={{ position: 'relative' }}>{s.title}</h2>
                <div className="help-section-body" style={{ position: 'relative' }}>
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
