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
}

// ─── Full-width active sponsor card ──────────────────────────────────────────

function ActiveSponsorSection({ city, category, sponsor }: { city: string; category?: string; sponsor: SponsorInfo }) {
  const initials = sponsor.name.split(' ').slice(0, 2).map(w => w[0]).join('');
  const ctaLabel = sponsor.cta_label ?? `Visit ${sponsor.name} →`;
  const calLabel = category ? `${city} ${category} Calendar` : `${city} Business Calendar`;

  return (
    <div className="sp-wrap">
      <div className="sp-card">
        <div className="sp-partner-label">Calendar Partner</div>
        <div className="sp-grid">
          <div className="sp-logo-box">
            {sponsor.logo_url ? (
              <Image src={sponsor.logo_url} alt={`${sponsor.name} logo`} width={120} height={80} style={{ objectFit: 'contain', maxWidth: '100%' }} />
            ) : (
              <span className="sp-logo-initials">{initials}</span>
            )}
          </div>
          <div className="sp-copy">
            <h2 className="sp-name">
              {sponsor.url ? (
                <a href={sponsor.url} target={sponsor.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="sp-name-link">
                  {sponsor.name}
                </a>
              ) : sponsor.name}
            </h2>
            <p className="sp-lead">
              {sponsor.tagline || `Supporting the free ${calLabel} for Texas professionals.`}
            </p>
            {sponsor.quote && (
              <p className="sp-quote">
                &ldquo;{sponsor.quote}&rdquo;
                {sponsor.quote_by && <span className="sp-quote-by"> — {sponsor.quote_by}</span>}
              </p>
            )}
            <div className="sp-actions">
              {sponsor.url && (
                <a href={sponsor.url} target={sponsor.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="sp-btn-primary">
                  {ctaLabel}
                </a>
              )}
              <Link href="/sponsor" className="sp-btn-secondary">Sponsor This Calendar</Link>
            </div>
          </div>
        </div>
        <p className="sp-fine">
          Sponsored content — <Link href="/sponsor" className="sp-fine-link">about our sponsorships</Link>
        </p>
      </div>
    </div>
  );
}

// ─── Full-width vacant card ───────────────────────────────────────────────────

function VacantSponsorSection({ city, category }: { city: string; category?: string }) {
  const calLabel = category ? `${city} ${category} Calendar` : `${city} Business Calendar`;

  return (
    <div className="sp-wrap">
      <div className="sp-card sp-card--vacant">
        <div className="sp-partner-label sp-partner-label--vacant">Open Sponsorship</div>
        <div className="sp-vacant-inner">
          <div className="sp-logo-box sp-logo-box--vacant">
            <span className="sp-vacant-icon">🏢</span>
            <span className="sp-vacant-text">Your Brand Here</span>
          </div>
          <div className="sp-copy">
            <h2 className="sp-name sp-name--vacant">Become the founding patron of the {calLabel}.</h2>
            <p className="sp-lead">
              This free resource reaches {city} business professionals every week. Sponsor this calendar and your brand appears above every event listing and in the weekly newsletter.
            </p>
            <div className="sp-actions">
              <Link href="/sponsor" className="sp-btn-primary">Become the Founding Patron →</Link>
              <Link href="/sponsor" className="sp-btn-secondary">Learn about sponsorship</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero variant — compact right-column card ─────────────────────────────────

function HeroSponsorCard({ city, category, sponsor }: { city: string; category?: string; sponsor: SponsorInfo }) {
  const initials = sponsor.name.split(' ').slice(0, 2).map(w => w[0]).join('');
  const ctaLabel = sponsor.cta_label ?? `Visit ${sponsor.name} →`;

  return (
    <div className="sp-hero-card">
      <div className="sp-hero-label">Presented by</div>
      <div className="sp-hero-logo-wrap">
        {sponsor.logo_url ? (
          <Image src={sponsor.logo_url} alt={`${sponsor.name} logo`} width={100} height={60} style={{ objectFit: 'contain', maxWidth: '100%' }} />
        ) : (
          <span className="sp-hero-initials">{initials}</span>
        )}
      </div>
      <div className="sp-hero-name">
        {sponsor.url ? (
          <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="sp-hero-name-link">{sponsor.name}</a>
        ) : sponsor.name}
      </div>
      {sponsor.tagline && <p className="sp-hero-tagline">{sponsor.tagline}</p>}
      {sponsor.url && (
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="sp-hero-cta">{ctaLabel}</a>
      )}
      <Link href="/sponsor" className="sp-hero-fine">about our sponsorships</Link>
    </div>
  );
}

function HeroVacantCard({ city, category }: { city: string; category?: string }) {
  return (
    <div className="sp-hero-card sp-hero-card--vacant">
      <div className="sp-hero-label sp-hero-label--vacant">Calendar Sponsor</div>
      <div className="sp-hero-logo-wrap sp-hero-logo-wrap--vacant">
        <span className="sp-hero-vacant-icon">🏢</span>
        <span className="sp-hero-vacant-text">Your Brand Here</span>
      </div>
      <p className="sp-hero-tagline">Be the founding patron of this calendar. Your brand reaches {city} professionals every week.</p>
      <Link href="/sponsor" className="sp-hero-cta sp-hero-cta--vacant">Become the Founding Patron →</Link>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SponsorPatronSection({ city, citySlug, category, categorySlug, variant = 'default' }: Props) {
  const [sponsor, setSponsor] = useState<SponsorInfo | null | undefined>(undefined);

  useEffect(() => {
    async function fetchSponsor() {
      const query = supabase
        .from('sponsors')
        .select('name, tagline, quote, quote_by, logo_url, url, cta_label')
        .eq('city_slug', citySlug)
        .eq('active', true);

      const finalQuery = categorySlug
        ? query.eq('category_slug', categorySlug)
        : query.is('category_slug', null);

      const { data } = await finalQuery.maybeSingle();
      setSponsor(data ?? null);
    }
    fetchSponsor();
  }, [citySlug, categorySlug]);

  if (sponsor === undefined) return null;

  if (variant === 'hero') {
    if (sponsor) return <HeroSponsorCard city={city} category={category} sponsor={sponsor} />;
    return <HeroVacantCard city={city} category={category} />;
  }

  if (sponsor) return <ActiveSponsorSection city={city} category={category} sponsor={sponsor} />;
  return <VacantSponsorSection city={city} category={category} />;
}
