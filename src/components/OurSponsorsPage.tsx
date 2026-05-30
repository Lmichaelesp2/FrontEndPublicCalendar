'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { supabase } from '../lib/supabase';

const CITIES = ['san-antonio', 'austin', 'dallas', 'houston'];
const CITY_NAMES: Record<string, string> = {
  'san-antonio': 'San Antonio',
  'austin': 'Austin',
  'dallas': 'Dallas',
  'houston': 'Houston',
};
const CATEGORIES = ['networking', 'technology', 'real-estate', 'chamber', 'small-business'];
const CATEGORY_NAMES: Record<string, string> = {
  'networking': 'Networking',
  'technology': 'Technology',
  'real-estate': 'Real Estate',
  'chamber': 'Chamber',
  'small-business': 'Small Business',
};

interface Sponsor {
  id: number;
  city_slug: string;
  category_slug: string | null;
  active: boolean;
  name: string | null;
  tagline: string | null;
  quote: string | null;
  quote_by: string | null;
  logo_url: string | null;
  url: string | null;
  cta_label: string | null;
}

export function OurSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('sponsors')
      .select('*')
      .order('city_slug')
      .then(({ data }) => {
        setSponsors((data as Sponsor[]) ?? []);
        setLoading(false);
      });
  }, []);

  // Build a map: city → category → sponsor|null
  const sponsorMap: Record<string, Record<string, Sponsor | null>> = {};
  CITIES.forEach(city => {
    sponsorMap[city] = {};
    // City-wide slot (no category)
    const cityWide = sponsors.find(s => s.city_slug === city && !s.category_slug);
    sponsorMap[city]['city'] = cityWide ?? null;
    CATEGORIES.forEach(cat => {
      sponsorMap[city][cat] = sponsors.find(s => s.city_slug === city && s.category_slug === cat) ?? null;
    });
  });

  const activeCount = sponsors.filter(s => s.active && s.name).length;

  return (
    <>
      <SEOHead
        title="Our Sponsors | Local Business Calendars"
        description="Meet the local businesses that make the free Local Business Calendars newsletter possible for Texas professionals."
      />
      <Navigation />

      {/* Hero */}
      <section style={{ background: 'var(--color-paper)', borderBottom: '1px solid var(--color-rule)', padding: '4rem 2rem 3.5rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
            Community Supported
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '1.25rem' }}>
            Our Sponsors
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--fg-3)', lineHeight: 1.75, maxWidth: '620px', marginBottom: '0' }}>
            Local Business Calendars is free to the business community because local organizations choose to support it — like public radio, but for business events. Each sponsor supports a specific city or category calendar, putting their name in front of the professionals who rely on it every Monday morning.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: 'var(--color-dark-section)', padding: '0.65rem 2rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
            <strong style={{ color: '#fff' }}>{activeCount}</strong> active sponsor{activeCount !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
            <strong style={{ color: '#fff' }}>4</strong> Texas cities
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
            <strong style={{ color: '#fff' }}>20</strong> available slots
          </span>
        </div>
      </section>

      <main style={{ background: 'var(--color-paper-2)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {loading ? (
            <p style={{ color: 'var(--fg-3)', textAlign: 'center', padding: '3rem 0' }}>Loading sponsors…</p>
          ) : (
            CITIES.map(city => (
              <div key={city} style={{ marginBottom: '3.5rem' }}>

                {/* City heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
                    {CITY_NAMES[city]}
                  </h2>
                  <div style={{ flex: 1, height: '1px', background: 'var(--color-rule)' }} />
                </div>

                {/* Sponsor cards grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {/* City-wide slot */}
                  <SponsorCard
                    sponsor={sponsorMap[city]['city']}
                    label={`${CITY_NAMES[city]} — All Events`}
                    city={city}
                    category={null}
                  />
                  {/* Sub-calendar slots */}
                  {CATEGORIES.map(cat => (
                    <SponsorCard
                      key={cat}
                      sponsor={sponsorMap[city][cat]}
                      label={`${CITY_NAMES[city]} ${CATEGORY_NAMES[cat]}`}
                      city={city}
                      category={cat}
                    />
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Bottom CTA */}
          <div style={{
            marginTop: '2rem',
            background: '#fff',
            border: '1px solid var(--color-rule)',
            borderLeft: '4px solid #042C53',
            borderRadius: '6px',
            padding: '1.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)', margin: '0 0 0.3rem' }}>
                Interested in sponsoring?
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--fg-3)', margin: 0, lineHeight: 1.6 }}>
                Each city and sub-calendar has one exclusive sponsor slot. Your brand in front of active local professionals every Monday.
              </p>
            </div>
            <Link href="/sponsor" style={{
              display: 'inline-block',
              background: 'var(--color-accent)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              Learn about sponsorship →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

// ── Sponsor card ──────────────────────────────────────────────────────────────

function SponsorCard({ sponsor, label, city, category }: {
  sponsor: Sponsor | null;
  label: string;
  city: string;
  category: string | null;
}) {
  const isActive = sponsor?.active && sponsor?.name;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--color-rule)',
      borderRadius: '8px',
      overflow: 'hidden',
      opacity: isActive ? 1 : 0.75,
    }}>
      {/* Card header — logo or placeholder */}
      <div style={{
        height: '80px',
        background: isActive ? 'var(--color-paper-2)' : '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        borderBottom: '1px solid var(--color-rule)',
      }}>
        {isActive && sponsor?.logo_url ? (
          <img src={sponsor.logo_url} alt={sponsor.name ?? ''} style={{ maxHeight: '48px', maxWidth: '160px', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#bbb', fontStyle: 'italic' }}>
            {isActive ? sponsor?.name : 'Open sponsorship'}
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1rem 1.1rem' }}>
        {/* Calendar label */}
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#042C53', margin: '0 0 0.4rem' }}>
          {label}
        </p>

        {isActive ? (
          <>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 0.35rem' }}>
              {sponsor!.name}
            </p>
            {sponsor!.tagline && (
              <p style={{ fontSize: '0.8rem', color: 'var(--fg-3)', margin: '0 0 0.75rem', lineHeight: 1.5 }}>
                {sponsor!.tagline}
              </p>
            )}
            {sponsor!.quote && (
              <blockquote style={{
                borderLeft: '2px solid var(--color-rule)',
                paddingLeft: '0.75rem',
                margin: '0 0 0.75rem',
                fontStyle: 'italic',
                fontSize: '0.78rem',
                color: 'var(--fg-3)',
                lineHeight: 1.6,
              }}>
                "{sponsor!.quote}"
                {sponsor!.quote_by && (
                  <cite style={{ display: 'block', fontStyle: 'normal', fontSize: '0.7rem', color: 'var(--fg-4)', marginTop: '0.3rem' }}>
                    — {sponsor!.quote_by}
                  </cite>
                )}
              </blockquote>
            )}
            {sponsor!.url && (
              <a href={sponsor!.url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none',
              }}>
                {sponsor!.cta_label ?? 'Learn more →'}
              </a>
            )}
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg-3)', margin: '0 0 0.35rem' }}>
              Available
            </p>
            <p style={{ fontSize: '0.78rem', color: '#bbb', margin: '0 0 0.75rem', lineHeight: 1.5 }}>
              Be the exclusive sponsor of the {label} newsletter.
            </p>
            <Link href="/sponsor" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none' }}>
              Become a sponsor →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
