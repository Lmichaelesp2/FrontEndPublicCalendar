'use client';

import { useState } from 'react';
import {
  Landmark, Users, Home, Monitor, Briefcase,
  Building2, Handshake, Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Organization } from '../../lib/supabase';
import { OrgDetailModal } from './OrgDetailModal';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Community/Edu':     Briefcase,
  'Technology':        Monitor,
  'Real Estate':       Home,
  'Networking':        Users,
  'Chambers':          Landmark,
  'Const/Design/Mfg': Building2,
  'Co-Working':        Handshake,
  'Other':             Star,
};

interface Props {
  org: Organization;
  onAuthOpen: () => void;
}

export function OrgCard({ org, onAuthOpen }: Props) {
  const [showModal, setShowModal] = useState(false);
  const Icon = CATEGORY_ICONS[org.category || ''] ?? Star;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          background: '#fff',
          border: '1px solid #e8e8e4',
          borderRadius: 12,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(10,22,40,.06)',
          transition: 'box-shadow 0.15s, border-color 0.15s',
          minWidth: 0,
          width: '100%',
          boxSizing: 'border-box' as const,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(10,22,40,.10)';
          (e.currentTarget as HTMLDivElement).style.borderColor = '#1652f0';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(10,22,40,.06)';
          (e.currentTarget as HTMLDivElement).style.borderColor = '#e8e8e4';
        }}
      >
        {/* Ghost icon */}
        <div style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={26} strokeWidth={1.3} style={{ stroke: '#1652f0', fill: 'none', opacity: .35 }} />
        </div>

        <div style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0a1628', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
            {org.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            {org.category && (
              <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#1652f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {org.category}
              </span>
            )}
            <span style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>· {org.city}</span>
          </div>
        </div>

        <span style={{ fontSize: 11, color: '#1652f0', fontWeight: 600, flexShrink: 0 }}>View →</span>
      </div>

      {showModal && (
        <OrgDetailModal
          org={org}
          onClose={() => setShowModal(false)}
          onAuthOpen={onAuthOpen}
        />
      )}
    </>
  );
}
