'use client';

import Link from 'next/link';

interface Props {
  city?: string;       // e.g. "San Antonio" — omit for the Texas-wide page
  citySlug?: string;   // e.g. "san-antonio" — omit for the Texas-wide page
}

const LBO_BASE = 'https://www.localbusinessorganizations.com';

/**
 * LBOSection
 *
 * Highlights the Local Business Organizations directory on each calendar page.
 * Links to the city-specific LBO page (e.g. /dallas) or the Texas page (/texas)
 * depending on which props are passed.
 */
export function LBOSection({ city, citySlug }: Props) {
  const isTexas = !city || !citySlug;
  const lboUrl = isTexas ? `${LBO_BASE}/texas` : `${LBO_BASE}/${citySlug}`;
  const locationLabel = isTexas ? 'Texas' : city;
  const subLabel = isTexas
    ? 'Texas business organizations, associations, and networking groups'
    : `${city} business organizations, chambers, and networking groups`;

  return (
    <section className="lbo-section">
      <div className="lbo-section-inner">
        <div className="lbo-section-text">
          <p className="lbo-section-overline">LOCAL BUSINESS ORGANIZATIONS</p>
          <h2 className="lbo-section-heading">
            Discover the Organizations Behind These Events
          </h2>
          <p className="lbo-section-body">
            The events on this calendar come from {subLabel}. Browse the directory to find
            the chambers, associations, and networking groups active in {locationLabel} — and
            connect directly with the ones that matter to your business.
          </p>
          <Link
            href={lboUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lbo-section-btn"
          >
            Browse {locationLabel} Organizations →
          </Link>
        </div>
        <div className="lbo-section-graphic" aria-hidden="true">
          <div className="lbo-section-badge">
            <span className="lbo-section-badge-label">Local Business</span>
            <span className="lbo-section-badge-name">Organizations</span>
            <span className="lbo-section-badge-location">{locationLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
