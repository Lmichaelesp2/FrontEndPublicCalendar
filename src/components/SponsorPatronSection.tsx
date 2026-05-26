'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

interface Props {
  city: string;
  citySlug: string;
  category?: string;
  categorySlug?: string;
  variant?: 'default' | 'hero';
}

interface SponsorInfo {
  name: string;
  tagline: string;
  quote?: string | null;
  quote_by?: string | null;
  logo_url?: string | null;
  url?: string | null;
  cta_label?: string | null;
  category_slug?: string | null;
}

// ─── Sub-calendar: horizontal strip below hero ────────────────────────────────

function SponsorStrip({ sponsor }: { sponsor: SponsorInfo }) {
  const initials = sponsor.name.split(' ').slice(0, 2).map(w => w[0]).join('');
  const ctaLabel = sponsor.cta_label ?? 'Learn more →';

  return (
    <div className="sp-strip">
      <div className="sp-strip-bar">
        <div className="sp-strip-bar-line" />
        <span className="sp-strip-bar-text">This calendar is made possible by</span>
        <div className="sp-strip-bar-line" />
      </div>
      <div className="sp-strip-body">
        <div className="sp-strip-logo-panel">
          <div className="sp-strip-logo-box">
            {sponsor.logo_url ? (
              <Image src={sponsor.logo_url} alt={`${sponsor.name} logo`} width={84} height={60} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <span className="sp-strip-initials">{initials}</span>
            )}
          </div>
        </div>
        <div className="sp-strip-content">
          <div className="sp-strip-copy">
            <div className="sp-strip-name">
              {sponsor.url ? (
                <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="sp-strip-name-link">{sponsor.name}</a>
              ) : sponsor.name}
            </div>
            <p className="sp-strip-tagline">{sponsor.tagline}</p>
          </div>
          {sponsor.url && (
            <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="sp-strip-btn">{ctaLabel}</a>
          )}
        </div>
      </div>
      <div className="sp-strip-fine">
        <Link href="/sponsor">about our sponsorships</Link>
      </div>
    </div>
  );
}

function SponsorStripVacant({ city, category }: { city: string; category?: string }) {
  const calLabel = category ? `${city} ${category} Calendar` : `${city} Business Calendar`;
  return (
    <div className="sp-strip sp-strip--vacant">
      <div className="sp-strip-bar sp-strip-bar--vacant">
        <div className="sp-strip-bar-line" />
        <span className="sp-strip-bar-text">Sponsor this calendar</span>
        <div className="sp-strip-bar-line" />
      </div>
      <div className="sp-strip-body">
        <div className="sp-strip-logo-panel">
          <div className="sp-strip-logo-box sp-strip-logo-box--vacant">
            <span className="sp-strip-vacant-icon">🏢</span>
            <span className="sp-strip-vacant-text">Your Logo</span>
          </div>
        </div>
        <div className="sp-strip-content">
          <div className="sp-strip-copy">
            <div className="sp-strip-name sp-strip-name--vacant">Become the founding patron</div>
            <p className="sp-strip-tagline">Your brand reaches {city} business professionals every week — above every event listing and in the weekly newsletter.</p>
          </div>
          <Link href="/sponsor" className="sp-strip-btn sp-strip-btn--vacant">Learn about sponsorship →</Link>
        </div>
      </div>
      <div className="sp-strip-fine">
        <Link href="/sponsor">about our sponsorships</Link>
      </div>
    </div>
  );
}

// ─── City page: 4-card sponsor grid ──────────────────────────────────────────

const CATEGORY_SLUGS = ['networking', 'chamber', 'technology', 'real-estate', 'small-business'];
const CATEGORY_LABELS: Record<string, string> = {
  'networking': 'Networking',
  'chamber': 'Chamber',
  'technology': 'Technology',
  'real-estate': 'Real Estate',
  'small-business': 'Small Business',
};

