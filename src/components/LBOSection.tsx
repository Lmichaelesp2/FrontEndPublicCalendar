'use client';

import Link from 'next/link';
import { Building2, Users, Handshake } from 'lucide-react';

interface Props {
  city?: string;
  citySlug?: string;
}

const LBO_BASE = 'https://www.localbusinessorganizations.com';

const ORG_TYPES = [
  { icon: Building2, label: 'Chambers &\nAssociations' },
  { icon: Users,     label: 'Networking\nGroups' },
  { icon: Handshake, label: 'Business\nAlliances' },
];

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
          {ORG_TYPES.map(({ icon: Icon, label }) => (
            <div className="lbo-org-card" key={label}>
              <div className="lbo-org-card-icon">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span className="lbo-org-card-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
