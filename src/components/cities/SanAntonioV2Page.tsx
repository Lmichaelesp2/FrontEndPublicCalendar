'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Minus, Search, Building2, Users, Handshake, Home,
  Monitor, Briefcase, Landmark, Star, ChevronRight, MapPin,
} from 'lucide-react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumCityView } from '../PremiumCityView';
import type { Event } from '../../lib/supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

export type OrgRow = {
  id: number;
  name: string;
  city: string | null;
  group_type: string | null;
  category: string | null;
};

interface Props {
  initialEvents: Event[];
  orgCounts: Record<string, number>;
  totalOrgs: number;
}

// ── Org category definitions ──────────────────────────────────────────────────

const ORG_DIRECTORY_URL = '/texas/san-antonio/organizations';

const ORG_CATEGORIES = [
  {
    key: 'Chambers',
    label: 'Chambers',
    desc: 'SA Chamber, Hispanic Chamber, North SA Chamber, and more.',
    icon: Landmark,
  },
  {
    key: 'Networking',
    label: 'Networking',
    desc: 'Professional mixers, BNI chapters, and referral networks.',
    icon: Users,
  },
  {
    key: 'Real Estate',
    label: 'Real Estate',
    desc: 'SABOR, REIA groups, and real estate investor associations.',
    icon: Home,
  },
  {
    key: 'Technology',
    label: 'Technology',
    desc: 'Tech meetups, startup communities, and innovation hubs.',
    icon: Monitor,
  },
  {
    key: 'Community/Edu',
    label: 'Community/Edu',
    desc: 'Civic organizations, educational institutions, and SBDC/SCORE.',
    icon: Briefcase,
  },
  {
    key: 'Const/Design/Mfg',
    label: 'Const/Design/Mfg',
    desc: 'Contractors, architects, manufacturers, and trade associations.',
    icon: Building2,
  },
  {
    key: 'Co-Working',
    label: 'Co-Working',
    desc: 'Shared workspaces and collaborative business environments.',
    icon: Handshake,
  },
  {
    key: 'Other',
    label: 'Other',
    desc: 'Financial, healthcare, professional services, and more.',
    icon: Star,
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────

const SA_FAQ = [
  {
    q: 'Is this really free?',
    a: 'Yes — the San Antonio calendar, event details, and weekly email are completely free. No credit card required, ever.',
  },
  {
    q: 'What kinds of events are listed?',
    a: 'Chamber events, business networking mixers, real estate investor meetups, tech gatherings, SCORE workshops, lunch-and-learns, and more — all San Antonio business events in one place.',
  },
  {
    q: 'How do you find San Antonio events?',
    a: 'We monitor chambers, Meetup, Eventbrite, Facebook, LinkedIn, and dozens of local organization websites every week so you don\'t have to check multiple sites.',
  },
  {
    q: 'How is this different from Eventbrite or Meetup?',
    a: 'Those platforms only show events posted on their site. We gather events from all major platforms and local San Antonio organizations into one calendar.',
  },
  {
    q: 'What do I get with a free account?',
    a: 'Full event details, registration links, and the weekly Monday morning newsletter — the week\'s best San Antonio networking and business events delivered to your inbox.',
  },
  {
    q: 'Can I submit my own event?',
    a: 'Yes! Use our Submit Event page to add your networking or business event to the San Antonio calendar for free.',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(t: string | null): string {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

function parseDateParts(dateStr: string) {
  const [, mStr, dStr] = dateStr.split('-');
  const m = parseInt(mStr, 10) - 1;
  const d = parseInt(dStr, 10);
  const DAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // Use UTC to avoid timezone shift on date-only strings
  const dt = new Date(`${dateStr}T12:00:00`);
  return {
    dayShort: DAYS_SHORT[dt.getDay()],
    dayNum: d,
    monthShort: MONTHS_SHORT[m],
    dayLong: DAYS_LONG[dt.getDay()],
    fullLabel: `${DAYS_LONG[dt.getDay()]}, ${MONTHS_SHORT[m]} ${d}`,
  };
}

function getThisWeekRange() {
  const nowCentral = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
  );
  const day = nowCentral.getDay();
  const sun = new Date(nowCentral);
  sun.setDate(nowCentral.getDate() - day);
  const sat = new Date(sun);
  sat.setDate(sun.getDate() + 6);
  const pad = (n: number) => String(n).padStart(2, '0');
  const from = `${sun.getFullYear()}-${pad(sun.getMonth() + 1)}-${pad(sun.getDate())}`;
  const to = `${sat.getFullYear()}-${pad(sat.getMonth() + 1)}-${pad(sat.getDate())}`;
  // Next Monday
  const nextMon = new Date(sun);
  nextMon.setDate(sun.getDate() + 8);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const nextMonStr = `Mon, ${MONTHS[nextMon.getMonth()]} ${nextMon.getDate()}`;
  return { from, to, nextMonStr };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e8e8e4' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '1rem', padding: '1rem 0',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '.92rem', fontWeight: 600, color: '#0a1628', lineHeight: 1.4 }}>
          {q}
        </span>
        <span style={{ flexShrink: 0, color: '#374151', fontSize: '1.1rem', transition: 'transform .25s', display: 'inline-block', transform: open ? 'rotate(45deg)' : 'none' }}>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: '1rem' }}>
          <p style={{ fontSize: '.86rem', color: '#374151', lineHeight: 1.7, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Community Partner slot ────────────────────────────────────────────────────
// Shows a "Become a Partner" placeholder. When sponsors are active in Supabase,
// swap headline/sub/url/cta with live data from the sponsors table.

function CommunityPartnerSlot({
  headline,
  sub,
  url = '/sponsor',
  cta = 'Become a Community Partner →',
  filled = false,
}: {
  headline: string;
  sub: string;
  url?: string;
  cta?: string;
  filled?: boolean;
}) {
  return (
    <div style={{
      background: filled ? '#fff' : '#eef3fe',
      border: `1px solid ${filled ? '#e8e8e4' : '#c7d9fb'}`,
      borderRadius: 10,
      padding: '1.1rem 1.25rem 1.2rem',
      display: 'flex', flexDirection: 'column', gap: '.45rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1652f0', flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: '#1652f0' }}>
          Community Partner
        </span>
      </div>
      <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#0a1628', lineHeight: 1.35, margin: 0 }}>
        {headline}
      </p>
      <p style={{ fontSize: '.78rem', color: '#374151', lineHeight: 1.55, margin: 0 }}>
        {sub}
      </p>
      <a href={url} style={{
        display: 'inline-flex', alignItems: 'center', gap: '.25rem',
        fontSize: '.75rem', fontWeight: 700, color: '#1652f0',
        textDecoration: 'none', marginTop: '.2rem',
      }}>
        {cta}
      </a>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function V2Content({ initialEvents, orgCounts, totalOrgs }: Props) {
  const { profile } = useAuth();
  const isPremium = profile?.subscription_tier === 'premium';
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const { from, to, nextMonStr } = useMemo(() => getThisWeekRange(), []);

  // Filter to this week's events
  const weekEvents = useMemo(
    () => initialEvents.filter(e => e.start_date >= from && e.start_date <= to),
    [initialEvents, from, to]
  );

  const thisWeekCount = weekEvents.length;

  // Group by day, filter by search
  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = weekEvents.filter(e =>
      !q ||
      (e.name ?? '').toLowerCase().includes(q) ||
      (e.org_name ?? '').toLowerCase().includes(q)
    );
    const map = new Map<string, Event[]>();
    for (const ev of filtered) {
      if (!map.has(ev.start_date)) map.set(ev.start_date, []);
      map.get(ev.start_date)!.push(ev);
    }
    // Sort events within each day by time
    for (const [, evs] of map) {
      evs.sort((a, b) => (a.start_time ?? '99:99') < (b.start_time ?? '99:99') ? -1 : 1);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a < b ? -1 : 1);
  }, [weekEvents, search]);

  if (isPremium) {
    return <PremiumCityView city="San Antonio" citySlug="san-antonio" initialEvents={initialEvents} />;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>
      <Navigation />

      {/* ── Hero ── */}
      <section style={{ padding: '3.5rem 2rem 0', background: '#fff' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 290px',
          gap: '3rem', alignItems: 'start', paddingBottom: '3rem',
        }} className="v2-hero-grid">
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.06em', color: '#1652f0', marginBottom: '1.1rem',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1652f0', display: 'inline-block' }} />
              This week in San Antonio · {thisWeekCount} events
            </div>
            <h1 style={{
              fontFamily: 'var(--serif, Georgia)', fontSize: 'clamp(2rem,4vw,2.75rem)',
              fontWeight: 600, lineHeight: 1.15, letterSpacing: '-.025em',
              color: '#0a1628', marginBottom: '1.1rem',
            }}>
              Find the events and organizations where San Antonio business{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#042C53' }}>actually</em> happens.
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#0a1628', marginBottom: '1.75rem', maxWidth: 520 }}>
              Hundreds of San Antonio business networking events and {totalOrgs}+ local organizations —
              all in one place, updated every week.
            </p>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '.75rem' }}>
              <button
                onClick={() => setAuthOpen(true)}
                className="btn btn-primary"
                style={{ cursor: 'pointer' }}
              >
                Get Free Access
              </button>
              <a href="#events" className="btn btn-ghost">Browse Events →</a>
            </div>
            <p style={{ fontSize: '.82rem', color: '#374151' }}>Free forever · No credit card</p>
          </div>

          {/* Stats panel */}
          <div style={{
            border: '1px solid #e8e8e4', borderRadius: 12, overflow: 'hidden',
            background: '#fff', boxShadow: '0 2px 12px rgba(10,22,40,.08)',
          }}>
            <div style={{
              fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.1em', color: '#374151', padding: '.7rem 1.2rem',
              borderBottom: '1px solid #e8e8e4', background: '#f7f7f5',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>San Antonio</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>● Live</span>
            </div>
            {[
              { label: 'Events this week', value: String(thisWeekCount) },
              { label: 'Organizations tracked', value: `${totalOrgs}+` },
              { label: 'Categories', value: '8' },
              { label: 'Updated', value: 'Every week' },
              { label: 'Free to browse', value: 'Yes' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '.6rem 1.2rem', borderBottom: '1px solid #e8e8e4', fontSize: '.83rem',
              }}>
                <span style={{ color: '#374151' }}>{label}</span>
                <span style={{ fontWeight: 700, color: label === 'Free to browse' ? '#10b981' : '#0a1628' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strip */}
        <div style={{
          background: '#042C53', color: 'rgba(255,255,255,.65)',
          fontSize: '.7rem', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase',
          padding: '.55rem 2rem', display: 'flex', alignItems: 'center',
          gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <span>Next Newsletter: {nextMonStr} · 6:00 AM CT</span>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>|</span>
          <span>{totalOrgs}+ organizations tracked</span>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>|</span>
          <span>SABusinessCalendar.com</span>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section style={{ background: '#f7f7f5', padding: '2.75rem 2rem', borderTop: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#1652f0', marginBottom: '.35rem' }}>
              Who it's for
            </div>
            <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: 'clamp(1.3rem,2.5vw,1.65rem)', fontWeight: 600, color: '#0a1628', letterSpacing: '-.02em', margin: 0 }}>
              This calendar is built for you
            </h2>
          </div>
          {/* Horizontal bar — 4 sections with dividers */}
          <div className="v2-who-bar" style={{
            background: '#fff', border: '1px solid #e8e8e4',
            borderRadius: 12, display: 'flex', overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(10,22,40,.06)',
          }}>
            {([
              { label: 'Business Owners',        Icon: Briefcase, color: '#1652f0' },
              { label: 'Business Professionals',  Icon: Users,     color: '#c2410c' },
              { label: 'New to San Antonio',      Icon: MapPin,    color: '#1652f0' },
              { label: 'Building your network',   Icon: Handshake, color: '#c2410c' },
            ] as const).map(({ label, Icon, color }, i) => (
              <div key={label} className="v2-who-cell" style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '.7rem',
                padding: '1.75rem 1rem',
                borderLeft: i > 0 ? '1px solid #e8e8e4' : 'none',
                textAlign: 'center',
              }}>
                <Icon size={40} strokeWidth={1.1} style={{ stroke: color, fill: 'none', opacity: .28 }} />
                <span style={{ fontSize: '.88rem', fontWeight: 700, color: '#0a1628', lineHeight: 1.3 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '3.5rem 2rem', background: '#fff', borderTop: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#1652f0', marginBottom: '.4rem' }}>
            How it works
          </div>
          <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '1.75rem', color: '#0a1628', marginBottom: '.65rem', fontWeight: 600, letterSpacing: '-.02em' }}>
            San Antonio's Business Community in One Place
          </h2>
          <p style={{ color: '#0a1628', fontSize: '.97rem', marginBottom: '2.5rem', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Events and the organizations hosting them — gathered from chambers, Eventbrite, Meetup,
            and dozens of local sites — updated every week.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }} className="v2-how-grid">
            {[
              { n: '1', title: "Browse this week's events", body: "See every San Antonio business networking event this week, organized by day. Subscribe free to unlock event details and registration links." },
              { n: '2', title: `Explore ${totalOrgs}+ organizations`, body: `Browse ${totalOrgs}+ San Antonio chambers, associations, and networking groups across 8 categories. Subscribe free to unlock organization contact details.` },
              { n: '3', title: 'Get the weekly newsletter', body: 'Every Monday morning, this week\'s San Antonio business events land in your inbox. Free, 30 seconds to set up.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{
                background: '#fff', borderRadius: 8, padding: '1.25rem 1.1rem 2.5rem',
                textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,.07)',
                border: '1px solid #e8e8e4', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', bottom: -10, right: 8,
                  fontSize: '4.5rem', fontWeight: 800, color: '#c2410c',
                  opacity: .10, lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
                }}>{n}</div>
                <h3 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '.95rem', fontWeight: 600, color: '#0a1628', marginBottom: '.5rem' }}>{title}</h3>
                <p style={{ fontSize: '.84rem', color: '#0a1628', lineHeight: 1.6, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Events section ── */}
      <section id="events" style={{ background: '#f7f7f5', padding: '3.5rem 2rem', borderTop: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#1652f0', marginBottom: '.4rem' }}>
            Events Calendar
          </div>
          <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: 'clamp(1.35rem,3vw,1.8rem)', fontWeight: 600, color: '#0a1628', letterSpacing: '-.02em', marginBottom: '.4rem' }}>
            San Antonio Business Events — This Week
          </h2>
          <p style={{ fontSize: '.95rem', color: '#0a1628', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: 600 }}>
            Browse all events free. Subscribe to get event details, registration links, and the weekly Monday newsletter.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 300, marginBottom: '1.5rem' }}>
            <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events…"
              style={{
                width: '100%', padding: '7px 12px 7px 28px',
                border: '1px solid #e8e8e4', borderRadius: 8,
                fontSize: '.84rem', fontFamily: 'inherit', color: '#0a1628',
                background: '#fff', outline: 'none',
              }}
            />
          </div>

          {/* Event days */}
          {grouped.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '.9rem' }}>
              {search ? 'No events match your search.' : 'No events found for this week.'}
            </div>
          )}

          {grouped.map(([dateStr, events], dayIndex) => {
            const parts = parseDateParts(dateStr);
            return (
              <div key={dateStr} style={{ marginBottom: '2rem' }}>
                {/* Community partner cards — after 2nd day group */}
                {dayIndex === 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '2rem' }} className="v2-partner-grid">
                    <CommunityPartnerSlot
                      headline="Your brand in front of SA's business community."
                      sub="Be seen by the business owners and professionals who check this calendar every week."
                    />
                    <CommunityPartnerSlot
                      headline="Be the company that keeps SA connected."
                      sub="Community partners make this free weekly resource possible for thousands of local professionals."
                    />
                  </div>
                )}
                {/* Day header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '.5rem',
                  paddingBottom: '.4rem', borderBottom: '2px solid #0a1628', marginBottom: 8,
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0a1628' }}>{parts.dayLong}</span>
                  <span style={{ fontSize: '.82rem', color: '#94a3b8', fontWeight: 400 }}>{parts.monthShort} {parts.dayNum}</span>
                  <span style={{
                    marginLeft: 'auto', background: '#0a1628', color: '#fff',
                    fontSize: '.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                  }}>{events.length} events</span>
                </div>

                {/* Event cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {events.map(ev => (
                    <div key={ev.id} style={{
                      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
                      overflow: 'hidden', display: 'flex', alignItems: 'stretch',
                      transition: 'box-shadow .15s',
                    }}>
                      {/* Date badge */}
                      <div style={{
                        width: 58, flexShrink: 0, background: '#042C53',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', padding: '10px 6px', gap: 1,
                      }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.08em', lineHeight: 1 }}>{parts.dayShort}</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{parts.dayNum}</span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,.45)', lineHeight: 1 }}>{parts.monthShort}</span>
                      </div>

                      {/* Event body */}
                      <div style={{ flex: 1, padding: '9px 12px', minWidth: 0, borderRight: '1px solid #e2e8f0' }}>
                        {ev.start_time && (
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#1652f0', marginBottom: 2 }}>{formatTime(ev.start_time)}</div>
                        )}
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0a1628', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
                          {ev.name}
                        </div>
                        {ev.org_name && (
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ev.org_name}
                          </div>
                        )}
                      </div>

                      {/* Details button */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', flexShrink: 0 }}>
                        <button
                          onClick={() => setAuthOpen(true)}
                          style={{
                            background: '#c2410c', color: '#fff', fontSize: 11, fontWeight: 700,
                            padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                            fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background .15s',
                          }}
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Per-day CTA bar */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 14px', background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: 8, marginTop: 6,
                }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Free access · full event details · weekly newsletter</span>
                  <button
                    onClick={() => setAuthOpen(true)}
                    style={{
                      fontSize: 11, fontWeight: 700, color: '#fff', background: '#042C53',
                      padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background .15s',
                    }}
                  >
                    Get free access →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Community Partners — events section bottom ── */}
      <section style={{ background: '#f7f7f5', padding: '2.5rem 2rem', borderTop: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: '#374151', marginBottom: '.85rem' }}>
            Community Partners — Supporting San Antonio's Business Community
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }} className="v2-partner-grid">
            <CommunityPartnerSlot
              headline="Support San Antonio's business community."
              sub="Partner with us and be recognized by the business owners, professionals, and organizations that make up SA's business ecosystem."
            />
            <CommunityPartnerSlot
              headline="Help keep SA's business events free for everyone."
              sub="Community partners make this calendar — and the weekly Monday newsletter — free and accessible to all San Antonio professionals."
            />
          </div>
        </div>
      </section>

      {/* ── Organizations section ── */}
      <section id="organizations" style={{ background: '#fff', padding: '3.5rem 2rem', borderTop: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#1652f0', marginBottom: '.4rem' }}>
            Organizations
          </div>
          <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: 'clamp(1.35rem,3vw,1.8rem)', fontWeight: 600, color: '#0a1628', letterSpacing: '-.02em', marginBottom: '.4rem' }}>
            {totalOrgs}+ San Antonio Business Organizations
          </h2>
          <p style={{ fontSize: '.95rem', color: '#0a1628', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 600 }}>
            Browse chambers, associations, networking groups, and more. Subscribe free to unlock contact details and event schedules.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem',
          }} className="v2-org-grid">
            {ORG_CATEGORIES.map(({ key, label, desc, icon: Icon }) => {
              const count = orgCounts[key] ?? 0;
              const isLoggedIn = !!profile;

              const cardStyle: React.CSSProperties = {
                background: '#fff', border: '1px solid #e8e8e4', borderRadius: 12,
                padding: '1.2rem 1.1rem 1rem', textDecoration: 'none', color: 'inherit',
                display: 'flex', flexDirection: 'column', gap: 6,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(10,22,40,.06)',
                transition: 'all .15s',
              };

              const cardInner = (
                <>
                  <div style={{ position: 'absolute', bottom: 10, right: 10, pointerEvents: 'none', userSelect: 'none', lineHeight: 0 }}>
                    <Icon size={56} strokeWidth={1.2} style={{ stroke: '#1652f0', fill: 'none', opacity: .18 }} />
                  </div>
                  <span style={{ fontSize: '.88rem', fontWeight: 800, color: '#0a1628', letterSpacing: '-.01em', paddingRight: 52, display: 'block' }}>
                    {label}
                  </span>
                  {count > 0 && (
                    <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#1652f0' }}>{count} organizations</span>
                  )}
                  <span style={{ fontSize: '.78rem', color: '#0a1628', lineHeight: 1.6, flex: 1, paddingRight: 40, display: 'block' }}>
                    {desc}
                  </span>
                  <span style={{ fontSize: '.76rem', fontWeight: 700, color: '#c2410c', marginTop: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    View all <ChevronRight size={12} />
                  </span>
                </>
              );

              // Logged in → go to LBO directory (opens in new tab)
              // Logged out → sign up first
              return isLoggedIn ? (
                <a key={key} href={ORG_DIRECTORY_URL} target="_blank" rel="noopener noreferrer" style={cardStyle}>
                  {cardInner}
                </a>
              ) : (
                <button key={key} onClick={() => setAuthOpen(true)} style={cardStyle}>
                  {cardInner}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: '#f7f7f5', padding: '3rem 2rem', borderTop: '1px solid #e8e8e4', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--serif, Georgia)', fontSize: 'clamp(1.15rem,2.5vw,1.5rem)',
            fontWeight: 600, color: '#0a1628', lineHeight: 1.4, letterSpacing: '-.015em',
            maxWidth: 620, margin: '0 auto 2rem', fontStyle: 'italic',
          }}>
            "Finally, all the networking events in <em>one place.</em>"
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.85rem', textAlign: 'left' }} className="v2-testimonial-grid">
            {[
              { quote: "Finally, all the networking events in one place. No more missing out because I didn't know something was happening.", name: 'Sarah M.', loc: 'San Antonio, TX' },
              { quote: "This calendar has become essential for growing my professional network in the Alamo City. The weekly email alone saves me hours.", name: 'Marcus T.', loc: 'San Antonio, TX' },
              { quote: "I used to check the SA Chamber site, Eventbrite, and Facebook separately. Now I just check one site.", name: 'Jennifer L.', loc: 'San Antonio, TX' },
            ].map(({ quote, name, loc }) => (
              <div key={name} style={{
                background: '#fff', border: '1px solid #e8e8e4', borderRadius: 8,
                padding: '1.1rem 1rem', borderTop: '3px solid #c2410c',
              }}>
                <div style={{ color: '#c2410c', fontSize: '.8rem', letterSpacing: 1, marginBottom: '.6rem' }}>★★★★★</div>
                <p style={{ fontSize: '.82rem', color: '#374151', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '.85rem' }}>"{quote}"</p>
                <div>
                  <strong style={{ fontSize: '.82rem', color: '#0a1628', display: 'block' }}>{name}</strong>
                  <span style={{ fontSize: '.73rem', color: '#6b7280' }}>{loc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Is your event listed? ── */}
      <section style={{ background: '#eef3fe', padding: '3rem 2rem', borderTop: '1px solid #c7d9fb', borderBottom: '1px solid #c7d9fb' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
          <div style={{ flexShrink: 0, width: 52, height: 52, background: '#1652f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: '1.25rem', fontWeight: 600, color: '#0a1628', marginBottom: '.5rem', letterSpacing: '-.02em' }}>
              Is your event or organization on the calendar?
            </h2>
            <p style={{ fontSize: '.9rem', color: '#374151', lineHeight: 1.7, marginBottom: '1.1rem', maxWidth: 580 }}>
              We track hundreds of San Antonio business organizations, but we may have missed yours.
              Submit your event or organization for free and reach thousands of local professionals.
            </p>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <Link href="/submit-event" className="btn btn-primary" style={{ padding: '.55rem 1.1rem', fontSize: '.82rem' }}>Submit an Event</Link>
              <Link href="/texas/san-antonio/organizations" className="btn btn-ghost" style={{ padding: '.55rem 1.1rem', fontSize: '.82rem' }}>Browse Organizations</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscribe section ── */}
      <section style={{ background: '#042C53', padding: '4.5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,.4)', marginBottom: '.25rem' }}>
            Free Access
          </div>
          <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 700, color: '#fff', letterSpacing: '-.025em', lineHeight: 1.2 }}>
            Get the Full Week of San Antonio Events
          </h2>
          <p style={{ fontSize: '.92rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: 440 }}>
            Create your free account to unlock event details, registration links, and the weekly Monday newsletter.
          </p>
          <Link
            href="/texas/san-antonio/subscribe"
            style={{
              background: '#fff', color: '#042C53', fontWeight: 700,
              padding: '.85rem 2rem', borderRadius: 8, fontSize: '.95rem',
              textDecoration: 'none', display: 'inline-block', transition: 'all .2s',
            }}
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '4rem 2rem', background: '#f7f7f5', borderTop: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--serif, Georgia)', fontSize: '1.45rem', color: '#0a1628',
            fontWeight: 600, letterSpacing: '-.02em', textAlign: 'center', marginBottom: '2rem',
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{ borderTop: '1px solid #e8e8e4' }}>
            {SA_FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      <Footer showIndustryCalendars={true} citySlug="san-antonio" cityName="San Antonio" />

      {/* ── Auth modal ── */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        cityName="San Antonio"
      />

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (max-width: 900px) {
          .v2-how-grid { grid-template-columns: 1fr !important; }
          .v2-org-grid { grid-template-columns: repeat(2,1fr) !important; }
          .v2-testimonial-grid { grid-template-columns: 1fr !important; }
          .v2-who-bar { flex-wrap: wrap !important; }
          .v2-who-cell { flex: 1 1 45% !important; border-left: none !important; border-top: 1px solid #e8e8e4 !important; }
          .v2-who-cell:nth-child(-n+2) { border-top: none !important; }
          .v2-who-cell:nth-child(odd) { border-right: 1px solid #e8e8e4 !important; }
        }
        @media (max-width: 680px) {
          .v2-hero-grid { grid-template-columns: 1fr !important; }
          .v2-partner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export function SanAntonioV2Page(props: Props) {
  return <V2Content {...props} />;
}
