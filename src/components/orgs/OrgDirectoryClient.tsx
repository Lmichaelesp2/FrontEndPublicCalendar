'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { Breadcrumb } from '../Breadcrumb';
import { AuthModal } from '../auth/AuthModal';
import { OrgCard } from './OrgCard';
import type { Organization } from '../../lib/supabase';

// ── Category config ───────────────────────────────────────────────────────────

const PUBLIC_CATEGORIES = [
  { label: 'Chambers',          icon: '🏛️' },
  { label: 'Networking',        icon: '🤝' },
  { label: 'Real Estate',       icon: '🏢' },
  { label: 'Technology',        icon: '💻' },
  { label: 'Community/Edu',     icon: '🎓' },
  { label: 'Const/Design/Mfg', icon: '🔧' },
  { label: 'Co-Working',        icon: '🏠' },
  { label: 'Other',             icon: '⚡' },
] as const;

// Maps backend category values → display labels
const CATEGORY_MAP: Record<string, string> = {
  'Community/Edu':      'Community/Edu',
  'Technology':         'Technology',
  'Real Estate':        'Real Estate',
  'Networking':         'Networking',
  'Chambers':           'Chambers',
  'Const/Design/Mfg':  'Const/Design/Mfg',
  'Co-Working':         'Co-Working',
  'Fed/State/Local':    'Other',
  'Healthcare':         'Other',
  'Professional Svcs':  'Other',
  'Financial':          'Other',
  'Financial Services': 'Other',
  'Career/HR':          'Other',
  'Hospitality':        'Other',
  'Other':              'Other',
};

// ── City content ──────────────────────────────────────────────────────────────

const CITY_CONTENT: Record<string, { heroText: string; seoDesc: string }> = {
  'San Antonio': {
    heroText: "San Antonio has a tightly connected business community built around chambers of commerce, veteran-owned networks, and strong professional associations across every major industry. This directory gives you a clear picture of who's active and where to plug in.",
    seoDesc: 'Browse 180+ business organizations in San Antonio, TX — chambers of commerce, professional associations, networking groups, real estate organizations, and more.',
  },
  'Austin': {
    heroText: "Austin has become one of the top business destinations in the country, with thriving technology groups, startup networks, chambers, and professional associations. Find your place in Austin's business community.",
    seoDesc: 'Browse 90+ business organizations in Austin, TX — technology groups, startup networks, chambers of commerce, professional associations, and more.',
  },
  'Dallas': {
    heroText: "Dallas-Fort Worth is one of the fastest-growing business markets in the country, with a deep infrastructure of chambers, finance associations, real estate groups, and technology networks spanning the entire metro.",
    seoDesc: 'Browse 90+ business organizations in Dallas, TX — chambers of commerce, finance associations, real estate groups, technology networks, and more.',
  },
  'Houston': {
    heroText: "Houston's professional organizations span energy, healthcare, real estate, technology, and beyond — making it one of the most complete business organization landscapes in the country.",
    seoDesc: 'Browse 200+ business organizations in Houston, TX — energy associations, chambers of commerce, healthcare groups, professional networks, and more.',
  },
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  city: string;
  citySlug: string;
}

// ── Main component ────────────────────────────────────────────────────────────

