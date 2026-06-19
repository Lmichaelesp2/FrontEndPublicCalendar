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
const FOUNDING_SLOT_COUNT = 4;

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

  // A founding sponsor is one or more rows sharing the same name (one row per
  // city it appears in — city-wide slots only, category_slug is null).
  // Dedupe by name to get the unique list of founding sponsors, and track
  // which cities each one actually appears in (a single-city fallback
  // sponsor will only have one row/city instead of all four).
  const cityWideSponsors = sponsors.filter(s => s.active && s.name && !s.category_slug);
  const foundingSponsors: { sponsor: Sponsor; cities: string[] }[] = [];
  cityWideSponsors.forEach(s => {
    const existing = foundingSponsors.find(f => f.sponsor.name === s.name);
    if (existing) {
      existing.cities.push(s.city_slug);
    } else {
      foundingSponsors.push({ sponsor: s, cities: [s.city_slug] });
    }
  });

  const filledSlots = foundingSponsors.length;
  const openSlots = Math.max(0, FOUNDING_SLOT_COUNT - filledSlots);

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
            Local Business Calendars is free to the business community because local organizations choose to support it — like public radio, but for business events. There are only four founding sponsor spots on the entire network, and each one appears across all four Texas cities — San Antonio, Austin, Dallas, and Houston — in front of the professionals who rely on it every Monday morning.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: 'var(--color-dark-section)', padding: '0.65rem 2rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
            <strong style={{ color: '#fff' }}>{filledSlots}</strong> founding sponsor{filledSlots !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
            <strong style={{ color: '#fff' }}>4</strong> Texas cities, every spot
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
            <strong style={{ color: '#fff' }}>{openSlots}</strong> spot{openSlots !== 1 ? 's' : ''} open
          </span>
        </div>
      </section>

      <main style={{ background: 'var(--color-paper-2)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          {loading ? (
            <p style={{ color: 'var(--fg-3)', textAlign: 'center', padding: '3rem 0' }}>Loading sponsors…</p>
          ) : (
            <div style={{ marginBottom: '3.5rem' }}>

              {/* Section heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
                  Founding Sponsors — All Four Cities
                </h2>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-rule)' }} />
              </div>

              {/* Founding sponsor cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
                {foundingSponsors.map(({ sponsor, cities }, i) => (
                  <SponsorCard
                    key={sponsor.name}
                    sponsor={sponsor}
                    slotNumber={i + 1}
                    label={cities.length === CITIES.length ? 'All 4 Cities' : cities.map(c => CITY_NAMES[c]).join(', ')}
                  />
                ))}
                {Array.from({ length: openSlots }).map((_, i) => (
                  <SponsorCard key={`open-${i}`} sponsor={null} slotNumber={filledSlots + i + 1} label="All 4 Cities" />
                ))}
              </div>
            </div>
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
                Only four founding sponsor spots exist, and each one appears across all four Texas cities. Your brand in front of active local professionals every Monday, in every city.
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

function SponsorCard({ sponsor, label, slotNumber }: {
  sponsor: Sponsor | null;
  label: string;
  slotNumber: number;
}) {
  const isActive = sponsor?.active && sponsor?.name;

  if (isActive) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid var(--color-rule)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(10,22,40,.05)',
      }}>
        <div style={{
          height: '88px',
          background: 'var(--color-paper-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          borderBottom: '1px solid var(--color-rule)',
        }}>
          {sponsor?.logo_url ? (
            <img src={sponsor.logo_url} alt={sponsor.name ?? ''} style={{ maxHeight: '52px', maxWidth: '170px', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)' }}>{sponsor!.name}</span>
          )}
        </div>
        <div style={{ padding: '1.25rem 1.3rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 0.5rem' }}>
            Founding Sponsor · {label}
          </p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 0.35rem' }}>
            {sponsor!.name}
          </p>
          {sponsor!.tagline && (
            <p style={{ fontSize: '0.82rem', color: 'var(--fg-3)', margin: '0 0 0.85rem', lineHeight: 1.55 }}>
              {sponsor!.tagline}
            </p>
          )}
          {sponsor!.quote && (
            <blockquote style={{
              borderLeft: '2px solid var(--color-rule)',
              paddingLeft: '0.75rem',
              margin: '0 0 0.85rem',
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
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none',
            }}>
              {sponsor!.cta_label ?? 'Visit website →'}
            </a>
          )}
        </div>
      </div>
    );
  }

  // ── Open founding sponsor slot ──────────────────────────────────────────
  return (
    <Link href="/sponsor" style={{
      display: 'block',
      background: '#fff',
      border: '1.5px dashed #c7d2e8',
      borderRadius: '12px',
      overflow: 'hidden',
      textDecoration: 'none',
      transition: 'all .18s ease',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-primary)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#c7d2e8'; }}
    >
      {/* Logo placeholder zone — matches the filled-card header height */}
      <div style={{
        height: '88px',
        background: 'var(--color-paper-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1.5px dashed #c7d2e8',
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-4)', fontStyle: 'italic' }}>
          Your logo here
        </span>
      </div>

      {/* Body — number watermarked bottom-right, same recipe as .feature-step */}
      <div style={{ position: 'relative', padding: '1.25rem 1.3rem', overflow: 'hidden' }}>
        <span aria-hidden="true" style={{
          position: 'absolute', bottom: '-10px', right: '6px',
          fontSize: '4.5rem', fontWeight: 800, lineHeight: 1,
          color: 'var(--fg-1)', opacity: 0.06,
          fontFamily: 'var(--font-sans)', letterSpacing: '-0.04em',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {slotNumber}
        </span>
        <p style={{ position: 'relative', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-4)', margin: '0 0 0.5rem' }}>
          Founding Sponsor · {label}
        </p>
        <p style={{ position: 'relative', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 0.5rem' }}>
          This spot is open
        </p>
        <p style={{ position: 'relative', fontSize: '0.82rem', color: 'var(--fg-3)', margin: '0 0 1rem', lineHeight: 1.55 }}>
          Be one of only four founding sponsors, featured on every calendar and every weekly newsletter across all four Texas cities.
        </p>
        <span style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)',
        }}>
          Become a sponsor →
        </span>
      </div>
    </Link>
  );
}
