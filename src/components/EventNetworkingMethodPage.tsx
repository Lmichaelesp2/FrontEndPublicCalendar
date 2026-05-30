'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';

const CARDS = [
  {
    id: 'method',
    accent: '#c2410c',
    icon: 'EN',
    label: 'The Method',
    sub: 'What is the Event Networking Method?',
    subColor: 'var(--color-primary)',
    stmt: 'A system that turns the events you attend into content, connections, and lasting relationships.',
    body: 'Most professionals walk out of events and lose every contact they made. This method gives you four repeatable phases so every room you enter compounds into a network that keeps growing long after the event ends.',
    videoTitle: 'Overview: The Event Networking Method',
  },
  {
    id: 'traits',
    accent: '#7c3aed',
    icon: 'T',
    label: 'Traits',
    sub: 'Practice for great networking',
    subColor: '#7c3aed',
    stmt: 'Before the system, the mindset. Four traits that make every phase of this method work.',
    body: 'Empathy, Active Listening, Curiosity, and Inquiry are the foundation of every meaningful business relationship. Practice them in every conversation and the four phases that follow become dramatically more effective.',
    videoTitle: 'The Four Traits of Great Networking',
  },
  {
    id: 'people',
    accent: '#042C53',
    icon: '1',
    label: 'People',
    sub: 'Identify your target network',
    subColor: 'var(--color-primary)',
    stmt: 'Get clear on exactly who you want in your network — before you walk into any room.',
    body: 'Build a profile of your ideal connection — their role, the organizations they belong to, and the events they already attend. The more specific you are, the more intentional every move that follows will be.',
    videoTitle: 'How to Identify Your Ideal Network',
  },
  {
    id: 'content',
    accent: '#042C53',
    icon: '2',
    label: 'Content',
    sub: 'Produce it from events',
    subColor: 'var(--color-primary)',
    stmt: 'Turn every event you discover into content that keeps your name in front of the right people.',
    body: 'Each event becomes audio, video, text, or graphics you can share across your network. The content you produce from events is the fuel that powers everything that comes next.',
    videoTitle: 'How to Produce Content from Events',
  },
  {
    id: 'events',
    accent: '#042C53',
    icon: '3',
    label: 'Events',
    sub: 'Connect through them',
    subColor: 'var(--color-primary)',
    stmt: 'Show up in the right rooms — as an attendee, a speaker, a supporter, or a host.',
    body: 'Find the events your ideal connections already attend, then go beyond just showing up. Join their organizations, get on stage, and eventually host your own gatherings.',
    videoTitle: 'How to Connect Through Events',
  },
  {
    id: 'relationships',
    accent: '#042C53',
    icon: '4',
    label: 'Relationships',
    sub: 'Maintain across channels',
    subColor: 'var(--color-primary)',
    stmt: 'Use event content to stay in touch with everyone you meet — consistently, not occasionally.',
    body: 'Share what you produce across email, social media, your podcast, and your own events. Different people pay attention in different places, so the more channels you use, the warmer your network stays.',
    videoTitle: 'How to Maintain Relationships with Event Content',
  },
];

export function EventNetworkingMethodPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return;
    const { error: sbError } = await supabase
      .from('subscribers')
      .insert([{ email, source: 'enm-page' }]);
    if (sbError && sbError.code !== '23505') {
      setError('Something went wrong. Please try again.');
    } else {
      setSubmitted(true);
    }
  };

  return (
    <>
      <SEOHead
        title="The Event Networking Method | Local Business Calendars"
        description="A four-phase system that turns the events you attend into content, connections, and lasting relationships. People · Content · Events · Relationships."
      />
      <Navigation />

      <main className="enm-page">

        {/* Hero */}
        <section className="enm-hero">
          <div className="enm-hero-inner">
            <p className="enm-hero-overline">Free Resource</p>
            <h1 className="enm-hero-title">The Event Networking Method</h1>
            <p className="enm-hero-tagline">Relationships First | Technology Powered</p>
            <p className="enm-hero-sub">
              A repeatable system for turning the events you discover into content, connections,
              and relationships that compound over time.
            </p>
          </div>
        </section>

        {/* Six Cards */}
        <section className="enm-cards-section">
          <div className="enm-cards-inner">
            <div className="enm-cards-grid">
              {CARDS.map((card) => (
                <div
                  key={card.id}
                  className="enm-card"
                  style={{ borderTop: `3px solid ${card.accent}` }}
                >
                  <div className="enm-card-header">
                    <div
                      className="enm-card-icon"
                      style={{ background: card.accent }}
                    >
                      {card.icon}
                    </div>
                    <span className="enm-card-label">{card.label}</span>
                  </div>
                  <p className="enm-card-sub" style={{ color: card.subColor }}>
                    {card.sub}
                  </p>
                  <p className="enm-card-stmt">{card.stmt}</p>
                  <p className="enm-card-body">{card.body}</p>
                  <div className="enm-video-placeholder">
                    <div className="enm-play-btn">
                      <div className="enm-play-tri" />
                    </div>
                    <div className="enm-video-text">
                      <span className="enm-video-label">Video placeholder</span>
                      <span className="enm-video-title">{card.videoTitle}</span>
                      <span className="enm-video-dur">~90 sec</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency Bridge */}
        <section className="enm-agency-bridge">
          <div className="enm-agency-inner">
            <p className="enm-agency-overline">Done For You</p>
            <h2 className="enm-agency-title">Ready to put the method to work?</h2>
            <p className="enm-agency-body">
              You can run every phase of this method yourself — if you have the time, the
              infrastructure, and the tools to pull it off. Or we handle the events, the content,
              and the follow-up so you can focus on showing up.
            </p>
            <a href="mailto:themobilecoach@gmail.com" className="btn btn-terra">
              Talk to us about done-for-you →
            </a>
          </div>
        </section>

        {/* Subscribe */}
        <section className="enm-subscribe">
          <div className="enm-subscribe-inner">
            <h2 className="enm-subscribe-title">Get the free weekly event calendar</h2>
            <p className="enm-subscribe-body">
              Every week we curate the best business events in your city — networking, chamber,
              real estate, technology, and small business. Free, always.
            </p>
            {submitted ? (
              <p className="enm-subscribe-thanks">You are on the list. See you at the events.</p>
            ) : (
              <form className="enm-subscribe-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="enm-subscribe-input"
                />
                <button type="submit" className="btn btn-terra">
                  Subscribe free
                </button>
                {error && <p className="enm-subscribe-error">{error}</p>}
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
