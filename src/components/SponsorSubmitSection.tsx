'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { SHOW_SPONSOR_SECTIONS } from '../lib/featureFlags';

interface Props {
  citySlug: string;
  categorySlug?: string;
  city: string;
  category?: string;
}

interface SponsorInfo {
  name: string;
  logo_url?: string | null;
  url?: string | null;
}

/**
 * SponsorSubmitSection
 *
 * A "Submit your event" CTA shown near the bottom of each city/sub-cal page.
 * The sponsor logo/messaging is gated by SHOW_SPONSOR_SECTIONS.
 * The Submit CTA is always visible.
 */
export function SponsorSubmitSection({ citySlug, categorySlug, city, category }: Props) {
  const [sponsor, setSponsor] = useState<SponsorInfo | null | undefined>(undefined);

  useEffect(() => {
    if (!SHOW_SPONSOR_SECTIONS) {
      setSponsor(null);
      return;
    }
    async function fetchSponsor() {
      const query = supabase
        .from('sponsors')
        .select('name, logo_url, url')
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

  // Still loading sponsors — render nothing to avoid layout shift
  if (SHOW_SPONSOR_SECTIONS && sponsor === undefined) return null;

  const calendarLabel = category ? `${city} ${category} Calendar` : `${city} Business Calendar`;

  // --- Sponsor parts (only when flag is on) ---
  const sponsorName = sponsor?.name ?? 'Event Networking Studio';
  const sponsorLogoUrl = sponsor?.logo_url ?? null;
  const sponsorUrl = sponsor?.url ?? null;

  const logoEl = sponsorLogoUrl ? (
    <Image
      src={sponsorLogoUrl}
      alt={`${sponsorName} logo`}
      width={72}
      height={36}
      style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
    />
  ) : (
    <span className="sss-initials">
      {sponsorName.split(' ').slice(0, 2).map(w => w[0]).join('')}
    </span>
  );

  return (
    <div className="sss-outer">
      <div className="sss-inner">
        {SHOW_SPONSOR_SECTIONS && (
          <div className="sss-logo-col">
            {sponsorUrl ? (
              <a href={sponsorUrl} target="_blank" rel="noopener noreferrer" className="sss-logo-link">
                {logoEl}
              </a>
            ) : (
              <div className="sss-logo-box">{logoEl}</div>
            )}
            <span className="sss-sponsor-label">
              Sponsor of the<br />{calendarLabel}
            </span>
          </div>
        )}
        <div className="sss-body">
          {SHOW_SPONSOR_SECTIONS && (
            <p className="sss-eyebrow">A message from {sponsorName}</p>
          )}
          <h3 className="sss-heading">Is your event on the calendar?</h3>
          <p className="sss-copy">
            The {calendarLabel} is only as good as the events in it.
            If you&apos;re hosting a {category ? category.toLowerCase() : 'business'} event in {city},
            submit it — it&apos;s free and reaches hundreds of local professionals every week.
          </p>
          <Link href="/submit" className="sss-btn">
            Submit Your Event →
          </Link>
        </div>
      </div>
    </div>
  );
}
