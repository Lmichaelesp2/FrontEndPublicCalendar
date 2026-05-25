'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

interface Props {
  city: string;
  citySlug: string;
  category?: string;
  categorySlug?: string;
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

const DURATION = 6000;

// ─── No-sponsor: cycling carousel ────────────────────────────────────────────

function VacantPatronSection({ city, category }: { city: string; category?: string }) {
  const [state, setState] = useState<'sponsor' | 'vacant'>('sponsor');
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progress, setProgress] = useState(0);
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = (current: 'sponsor' | 'vacant') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progRef.current) clearInterval(progRef.current);
    setProgress(0);
    const start = Date.now();
    progRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / DURATION) * 100, 100));
    }, 50);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        const next = current === 'sponsor' ? 'vacant' : 'sponsor';
        setState(next); setVisible(true); startCycle(next);
      }, 700);
    }, DURATION);
  };

  useEffect(() => {
    startCycle('sponsor');
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progRef.current) clearInterval(progRef.current);
    };
  }, []);

  const goTo = (target: 'sponsor' | 'vacant') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progRef.current) clearInterval(progRef.current);
    setVisible(false);
    setTimeout(() => { setState(target); setVisible(true); startCycle(target); }, 700);
  };

  return (
    <div style={{ borderTop: '3px solid #c2410c', background: '#fff7f4', borderBottom: '1px solid #f5cfc4' }}>
      <div style={{ height: '2px', background: '#f5cfc4' }}>
        <div style={{ height: '100%', background: '#c2410c', width: `${progress}%`, transition: 'width 0.05s linear' }} />
      </div>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.7s ease, transform 0.7s ease', padding: '1.75rem 1.5rem 1.5rem', maxWidth: '640px', margin: '0 auto' }}>
        {state === 'sponsor' ? (
          <>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9a3412', textAlign: 'center', marginBottom: '1.25rem' }}>
              This free calendar is made possible by
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '1.25rem' }}>
              <div style={{ width: '72px', height: '72px', flexShrink: 0, background: '#fff', borderRadius: '12px', border: '1px solid #f5cfc4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="52" height="52" rx="10" fill="#fff7f4"/>
                  <rect x="8" y="10" width="36" height="26" rx="4" fill="#042C53"/>
                  <rect x="12" y="14" width="28" height="3" rx="1.5" fill="#85B7EB"/>
                  <rect x="12" y="20" width="20" height="2.5" rx="1.25" fill="#B5D4F4"/>
                  <rect x="12" y="25" width="16" height="2.5" rx="1.25" fill="#B5D4F4"/>
                  <circle cx="38" cy="36" r="8" fill="#c2410c"/>
                  <path d="M35 36l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="19" y="38" width="14" height="3" rx="1.5" fill="#042C53" fillOpacity="0.2"/>
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#042C53', marginBottom: '3px' }}>Event Assistant</div>
                <div style={{ fontSize: '12px', color: '#185FA5', fontWeight: 500 }}>
                  Helping {city}{category ? ` ${category.toLowerCase()}` : ''} professionals find the right events
                </div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #f5cfc4', padding: '1rem 1.1rem', marginBottom: '1.1rem' }}>
              <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
                &ldquo;{city}&rsquo;s business community is one of the most active in Texas. We sponsor this calendar because we believe every professional deserves to know what&rsquo;s happening in their city — for free.&rdquo;
              </p>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', fontWeight: 500 }}>— Louis Espinoza, Founder · Event Assistant</p>
              <div style={{ marginTop: '12px' }}>
                <Link href="/subscribe" style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: '#c2410c', borderRadius: '6px', padding: '7px 16px', textDecoration: 'none', display: 'inline-block' }}>
                  Sign up free — get this week&rsquo;s events →
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9a3412', textAlign: 'center', marginBottom: '0.85rem' }}>
              Community supported · Free to all {city} professionals
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#042C53', textAlign: 'center', marginBottom: '0.6rem' }}>
              Become the founding patron of this calendar.
            </p>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.75, textAlign: 'center', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              This free resource is kept alive by community sponsors. If your organization is committed to the {city} business community, we&rsquo;d be honored to feature you right here — above every event listing, in every weekly newsletter.
            </p>
            <div style={{ textAlign: 'center' }}>
              <Link href="/sponsor" style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: '#c2410c', borderRadius: '6px', padding: '10px 24px', textDecoration: 'none', display: 'inline-block' }}>
                Become the Founding Patron →
              </Link>
            </div>
          </>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.1rem' }}>
          <button onClick={() => goTo('sponsor')} style={{ width: '7px', height: '7px', borderRadius: '50%', background: state === 'sponsor' ? '#c2410c' : '#f5cfc4', border: 'none', padding: 0, cursor: 'pointer', transition: 'background 0.4s' }} />
          <button onClick={() => goTo('vacant')} style={{ width: '7px', height: '7px', borderRadius: '50%', background: state === 'vacant' ? '#c2410c' : '#f5cfc4', border: 'none', padding: 0, cursor: 'pointer', transition: 'background 0.4s' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Real sponsor: static display ────────────────────────────────────────────

function ActiveSponsorSection({ city, category, sponsor }: { city: string; category?: string; sponsor: SponsorInfo }) {
  return (
    <div style={{ borderTop: '3px solid #c2410c', background: '#fff7f4', borderBottom: '1px solid #f5cfc4' }}>
      <div style={{ padding: '1.5rem 1.5rem 1.25rem', maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9a3412', textAlign: 'center', marginBottom: '1.1rem' }}>
          This free {category ? `${city} ${category.toLowerCase()} ` : `${city} `}calendar is sponsored by
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '1.1rem' }}>
          <div style={{ width: '72px', height: '72px', flexShrink: 0, background: '#fff', borderRadius: '10px', border: '1px solid #f5cfc4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {sponsor.logo_url ? (
              <Image src={sponsor.logo_url} alt={`${sponsor.name} logo`} width={64} height={64} style={{ objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '48px', height: '48px', background: '#f5cfc4', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#9a3412', fontWeight: 800 }}>
                {sponsor.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'left' }}>
            {sponsor.url ? (
              <a href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '18px', fontWeight: 700, color: '#042C53', textDecoration: 'none', display: 'block', marginBottom: '3px' }}>
                {sponsor.name}
              </a>
            ) : (
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#042C53', marginBottom: '3px' }}>{sponsor.name}</div>
            )}
            <div style={{ fontSize: '12px', color: '#555', fontWeight: 500 }}>{sponsor.tagline}</div>
          </div>
        </div>
        {sponsor.quote && (
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #f5cfc4', padding: '1rem 1.1rem' }}>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
              &ldquo;{sponsor.quote}&rdquo;
            </p>
            {sponsor.quote_by && (
              <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', fontWeight: 500 }}>— {sponsor.quote_by}</p>
            )}
            {sponsor.url && (
              <div style={{ marginTop: '12px' }}>
                <a href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: '#c2410c', borderRadius: '6px', padding: '7px 16px', textDecoration: 'none', display: 'inline-block' }}>
                  {sponsor.cta_label ?? `Visit ${sponsor.name} →`}
                </a>
              </div>
            )}
          </div>
        )}
        <p style={{ fontSize: '10px', color: '#bbb', textAlign: 'center', marginTop: '0.75rem', marginBottom: 0 }}>
          Sponsored content — <Link href="/sponsor" style={{ color: '#bbb', textDecoration: 'underline' }}>about our sponsorships</Link>
        </p>
      </div>
    </div>
  );
}

// ─── Main export — fetches from Supabase ─────────────────────────────────────

export function SponsorPatronSection({ city, citySlug, category, categorySlug }: Props) {
  const [sponsor, setSponsor] = useState<SponsorInfo | null | undefined>(undefined);

  useEffect(() => {
    async function fetchSponsor() {
      const query = supabase
        .from('sponsors')
        .select('name, tagline, quote, quote_by, logo_url, url, cta_label')
        .eq('city_slug', citySlug)
        .eq('active', true);

      // category_slug: NULL for city-wide, specific value for sub-cal
      const finalQuery = categorySlug
        ? query.eq('category_slug', categorySlug)
        : query.is('category_slug', null);

      const { data } = await finalQuery.maybeSingle();
      setSponsor(data ?? null);
    }
    fetchSponsor();
  }, [citySlug, categorySlug]);

  // Still loading — render nothing to avoid flash
  if (sponsor === undefined) return null;

  if (sponsor) {
    return <ActiveSponsorSection city={city} category={category} sponsor={sponsor} />;
  }

  return <VacantPatronSection city={city} category={category} />;
}
