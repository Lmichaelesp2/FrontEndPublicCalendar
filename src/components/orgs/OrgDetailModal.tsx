'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Organization } from '../../lib/supabase';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
}

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 3).map(w => w[0]).join('').toUpperCase();
}

/** 'San Antonio' -> 'san-antonio' — matches city_slug values used across sponsors table */
function citySlugOf(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, '-');
}

// The org directory's own partner slot: one active row per city, category_slug = 'org-directory'
const ORG_DIRECTORY_CATEGORY_SLUG = 'org-directory';

interface OrgPartner {
  name: string;
  tagline: string;
  url: string | null;
  logo_url: string | null;
  cta_label: string | null;
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  'Community/Edu':     { bg: '#eef3fe', color: '#1652f0', border: '#c7d9fc' },
  'Technology':        { bg: '#ede9fe', color: '#6d28d9', border: '#c4b5fd' },
  'Real Estate':       { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  'Networking':        { bg: '#f0fdf9', color: '#0f6e56', border: '#6ee7b7' },
  'Chambers':          { bg: '#eef3fe', color: '#1652f0', border: '#c7d9fc' },
  'Const/Design/Mfg': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  'Co-Working':        { bg: '#f0fdf9', color: '#0f6e56', border: '#6ee7b7' },
  'Other':             { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
};

function Chip({ label, color = '#1652f0', bg = '#eef3fe' }: { label: string; color?: string; bg?: string }) {
  return (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: bg, color, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.10em', color: '#94a3b8', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
      <span style={{ fontSize: 14, color: '#94a3b8', flexShrink: 0, marginTop: 1, width: 16, textAlign: 'center' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 1 }}>{label}</span>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, color: '#1652f0', fontWeight: 500, textDecoration: 'none', wordBreak: 'break-word' }}>
            {value}
          </a>
        ) : (
          <span style={{ fontSize: 13, color: '#0a1628', fontWeight: 500 }}>{value}</span>
        )}
      </div>
    </div>
  );
}

interface Props {
  org: Organization;
  onClose: () => void;
  onAuthOpen: () => void;
}

