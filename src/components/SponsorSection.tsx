'use client';

// ─────────────────────────────────────────────────────────────
// SponsorBanner — Variant A
// City calendar pages: slim bar below hero, above event list
// ─────────────────────────────────────────────────────────────
interface SponsorBannerProps {
  cityName: string;
}

export function SponsorBanner({ cityName }: SponsorBannerProps) {
  return (
    <div style={{
      background: '#fff',
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      flexWrap: 'wrap',
    }}>
      <div style={{
        fontSize: '8px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase' as const,
        color: '#9ca3af',
        whiteSpace: 'nowrap' as const,
        paddingRight: '16px',
        borderRight: '1px solid #e5e7eb',
        lineHeight: 1.4,
        flexShrink: 0,
      }}>
        Sponsorship<br />Opportunity
      </div>

      <div style={{
        flex: 1,
        padding: '0 18px',
        fontSize: '13px',
        color: '#6b7280',
        lineHeight: 1.55,
        minWidth: '220px',
      }}>
        This calendar has an open founding sponsorship. Reach thousands of {cityName} professionals —
        entrepreneurs, executives, and community leaders — every week at no cost to readers.
      </div>

      <a
        href="/sponsorship"
        style={{
          display: 'inline-block',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: '#1a3a5c',
          border: '1.5px solid #1a3a5c',
          padding: '7px 14px',
          textDecoration: 'none',
          whiteSpace: 'nowrap' as const,
          flexShrink: 0,
          transition: 'all 0.15s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#1a3a5c';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#1a3a5c';
        }}
      >
        Inquire Now
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SponsorCard — Variant B
// Sub-calendar pages: editorial card between hero and events
// ─────────────────────────────────────────────────────────────
interface SponsorCardProps {
  cityName: string;
  category: string;
}

export function SponsorCard({ cityName, category }: SponsorCardProps) {
  return (
    <div style={{ padding: '18px 28px 4px' }}>
      <div style={{
        background: '#fafafa',
        border: '1px solid #e5e7eb',
        borderLeft: '3px solid #1a3a5c',
        padding: '20px 22px',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        flexWrap: 'wrap' as const,
      }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <p style={{
            fontSize: '8px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: '#9ca3af',
            marginBottom: '8px',
            margin: '0 0 8px 0',
          }}>
            Sponsorship Opportunity
          </p>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#6b7280',
            marginBottom: '8px',
            lineHeight: 1.3,
            margin: '0 0 8px 0',
          }}>
            This calendar is currently seeking a founding sponsor.
          </h3>
          <p style={{
            fontSize: '12.5px',
            color: '#6b7280',
            lineHeight: 1.65,
            marginBottom: '12px',
            margin: '0 0 12px 0',
          }}>
            The {cityName} {category} Calendar reaches professionals who actively attend events in this space.
            Sponsoring gives your organization prominent placement on this page{' '}
            <strong style={{ color: '#4b5563' }}>and</strong> in the weekly {cityName} {category} email —
            a focused, niche audience delivered directly to their inbox, at no cost to the reader.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
            <a
              href="/sponsorship"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#1a3a5c',
                textDecoration: 'none',
                letterSpacing: '0.03em',
              }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              Inquire about sponsorship →
            </a>
            <span style={{ color: '#d1d5db', fontSize: '13px' }}>|</span>
            <a
              href="/sponsorship"
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                textDecoration: 'none',
              }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              About calendar sponsorships
            </a>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '12px',
          minWidth: '110px',
        }}>
          <div style={{
            width: '110px',
            height: '46px',
            background: '#fff',
            border: '1px dashed #d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color: '#d1d5db',
            fontStyle: 'italic',
          }}>
            Your Logo
          </div>
          <a
            href="/sponsorship"
            style={{
              display: 'inline-block',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#fff',
              background: '#9ca3af',
              padding: '8px 12px',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'center' as const,
              transition: 'background 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#1a3a5c'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#9ca3af'; }}
          >
            Become a Sponsor
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SponsorInstitutional — Variant C
// Texas hub page: full-width section just above the footer
// ─────────────────────────────────────────────────────────────
export function SponsorInstitutional() {
  return (
    <div style={{
      background: '#f7f7f6',
      border: '1px dashed #d1d5db',
      padding: '32px 40px',
      display: 'flex',
      gap: '28px',
      alignItems: 'flex-start',
      flexWrap: 'wrap' as const,
    }}>
      <div style={{ flex: 1, minWidth: '260px' }}>
        <p style={{
          fontSize: '8px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: '#bbb',
          marginBottom: '10px',
          margin: '0 0 10px 0',
        }}>
          Sponsorship Opportunity
        </p>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#6b7280',
          lineHeight: 1.3,
          marginBottom: '10px',
          margin: '0 0 10px 0',
        }}>
          Support the Texas business community — and be seen across every city.
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#9ca3af',
          lineHeight: 1.7,
          maxWidth: '460px',
          margin: 0,
        }}>
          Local Business Calendars is a free resource connecting professionals across San Antonio, Austin,
          Dallas, and Houston with the events that grow businesses and careers — no paywalls, no subscriptions,
          no barriers. We rely on respected organizations to support that mission. If your company operates
          across Texas and wants to be seen by thousands of active professionals every week,{' '}
          <a
            href="/sponsorship"
            style={{ color: '#1a3a5c', textDecoration: 'none', fontWeight: 600 }}
            onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            a founding Texas sponsorship is available
          </a>.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '12px',
        minWidth: '140px',
      }}>
        <div style={{
          width: '140px',
          height: '54px',
          background: '#fff',
          border: '1px dashed #d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '9px',
          color: '#ccc',
          fontStyle: 'italic',
        }}>
          Your Logo
        </div>
        <a
          href="/sponsorship"
          style={{
            display: 'inline-block',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: '#fff',
            background: '#9ca3af',
            padding: '10px 16px',
            textDecoration: 'none',
            width: '100%',
            textAlign: 'center' as const,
            transition: 'background 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1a3a5c'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#9ca3af'; }}
        >
          Become a Sponsor
        </a>
        <p style={{
          fontSize: '10px',
          color: '#bbb',
          textAlign: 'center' as const,
          lineHeight: 1.4,
          margin: 0,
        }}>
          Placement on Texas hub<br />+ all four city newsletters
        </p>
      </div>
    </div>
  );
}

// Default export kept for backward compatibility
export default function SponsorSection({ cityName }: { cityName: string }) {
  return <SponsorBanner cityName={cityName} />;
}
