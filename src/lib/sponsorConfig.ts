// ─────────────────────────────────────────────────────────────────────────────
// sponsorConfig.ts
//
// HOW TO ACTIVATE A REAL SPONSOR
// ─────────────────────────────────────────────────────────────────────────────
// 1. Find the slot key below (e.g. 'san-antonio-networking')
// 2. Replace `null` with a SponsorInfo object
// 3. Push to production — the sponsor appears immediately on that page
//
// SLOT KEY FORMAT
//   City-wide:       'san-antonio', 'austin', 'dallas', 'houston'
//   Sub-calendar:    'san-antonio-networking', 'dallas-technology', etc.
//   Texas-wide:      'texas'
//
// AVAILABLE CATEGORY SLUGS: networking, technology, real-estate, chamber, small-business
// ─────────────────────────────────────────────────────────────────────────────

export interface SponsorInfo {
  /** Displayed company/brand name */
  name: string;
  /** One-liner shown under the name, e.g. "Commercial Real Estate in San Antonio" */
  tagline: string;
  /** Optional quote from the sponsor (shown in italic testimonial box) */
  quote?: string;
  /** Attribution for the quote, e.g. "Jane Doe, CEO · Acme Corp" */
  quoteBy?: string;
  /** Absolute URL or /path to logo image (shown in 72×72 box) */
  logoUrl?: string;
  /** Where clicking the sponsor name/logo links to */
  url?: string;
  /** Optional override for the CTA button text */
  ctaLabel?: string;
}

// ─── SPONSOR SLOTS ───────────────────────────────────────────────────────────
// Set a slot to null → shows "open founding sponsorship" pitch
// Set a slot to a SponsorInfo object → shows that sponsor's brand

const SPONSORS: Record<string, SponsorInfo | null> = {

  // ── Statewide ──────────────────────────────────────────────────────────────
  'texas': null,

  // ── San Antonio ────────────────────────────────────────────────────────────
  'san-antonio':                null,
  'san-antonio-networking':     null,
  'san-antonio-technology':     null,
  'san-antonio-real-estate':    null,
  'san-antonio-chamber':        null,
  'san-antonio-small-business': null,

  // ── Austin ─────────────────────────────────────────────────────────────────
  'austin':                null,
  'austin-networking':     null,
  'austin-technology':     null,
  'austin-real-estate':    null,
  'austin-chamber':        null,
  'austin-small-business': null,

  // ── Dallas ─────────────────────────────────────────────────────────────────
  'dallas':                null,
  'dallas-networking':     null,
  'dallas-technology':     null,
  'dallas-real-estate':    null,
  'dallas-chamber':        null,
  'dallas-small-business': null,

  // ── Houston ────────────────────────────────────────────────────────────────
  'houston':                null,
  'houston-networking':     null,
  'houston-technology':     null,
  'houston-real-estate':    null,
  'houston-chamber':        null,
  'houston-small-business': null,

};

// ─── HELPER ──────────────────────────────────────────────────────────────────

/**
 * Look up the sponsor for a given calendar slot.
 *
 * @param city      City slug: 'san-antonio', 'austin', 'dallas', 'houston', or 'texas'
 * @param category  Category slug: 'networking', 'technology', 'real-estate',
 *                  'chamber', 'small-business' — or undefined for the city-wide slot
 * @returns         SponsorInfo if a real sponsor is configured, otherwise null
 */
export function getSponsor(city: string, category?: string): SponsorInfo | null {
  const key = category ? `${city}-${category}` : city;
  return SPONSORS[key] ?? null;
}

/** True if ANY slot has an active sponsor (useful for admin tools) */
export function hasAnySponsor(): boolean {
  return Object.values(SPONSORS).some((s) => s !== null);
}

/** Returns all currently active sponsor slots (useful for dashboards/reporting) */
export function getActiveSlots(): Array<{ key: string; sponsor: SponsorInfo }> {
  return Object.entries(SPONSORS)
    .filter(([, s]) => s !== null)
    .map(([key, sponsor]) => ({ key, sponsor: sponsor! }));
}
