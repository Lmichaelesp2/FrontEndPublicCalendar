'use client';

import { useState } from 'react';
import type { Organization } from '../../lib/supabase';
import { OrgDetailModal } from './OrgDetailModal';

const CATEGORY_ICONS: Record<string, string> = {
  'Community/Edu':     '🎓',
  'Technology':        '💻',
  'Real Estate':       '🏢',
  'Networking':        '🤝',
  'Chambers':          '🏛️',
  'Const/Design/Mfg': '🔧',
  'Co-Working':        '🏠',
  'Other':             '⚡',
};

interface Props {
  org: Organization;
  onAuthOpen: () => void;
}

export function OrgCard({ org, onAuthOpen }: Props) {
  const [showModal, setShowModal] = useState(false);
  const icon = CATEGORY_ICONS[org.category || ''] ?? '⚡';

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          background: '#fff',
          border: '1px solid #e8e8e4',
          borderRadius: 10,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
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
        <span style={{ fontSize: '1.4rem', flexShrink: 0, opacity: 0.7 }}>{icon}</span>

        <div style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0a1628', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
            {org.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            {org.category && (
              <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#1652f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {org.category}
              </span>
            )}
            <span style={{ fontSize: 9.5, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>· {org.city}</span>
          </div>
        </div>

        <span style={{ fontSize: 10.5, color: '#1652f0', fontWeight: 600, flexShrink: 0 }}>View →</span>
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
