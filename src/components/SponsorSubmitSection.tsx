'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

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
 * A sponsor-voiced "Submit your event" reminder shown near the bottom of each
 * sub-calendar and city page. When a sponsor is active it uses their brand;
 * when vacant it defaults to a generic Event Networking Studio voice.
 */
export function SponsorSubmitSection({ citySlug, categorySlug, city, category }: Props) {
  const [sponsor, setSponsor] = useState<SponsorInfo | null | undefined>(undefined);

  useEffect(() => {
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

  // Still loading — render nothing to avoid layout shift
  if (sponsor === undefined) return null;

  const sponsorName = sponsor?.name ?? 'Event Networking Studio';
  const sponsorLogoUrl = sponsor?.logo_url ?? null;
  const sponsorUrl = sponsor?.url ?? null;
  const calendarLabel = category ? `${city} ${category} Calendar` : `${city} Business Calendar`;

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
        <div className="sss-body">
          <p className="sss-eyebrow">A message from {sponsorName}</p>
          <h3 className="sss-heading">Is your event on the calendar?</h3>
          <p className="sss-copy">
            The {calendarLabel} is only as good as the events in it.
            If you're hosting a {category ? category.toLowerCase() : 'business'} event in {city},
            submit it — it's free and reaches hundreds of local professionals every week.
          </p>
          <Link href="/submit" className="sss-btn">
            Submit Your Event →
          </Link>
        </div>
      </div>
    </div>
  );
}