function SponsorGrid({ city, citySlug, sponsors }: { city: string; citySlug: string; sponsors: (SponsorInfo | null)[] }) {
  const filled = sponsors.filter(Boolean);
  if (filled.length === 0) return <VacantSponsorSection city={city} />;

  return (
    <div className="sp-grid-wrap">
      <div className="sp-grid-bar">
        <div className="sp-grid-bar-line" />
        <span className="sp-grid-bar-text">This calendar is made possible by</span>
        <div className="sp-grid-bar-line" />
      </div>
      <div className="sp-grid-cards">
        {sponsors.map((sponsor, i) => {
          const slug = CATEGORY_SLUGS[i];
          const label = CATEGORY_LABELS[slug] ?? slug;
          if (!sponsor) {
            return (
              <Link key={slug} href="/sponsor" className="sp-grid-card sp-grid-card--vacant">
                <div className="sp-grid-card-top" />
                <div className="sp-grid-card-body">
                  <div className="sp-grid-logo sp-grid-logo--vacant">
                    <span className="sp-grid-vacant-text">Your logo here</span>
                  </div>
                  <span className="sp-grid-label">{label}</span>
                  <span className="sp-grid-name sp-grid-name--vacant">Open sponsorship</span>
                  <span className="sp-grid-tagline">Be the founding patron of the {city} {label} Calendar.</span>
                  <span className="sp-grid-cta">Become a sponsor →</span>
                </div>
              </Link>
            );
          }
          const initials = sponsor.name.split(' ').slice(0, 2).map(w => w[0]).join('');
          const ctaLabel = sponsor.cta_label ?? 'Learn more →';
          return (
            <div key={slug} className="sp-grid-card">
              <div className="sp-grid-card-top" />
              <div className="sp-grid-card-body">
                <div className="sp-grid-logo">
                  {sponsor.logo_url ? (
                    <Image src={sponsor.logo_url} alt={`${sponsor.name} logo`} width={120} height={48} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                    <span className="sp-grid-initials">{initials}</span>
                  )}
                </div>
                <span className="sp-grid-label">{label}</span>
                <span className="sp-grid-name">{sponsor.name}</span>
                <span className="sp-grid-tagline">{sponsor.tagline}</span>
                {sponsor.url && (
                  <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="sp-grid-cta">{ctaLabel}</a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="sp-grid-footer">
        <span className="sp-grid-footer-note">Each sponsor supports a specific calendar category</span>
        <Link href="/sponsor" className="sp-grid-footer-link">About our sponsorships →</Link>
      </div>
    </div>
  );
}

// ─── Full-width vacant (city page, no sponsors at all) ────────────────────────

function VacantSponsorSection({ city }: { city: string }) {
  return (
    <div className="sp-strip sp-strip--vacant">
      <div className="sp-strip-bar sp-strip-bar--vacant">
        <div className="sp-strip-bar-line" />
        <span className="sp-strip-bar-text">Sponsor this calendar</span>
        <div className="sp-strip-bar-line" />
      </div>
      <div className="sp-strip-body">
        <div className="sp-strip-logo-panel">
          <div className="sp-strip-logo-box sp-strip-logo-box--vacant">
            <span className="sp-strip-vacant-icon">🏢</span>
            <span className="sp-strip-vacant-text">Your Logo</span>
          </div>
        </div>
        <div className="sp-strip-content">
          <div className="sp-strip-copy">
            <div className="sp-strip-name sp-strip-name--vacant">Become the founding patron</div>
            <p className="sp-strip-tagline">Your brand reaches {city} business professionals every week — above every event listing and in the weekly newsletter.</p>
          </div>
          <Link href="/sponsor" className="sp-strip-btn sp-strip-btn--vacant">Learn about sponsorship →</Link>
        </div>
      </div>
      <div className="sp-strip-fine">
        <Link href="/sponsor">about our sponsorships</Link>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SponsorPatronSection({ city, citySlug, category, categorySlug, variant = 'default' }: Props) {
  const [sponsor, setSponsor] = useState<SponsorInfo | null | undefined>(undefined);
  const [citySponsors, setCitySponsors] = useState<(SponsorInfo | null)[] | undefined>(undefined);

  useEffect(() => {
    if (variant === 'hero') {
      // Sub-calendar: fetch single sponsor for this category
      async function fetchSingle() {
        const query = supabase
          .from('sponsors')
          .select('name, tagline, quote, quote_by, logo_url, url, cta_label, category_slug')
          .eq('city_slug', citySlug)
          .eq('active', true);
        const finalQuery = categorySlug
          ? query.eq('category_slug', categorySlug)
          : query.is('category_slug', null);
        const { data } = await finalQuery.maybeSingle();
        setSponsor(data ?? null);
      }
      fetchSingle();
    } else {
      // City page: fetch all category sponsors for this city
      async function fetchAll() {
        const { data } = await supabase
          .from('sponsors')
          .select('name, tagline, quote, quote_by, logo_url, url, cta_label, category_slug')
          .eq('city_slug', citySlug)
          .eq('active', true)
          .in('category_slug', CATEGORY_SLUGS);

        // Build ordered array matching CATEGORY_SLUGS order
        const map = Object.fromEntries((data ?? []).map(s => [s.category_slug, s]));
        setCitySponsors(CATEGORY_SLUGS.map(slug => map[slug] ?? null));
      }
      fetchAll();
    }
  }, [citySlug, categorySlug, variant]);

  // Sub-calendar strip (variant="hero")
  if (variant === 'hero') {
    if (sponsor === undefined) return null;
    if (sponsor) return <SponsorStrip sponsor={sponsor} />;
    return <SponsorStripVacant city={city} category={category} />;
  }

  // City page grid (variant="default")
  if (citySponsors === undefined) return null;
  return <SponsorGrid city={city} citySlug={citySlug} sponsors={citySponsors} />;
}
