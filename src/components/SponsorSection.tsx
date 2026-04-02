'use client';
import { Building2, ArrowRight, Calendar, Check } from 'lucide-react';

interface SponsorSectionProps {
  cityName: string;
}

export default function SponsorSection({ cityName }: SponsorSectionProps) {
  return (
    <div style={{ background: 'white', padding: '3rem 1rem', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#9ca3af',
          marginBottom: '1.5rem',
          fontWeight: '600',
          textAlign: 'left'
        }}>
          This Week's Calendar is Brought to You By
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: '1', minWidth: '300px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #2c5282 0%, #2b6cb0 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Building2 size={36} style={{ color: '#fbbf24' }} strokeWidth={2} />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '0.25rem',
                lineHeight: '1.2'
              }}>
                Alamo Business Bank
              </h3>
              <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '0.75rem' }}>
                {cityName}'s Small Business Banking Partner
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: '#2c5282'
                }}>
                  <Check size={16} style={{ color: '#2c5282' }} strokeWidth={2.5} />
                  SBA Preferred Lender
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: '#2c5282'
                }}>
                  <Check size={16} style={{ color: '#2c5282' }} strokeWidth={2.5} />
                  Local Decisions
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: '#2c5282'
                }}>
                  <Check size={16} style={{ color: '#2c5282' }} strokeWidth={2.5} />
                  No-Fee Business Checking
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#f7fafc',
            borderLeft: '3px solid #2c5282',
            padding: '1rem 1.25rem',
            borderRadius: '6px',
            flex: '1',
            minWidth: '300px'
          }}>
            <p style={{ color: '#2d3748', lineHeight: '1.6', fontSize: '0.9rem', margin: 0 }}>
              Alamo Business Bank has supported {cityName} entrepreneurs for over 35 years. As a local SBA-preferred lender, they make lending decisions right here in {cityName} — not in a call center.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#2c5282',
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background 0.2s',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#2b6cb0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#2c5282'}
            >
              Open a Business Account
              <ArrowRight size={16} />
            </a>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'white',
                color: '#2c5282',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                fontWeight: '600',
                border: '2px solid #2c5282',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#2c5282';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#2c5282';
              }}
            >
              Schedule a Free Consultation
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
