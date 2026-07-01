'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Landmark, Users, Home, Monitor, Briefcase,
  Building2, Handshake, Star, Filter, FileText, CalendarDays,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { Breadcrumb } from '../Breadcrumb';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import { OrgCard } from './OrgCard';
import type { Organization } from '../../lib/supabase';

// ── Category config ───────────────────────────────────────────────────────────

const PUBLIC_CATEGORIES: { label: string; Icon: LucideIcon; color: string }[] = [
  { label: 'Chambers',          Icon: Landmark,  color: '#1652f0' }, // blue
  { label: 'Networking',        Icon: Users,     color: '#c2410c' }, // rust
  { label: 'Real Estate',       Icon: Home,      color: '#1652f0' }, // blue
  { label: 'Technology',        Icon: Monitor,   color: '#c2410c' }, // rust
  { label: 'Community/Edu',     Icon: Briefcase, color: '#1652f0' }, // blue
  { label: 'Const/Design/Mfg', Icon: Building2, color: '#374151' }, // dark gray
  { label: 'Co-Working',        Icon: Handshake, color: '#c2410c' }, // rust
  { label: 'Other',             Icon: Star,      color: '#374151' }, // dark gray
];

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
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);

  const content = CITY_CONTENT[city];

  // Auth guard — redirect to city page if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/texas/${citySlug}`);
    }
  }, [authLoading, user, citySlug, router]);

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

  // Don't render anything until we know auth state
  if (authLoading || !user) return null;

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
            <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.10em', textTransform: 'uppercase', color: '#374151', padding: '.75rem 1.25rem', borderBottom: '1px solid #e8e8e4', background: '#f7f7f5' }}>
              {city} Directory
            </div>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {[
                { label: 'Organizations', value: loading ? '—' : String(orgs.length) },
                { label: 'Categories', value: '8' },
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

      {/* ── How it works ── */}
      <section style={{ background: '#fff', padding: '2.5rem 2rem', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#1652f0', marginBottom: '1.25rem' }}>How to use this directory</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="org-dir-steps-grid">
            {[
              { Icon: Search,      head: 'Browse or search',        body: `All active business organizations in ${city} are listed here. Search by name or use the category filters to zero in on what you're looking for.` },
              { Icon: Filter,      head: 'Filter by category',      body: 'Use the category buttons — Chambers, Networking, Real Estate, Technology, and more — to view only the type of organization that fits your goals.' },
              { Icon: FileText,    head: 'Click to see full details', body: 'Select any organization card to open its full profile: description, membership details, website, social links, and more.' },
            ].map(({ Icon, head, body }) => (
              <div key={head} style={{ background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 12, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: -6, right: 6, pointerEvents: 'none', lineHeight: 0 }}>
                  <Icon size={52} strokeWidth={1.1} style={{ stroke: '#1652f0', fill: 'none', opacity: .15 }} />
                </div>
                <h3 style={{ fontSize: '.9rem', fontWeight: 700, color: '#0a1628', marginBottom: '.4rem' }}>{head}</h3>
                <p style={{ fontSize: '.825rem', color: '#374151', lineHeight: 1.6, paddingRight: 36 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Directory ── */}
      <div id="organizations" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', boxSizing: 'border-box', background: '#f7f7f5' }}>

        {/* Section heading */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#1652f0', marginBottom: '.5rem' }}>
            Browse the directory
          </div>
          <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '1.6rem', fontWeight: 600, color: '#0a1628', marginBottom: '.4rem' }}>
            {loading ? 'Organizations' : orgs.length} Organizations in {city}, by Category
          </h2>
          <p style={{ fontSize: '.875rem', color: '#374151', lineHeight: 1.6, maxWidth: 640 }}>
            Every chamber, association, and networking group we've tracked in {city} — sorted into 8 categories.
          </p>
        </div>

        {/* ── Filter panel — distinct white card so it reads as a control, not content ── */}
        <div style={{ background: '#fff', border: '1.5px solid #dce6f5', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(10,22,40,.07)' }}>

          {/* Panel header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#042C53' }}>
              Filter by Category
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#c2410c', color: '#fff', border: 'none', borderRadius: 100, padding: '5px 14px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>
                {selectedCategory} <span style={{ fontSize: '1rem', lineHeight: 1 }}>×</span>
              </button>
            )}
          </div>

          {/* Search bar — full width inside panel */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder={`Search ${city} organizations by name...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 8, padding: '.75rem 1rem .75rem 2.5rem', fontSize: '.9rem', width: '100%', color: '#0a1628', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Category buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }} className="org-dir-cat-grid">
            {PUBLIC_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.label;
              const { Icon, color } = cat;
              return (
                <button key={cat.label}
                  onClick={() => setSelectedCategory(isActive ? null : cat.label)}
                  style={{
                    background: isActive ? `${color}14` : '#f4f6fb',
                    border: isActive ? `2px solid ${color}` : '1.5px solid #dce6f5',
                    borderRadius: 10,
                    padding: '1rem 1rem',
                    minHeight: 56,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isActive ? `0 0 0 3px ${color}22` : 'none',
                  }}>
                  <div style={{ position: 'absolute', bottom: -4, right: 4, pointerEvents: 'none', lineHeight: 0 }}>
                    <Icon size={40} strokeWidth={1.2} style={{ stroke: color, fill: 'none', opacity: isActive ? .35 : .22 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.85rem', fontWeight: 700, color: isActive ? color : '#0a1628', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.label}</div>
                    <div style={{ fontSize: '.75rem', color: isActive ? color : '#6b7280', marginTop: 3, fontWeight: 500 }}>{loading ? '—' : (counts[cat.label] || 0)} orgs</div>
                  </div>
                  {isActive && (
                    <span style={{ background: color, color: '#fff', fontSize: '.65rem', fontWeight: 800, borderRadius: 100, padding: '2px 8px', lineHeight: 1.6, flexShrink: 0, zIndex: 1 }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
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
            {(() => {
              const total = filtered.length;
              // Insert a full-width partner card after every ~25% of orgs (4 slots total)
              const insertAt = total > 0
                ? [1, 2, 3, 4].map(n => Math.floor(n * total / 5))
                : [];
              const partnerSlots = [
                { headline: 'Your brand alongside SA\'s business community.', sub: 'Be seen by the professionals who check this directory every week. Community partners get equal billing across all city pages.' },
                { headline: 'Be part of what keeps SA connected.',            sub: 'Community partners make this free directory — and the weekly newsletter — possible for local professionals.' },
                { headline: 'Reach SA\'s decision makers.',                   sub: 'Business owners and professionals browse this directory to find the organizations that matter. Put your brand here.' },
                { headline: 'Support SA\'s business community.',              sub: 'Help keep this directory free and accessible. Community partners are recognized across every city calendar.' },
              ];
              const items: React.ReactNode[] = [];
              filtered.forEach((org, i) => {
                items.push(<OrgCard key={org.id} org={org} onAuthOpen={() => setAuthOpen(true)} />);
                const slotIndex = insertAt.indexOf(i + 1);
                if (slotIndex !== -1) {
                  const s = partnerSlots[slotIndex % partnerSlots.length];
                  items.push(
                    <div key={`partner-${slotIndex}`} style={{
                      gridColumn: '1 / -1',
                      background: '#eef3fe', border: '1px solid #c7d9fb', borderRadius: 10,
                      padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
                      gap: '1.5rem', margin: '4px 0',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1652f0', display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: '#1652f0' }}>Community Partner</span>
                        </div>
                        <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#0a1628', margin: 0, lineHeight: 1.3 }}>{s.headline}</p>
                        <p style={{ fontSize: '.78rem', color: '#374151', margin: 0, lineHeight: 1.5 }}>{s.sub}</p>
                      </div>
                      <a href="/sponsor" style={{ flexShrink: 0, fontSize: '.75rem', fontWeight: 700, color: '#1652f0', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        Become a Partner →
                      </a>
                    </div>
                  );
                }
              });
              return items;
            })()}
          </div>
        )}

        {/* Submit + Claim — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: '1.75rem' }} className="org-dir-cta-grid">
          <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 12, padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -8, right: 8, pointerEvents: 'none', lineHeight: 0 }}>
              <Building2 size={60} strokeWidth={1.1} style={{ stroke: '#1652f0', fill: 'none', opacity: .13 }} />
            </div>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: '#0a1628', marginBottom: '.4rem' }}>Is your organization missing?</h3>
            <p style={{ fontSize: '.825rem', color: '#374151', lineHeight: 1.6, marginBottom: '1rem', paddingRight: 40 }}>
              Submit your {city} organization to get it added to the directory. Free, reviewed within 1–2 business days.
            </p>
            <a href="https://localbusinessorganizations.com/submit" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#0a1628', color: '#fff', padding: '.6rem 1.1rem', borderRadius: 7, fontSize: '.8rem', fontWeight: 700, textDecoration: 'none' }}>
              Submit an organization →
            </a>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 12, padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -8, right: 8, pointerEvents: 'none', lineHeight: 0 }}>
              <Building2 size={60} strokeWidth={1.1} style={{ stroke: '#c2410c', fill: 'none', opacity: .13 }} />
            </div>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: '#0a1628', marginBottom: '.4rem' }}>Is this your organization?</h3>
            <p style={{ fontSize: '.825rem', color: '#374151', lineHeight: 1.6, marginBottom: '1rem', paddingRight: 40 }}>
              If your {city} organization is already listed, claim it to manage your profile and keep details up to date.
            </p>
            <a href="https://www.localbusinessorganizations.com/claim" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#c2410c', color: '#fff', padding: '.6rem 1.1rem', borderRadius: 7, fontSize: '.8rem', fontWeight: 700, textDecoration: 'none' }}>
              Claim your listing →
            </a>
          </div>
        </div>

        {/* Post an event — slim banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: '#fff', border: '1px solid #e8e8e4', borderRadius: 10, padding: '1rem 1.25rem', marginTop: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarDays size={18} strokeWidth={1.4} style={{ stroke: '#1652f0', fill: 'none', opacity: .5, flexShrink: 0 }} />
            <span style={{ fontSize: '.85rem', color: '#374151' }}>
              <strong style={{ color: '#0a1628' }}>Need to post an event?</strong>{' '}
              See all upcoming {city} business events or find the right calendar to submit yours.
            </span>
          </div>
          <Link href={`/texas/${citySlug}`}
            style={{ fontSize: '.8rem', fontWeight: 700, color: '#1652f0', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            View {city} events →
          </Link>
        </div>

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
          .org-dir-hero-grid   { grid-template-columns: 1fr !important; }
          .org-dir-steps-grid  { grid-template-columns: 1fr !important; }
          .org-dir-cat-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .org-dir-grid        { grid-template-columns: repeat(2,1fr) !important; }
          .org-dir-cta-grid    { grid-template-columns: 1fr !important; }
        }
        /* Mobile */
        @media (max-width: 600px) {
          .org-dir-grid        { grid-template-columns: 1fr !important; }
          .org-dir-cat-grid    { grid-template-columns: repeat(2,1fr) !important; }
          /* Bigger touch targets on mobile */
          .org-dir-cat-grid button { min-height: 64px !important; padding: 1rem .875rem !important; }
          /* Tighter page padding on mobile */
          #organizations { padding: 1rem !important; }
        }
        @media (max-width: 380px) {
          .org-dir-cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
