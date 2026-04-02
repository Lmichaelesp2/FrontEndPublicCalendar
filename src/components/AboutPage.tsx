'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { ArrowRight, Clipboard, Lightbulb, Search, Users, Compass } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="about-page">
      <SEOHead
        title="About Local Business Calendars — How We Curate Business Events Across Texas"
        description="Learn how Local Business Calendars aggregates and delivers the best networking events, chamber meetings, and business opportunities across San Antonio, Austin, Dallas, and Houston."
      />
      <Navigation />

      <div className="about-hero">
        <div className="about-hero-inner">
          <h1>About Local Business Calendars</h1>
          <p>
            A network of free, city-specific business event calendars serving professionals across Texas.
          </p>
        </div>
      </div>

      <div className="about-body">
        <section className="about-section about-section-1">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Clipboard size={28} className="about-section-icon" />
              <h2>What Local Business Calendars Does</h2>
            </div>
            <p>
              Local Business Calendars is a network of free business event calendars organized by city. We research and aggregate networking events, chamber of commerce meetings, technology meetups, real estate gatherings, and small business events from multiple sources — including Meetup, Eventbrite, Facebook, LinkedIn, local organization websites, and chamber calendars — and deliver them in one organized, city-specific calendar. Currently serving San Antonio, Austin, Dallas, and Houston, Texas.
            </p>
          </div>
        </section>

        <section className="about-section about-section-2">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Lightbulb size={28} className="about-section-icon" />
              <h2>The Problem We Solve</h2>
            </div>
            <p>
              Business events in any given city are scattered across dozens of platforms and websites. A professional who wants to attend chamber meetings, tech meetups, and small business workshops might need to check five or six different places every week just to know what's happening. Most people don't have time for that research — so they miss events that could have changed their business. Local Business Calendars does that research for you and delivers it as a single, city-specific weekly newsletter every Monday morning.
            </p>
          </div>
        </section>

        <section className="about-section about-section-3">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Search size={28} className="about-section-icon" />
              <h2>How We Find and Vet Events</h2>
            </div>
            <p>
              Our team monitors business organizations, chambers of commerce, Meetup groups, Eventbrite, Facebook, LinkedIn, and individual organization websites across each city we serve. We review events for relevance, accuracy, and fit — focusing on business networking, professional development, and community-focused events. Events are updated weekly and sent to subscribers every Monday morning.
            </p>
          </div>
        </section>

        <section className="about-section about-section-4">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Users size={28} className="about-section-icon" />
              <h2>Who Uses Local Business Calendars</h2>
            </div>
            <p>
              Local Business Calendars serves business professionals, entrepreneurs, real estate agents, tech workers, chamber members, and small business owners who want to stay connected to their local business community without spending hours researching events every week.
            </p>
          </div>
        </section>

        <section className="about-section about-section-5">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Compass size={28} className="about-section-icon" />
              <h2>Where We're Headed</h2>
            </div>
            <p>
              We're currently serving four Texas cities and actively expanding to additional cities and states. If you'd like to see Local Business Calendars come to your city, let us know — we prioritize expansion based on community demand.
            </p>
          </div>
        </section>

        <section className="about-cta-section">
          <div className="about-cta-inner">
            <h2>Ready to Find Events in Your City?</h2>
            <div className="about-cta-buttons">
              <Link href="/texas" className="about-cta-btn about-cta-btn-primary">
                Browse Events by City
                <ArrowRight size={16} />
              </Link>
              <Link href="/texas" className="about-cta-btn about-cta-btn-secondary">
                Subscribe Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