export function OrgDetailModal({ org, onClose, onAuthOpen }: Props) {
  const { user, loading } = useAuth();
  // Use `user` (session-derived, available immediately) not `profile` (requires a DB roundtrip)
  const isLoggedIn = !!user;

  // Slim partner line — one active sponsor row per city, category_slug = 'org-directory'
  const [partner, setPartner] = useState<OrgPartner | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function fetchPartner() {
      const { data } = await supabase
        .from('sponsors')
        .select('name, tagline, url, logo_url, cta_label')
        .eq('city_slug', citySlugOf(org.city))
        .eq('category_slug', ORG_DIRECTORY_CATEGORY_SLUG)
        .eq('active', true)
        .maybeSingle();
      if (!cancelled) setPartner(data ?? null);
    }
    fetchPartner();
    return () => { cancelled = true; };
  }, [org.city]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  const catColors = CATEGORY_COLORS[org.category || ''] ?? CATEGORY_COLORS['Other'];

  const quickFacts: string[] = [];
  if (org.founded_year) quickFacts.push(`Est. ${org.founded_year}`);
  if (org.how_active) quickFacts.push(org.how_active);
  if (org.national_affiliate) quickFacts.push(org.national_affiliate);
  if (org.guest_friendly === 'Yes' || org.guest_friendly === 'yes') quickFacts.push('Guest friendly');

  return (
    <div onClick={handleBackdrop} style={{
      position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 580,
        maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(10,22,40,.28)',
        position: 'relative',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14, background: '#f7f7f5',
          border: '1px solid #e8e8e4', borderRadius: 6, width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#374151', zIndex: 10,
        }}>
          <X size={14} />
        </button>

        {/* Header */}
        <div style={{ padding: '24px 28px 18px', borderBottom: '1px solid #e8e8e4' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingRight: 24 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12, flexShrink: 0,
              background: catColors.bg, border: `1.5px solid ${catColors.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: catColors.color, letterSpacing: '.02em',
            }}>
              {getInitials(org.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontFamily: 'var(--serif, Georgia)', fontSize: 20, fontWeight: 700, color: '#0a1628', lineHeight: 1.2, marginBottom: 8 }}>
                {org.name}
              </h2>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                {org.category && <Chip label={org.category} color={catColors.color} bg={catColors.bg} />}
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{org.city}, TX</span>
                {org.verified && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, color: '#065f46', background: '#d1fae5', padding: '2px 8px', borderRadius: 100 }}>
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {quickFacts.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
              {quickFacts.map(f => (
                <span key={f} style={{ fontSize: 11, color: '#374151', background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 100, padding: '3px 10px', fontWeight: 500 }}>
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {loading ? (
            /* Session still resolving — don't flash the auth gate */
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: 13 }}>
              Loading…
            </div>
          ) : isLoggedIn ? (
            <>
              {org.description && (
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                  {stripHtml(org.description)}
                </p>
              )}

              {org.home_page && (
                <div>
                  <a href={org.home_page} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1652f0', fontWeight: 600, textDecoration: 'none', background: '#eef3fe', padding: '7px 14px', borderRadius: 8 }}>
                    ↗ Visit website
                  </a>
                </div>
              )}

              {(org.typical_title || org.industries_served || org.membership_type || org.membership_fee_range) && (
                <div style={{ background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 10, padding: '16px 18px' }}>
                  <SectionLabel>Who It's For</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {org.typical_title && <InfoRow icon="👤" label="Typical member" value={org.typical_title} />}
                    {org.industries_served && <InfoRow icon="🏢" label="Industries" value={org.industries_served} />}
                    {org.membership_type && <InfoRow icon="🎫" label="Membership" value={org.membership_type} />}
                    {org.membership_fee_range && <InfoRow icon="💰" label="Fee range" value={org.membership_fee_range} />}
                  </div>
                </div>
              )}

              {(org.event_format || org.event_size || org.formality || org.primary_value || org.ai_match_tags) && (
                <div style={{ background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 10, padding: '16px 18px' }}>
                  <SectionLabel>What To Expect</SectionLabel>
                  {(org.event_format || org.event_size || org.formality || org.ai_match_tags) && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: org.primary_value ? 12 : 0 }}>
                      {org.event_format && <Chip label={org.event_format} />}
                      {org.event_size && <Chip label={org.event_size} />}
                      {org.formality && <Chip label={org.formality} />}
                      {org.ai_match_tags && org.ai_match_tags.split(',').slice(0, 4).map(t => (
                        <Chip key={t.trim()} label={t.trim()} color="#374151" bg="#f7f7f5" />
                      ))}
                    </div>
                  )}
                  {org.primary_value && (
                    <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0, paddingTop: (org.event_format || org.event_size || org.formality) ? 10 : 0, borderTop: (org.event_format || org.event_size || org.formality) ? '1px solid #e8e8e4' : 'none' }}>
                      {org.primary_value}
                    </p>
                  )}
                </div>
              )}

              {/* Get Connected (contact info) — hidden for now, revisit later */}

              {(org.linkedin_url || org.facebook_url || org.instagram_url || org.calendar_website) && (
                <div style={{ background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 10, padding: '16px 18px' }}>
                  <SectionLabel>Find Them Online</SectionLabel>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {org.linkedin_url && (
                      <a href={org.linkedin_url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#0a66c2', background: '#e8f0fe', border: '1px solid #c7d9fc', padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>
                        LinkedIn
                      </a>
                    )}
                    {org.facebook_url && (
                      <a href={org.facebook_url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#1877f2', background: '#e7f3ff', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>
                        Facebook
                      </a>
                    )}
                    {org.instagram_url && (
                      <a href={org.instagram_url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#c2185b', background: '#fce4ec', border: '1px solid #f8bbd0', padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>
                        Instagram
                      </a>
                    )}
                    {org.calendar_website && (
                      <a href={org.calendar_website} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#1652f0', background: '#eef3fe', border: '1px solid #c7d9fc', padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>
                        Events calendar
                      </a>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Auth gate — only shown to genuinely logged-out visitors */
            <div style={{ background: 'linear-gradient(135deg, #fff 0%, #f0f4ff 100%)', border: '1px solid #e8e8e4', borderRadius: 12, padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eef3fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18, color: '#1652f0' }}>🔒</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--serif, Georgia)', fontSize: 15, fontWeight: 700, color: '#0a1628', marginBottom: 4 }}>
                  Sign in to see the full profile
                </div>
                <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, margin: '0 0 12px' }}>
                  Create a free account to unlock contact info, membership details, social links, and more.
                </p>
                <button
                  onClick={() => { onClose(); onAuthOpen(); }}
                  style={{ background: '#c2410c', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Create free account →
                </button>
              </div>
            </div>
          )}

          {/* Claim link */}
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            <a href="https://www.localbusinessorganizations.com/claim" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}>
              Is this your organization? <span style={{ color: '#1652f0', fontWeight: 600 }}>Claim this listing →</span>
            </a>
          </div>

          {/* Slim partner line */}
          {partner && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              borderTop: '1px solid #f0f0ee', paddingTop: 12, fontSize: 11, color: '#94a3b8',
            }}>
              <span>{org.city} organizations are brought to you by</span>
              <a href={partner.url ?? 'https://localbusinesscalendars.com/sponsor'} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#1652f0', fontWeight: 700, textDecoration: 'none' }}>
                {partner.logo_url && (
                  <img src={partner.logo_url} alt="" style={{ height: 14, width: 'auto', objectFit: 'contain' }} />
                )}
                {partner.name}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