export function OrgDirectoryClient({ city, citySlug }: Props) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);

  const content = CITY_CONTENT[city];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/organizations?city=${encodeURIComponent(city)}`)
      .then(r => r.json())
      .then((data: Organization[]) => {
        setOrgs(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  // Category counts
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    orgs.forEach(o => {
      const label = o.category ? (CATEGORY_MAP[o.category] ?? 'Other') : null;
      if (label) c[label] = (c[label] || 0) + 1;
    });
    return c;
  }, [orgs]);

  // Filtered list
  const filtered = useMemo(() => {
    return orgs.filter(o => {
      const displayCat = o.category ? (CATEGORY_MAP[o.category] ?? 'Other') : null;
      const matchCat = !selectedCategory || displayCat === selectedCategory;
      const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [orgs, selectedCategory, search]);

  return (
    <div>
      <Navigation />
      <Breadcrumb items={[
        { label: 'Local Business Calendars', href: '/' },
        { label: 'Texas', href: '/texas' },
        { label: city, href: `/texas/${citySlug}` },
        { label: 'Organizations' },
      ]} />

      {/* ── Hero ── */}
      <section style={{ background: '#fff', padding: '4rem 2rem 0', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 300px',
          gap: '3rem', alignItems: 'start', paddingBottom: '3.5rem',
        }} className="org-dir-hero-grid">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#1652f0', marginBottom: '1.25rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1652f0', display: 'inline-block' }} />
              {city} Business Directory · Texas
            </div>
            <h1 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: 'clamp(2rem,4.5vw,2.75rem)', fontWeight: 600, color: '#0a1628', lineHeight: 1.15, letterSpacing: '-.025em', marginBottom: '1.25rem' }}>
              The business organizations that matter{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#1652f0' }}>in {city}.</em>
            </h1>
            {content && (
              <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.7, maxWidth: 700, marginBottom: '2rem' }}>
                {content.heroText}
              </p>
            )}
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#organizations" className="btn btn-primary">Browse {city} →</a>
              <Link href={`/texas/${citySlug}`} className="btn btn-ghost">See {city} Events ↗</Link>
            </div>
          </div>

          {/* Stats panel */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(10,22,40,.07)' }}>
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.10em', textTransform: 'uppercase', color: '#374151', padding: '.75rem 1.25rem', borderBottom: '1px solid #e8e8e4', background: '#f7f7f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{city} Directory</span>
              <span style={{ color: '#1652f0', fontWeight: 700 }}>{loading ? '—' : orgs.length} orgs</span>
            </div>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {[
                { label: 'Categories', value: '8' },
                { label: 'Verified profiles', value: loading ? '—' : String(orgs.filter(o => o.verified).length) },
                { label: 'Free to browse', value: 'Yes' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.83rem' }}>
                  <span style={{ color: '#374151' }}>{stat.label}</span>
                  <span style={{ fontWeight: 700, color: '#0a1628' }}>{stat.value}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid #e8e8e4', paddingTop: '.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder={`Search ${city}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 6, padding: '8px 10px 8px 28px', fontSize: 12, width: '100%', color: '#0a1628', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ background: '#042C53', padding: '.6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '.7rem', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
          <span><strong>{loading ? '—' : orgs.length}</strong> organizations</span>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>|</span>
          <span><strong>8</strong> categories</span>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>|</span>
          <span><strong>Free</strong> to browse</span>
        </div>
      </div>

      {/* ── Directory ── */}
      <div id="organizations" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', boxSizing: 'border-box', background: '#f7f7f5' }}>

        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#1652f0', marginBottom: '.5rem' }}>
            Browse the directory
          </div>
          <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '1.6rem', fontWeight: 600, color: '#0a1628', marginBottom: '.5rem' }}>
            {loading ? 'Organizations' : orgs.length} Organizations in {city}, by Category
          </h2>
          <p style={{ fontSize: '.9rem', color: '#374151', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: 640 }}>
            Every chamber, association, and networking group we've tracked in {city} — sorted into 8 categories.
          </p>

          {/* Main search bar */}
          <div style={{ position: 'relative', maxWidth: 420, marginBottom: '1.5rem' }}>
            <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder={`Search ${city} organizations by name...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 8, padding: '.7rem 1rem .7rem 2.4rem', fontSize: '.875rem', width: '100%', color: '#0a1628', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(10,22,40,.05)' }}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }} className="org-dir-cat-grid">
            {PUBLIC_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.label;
              return (
                <button key={cat.label}
                  onClick={() => setSelectedCategory(isActive ? null : cat.label)}
                  style={{
                    background: isActive ? '#eef3fe' : '#fff',
                    border: isActive ? '1.5px solid #1652f0' : '1px solid #e8e8e4',
                    borderRadius: 10, padding: '.875rem 1rem', cursor: 'pointer',
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: 'inherit', transition: 'border-color 0.15s, background 0.15s',
                  }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{cat.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.8rem', fontWeight: 600, color: isActive ? '#1652f0' : '#0a1628', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.label}</div>
                    <div style={{ fontSize: '.7rem', color: isActive ? '#1652f0' : '#94a3b8', marginTop: 2 }}>{loading ? '—' : (counts[cat.label] || 0)} orgs</div>
                  </div>
                  {isActive && (
                    <span style={{ background: '#1652f0', color: '#fff', fontSize: '.65rem', fontWeight: 700, borderRadius: 100, padding: '1px 7px', lineHeight: 1.6, flexShrink: 0 }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedCategory && (
            <button onClick={() => setSelectedCategory(null)}
              style={{ marginTop: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '.75rem', padding: 0, fontFamily: 'inherit', fontWeight: 600 }}>
              ← Clear filter
            </button>
          )}
        </div>

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '.75rem', borderBottom: '1px solid #e8e8e4' }}>
          <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '1.2rem', fontWeight: 600, color: '#0a1628' }}>
            {selectedCategory ? `${selectedCategory} — ${city}` : `All Organizations in ${city}`}
          </h2>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{filtered.length} organizations</span>
        </div>

        {/* Org grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading organizations...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No organizations found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, minWidth: 0 }} className="org-dir-grid">
            {filtered.map(org => (
              <OrgCard key={org.id} org={org} onAuthOpen={() => setAuthOpen(true)} />
            ))}
          </div>
        )}

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', marginTop: '1.75rem' }}>
          <h3 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '1.25rem', fontWeight: 600, color: '#0a1628', marginBottom: '1.5rem' }}>
            About This Directory
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              {
                q: 'What is this directory?',
                a: `This is a comprehensive listing of business organizations active in ${city} — chambers of commerce, professional associations, networking groups, real estate organizations, co-working spaces, tech groups, and more. Every organization here has been researched and verified before being added.`,
              },
              {
                q: 'Why do I have to click each organization to see its details?',
                a: `The directory shows all organizations by name and category so you can browse freely. Full details — contact info, membership info, website, social links — are shown when you click into an individual profile. This keeps the directory useful for people who want to explore, while preventing automated tools from bulk-collecting contact data.`,
              },
              {
                q: 'How do the category filters work?',
                a: `Use the category buttons (Chambers, Networking, Real Estate, Technology, etc.) to narrow the list to a specific type of organization. Click a category to filter, click it again — or use "Clear filter" — to go back to the full list. You can also search by name at any time.`,
              },
              {
                q: 'How often is this directory updated?',
                a: `We continuously research and verify organizations through public records, event platforms, and direct outreach. New organizations are reviewed before being added, and inactive ones are removed on an ongoing basis.`,
              },
              {
                q: 'How do I get my organization listed?',
                a: 'Submit your organization at localbusinessorganizations.com/submit — it\'s free and reviewed within 1–2 business days.',
              },
            ].map((item, i) => (
              <details key={i} style={{ borderTop: '1px solid #e8e8e4', padding: '1.1rem 0' }}>
                <summary style={{ fontSize: '.9rem', fontWeight: 600, color: '#0a1628', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <span>{item.q}</span>
                  <span style={{ fontSize: '1.1rem', color: '#94a3b8', flexShrink: 0, userSelect: 'none' }}>+</span>
                </summary>
                <p style={{ fontSize: '.875rem', color: '#374151', lineHeight: 1.7, marginTop: '.75rem', paddingRight: '1.5rem' }}>
                  {item.a}
                </p>
              </details>
            ))}
            <div style={{ borderTop: '1px solid #e8e8e4' }} />
          </div>
        </div>
      </div>

      <Footer showIndustryCalendars={true} citySlug={citySlug} cityName={city} />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} cityName={city} />

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .org-dir-hero-grid { grid-template-columns: 1fr !important; }
          .org-dir-cat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .org-dir-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          .org-dir-grid { grid-template-columns: 1fr !important; }
          .org-dir-cat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
