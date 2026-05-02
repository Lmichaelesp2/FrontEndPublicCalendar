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
      background: '#f0f5ff',
      borderTop: '1px solid #c7d9f5',
      borderBottom: '1px solid #c7d9f5',
      padding: '14px 24px',
    }}>
      <div style={{
        maxWidth: '780px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        flexWrap: 'wrap' as const,
      }}>
        <div style={{
          fontSize: '8px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: '#4a6fa5',
          whiteSpace: 'nowrap' as const,
          paddingRight: '16px',
          borderRight: '1px solid #c7d9f5',
          lineHeight: 1.4,
          flexShrink: 0,
          fontWeight: 700,
        }}>
          Sponsorship<br />Opportunity
        </div>

        <div style={{
          flex: 1,
          padding: '0 18px',
          fontSize: '13px',
          color: '#374151',
          lineHeight: 1.55,
          minWidth: '200px',
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
            borderRadius: '4px',
            padding: '7px 16px',
            textDecoration: 'none',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
            background: 'transparent',
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
    <div style={{
      padding: '20px 24px 8px',
      background: '#f8faff',
      borderTop: '1px solid #e5eaf5',
      borderBottom: '1px solid #e5eaf5',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        background: '#fff',
        border: '1px solid #c7d9f5',
        borderLeft: '4px solid #1a3a5c',
        borderRadius: '0 6px 6px 0',
        padding: '20px 24px',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        flexWrap: 'wrap' as const,
        boxShadow: '0 2px 8px rgba(26,58,92,0.07)',
      }}>
        {/* Left: copy */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#4a6fa5',
            fontWeight: 700,
            margin: '0 0 7px 0',
          }}>
            Sponsorship Opportunity
          </p>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#1a3a5c',
            lineHeight: 1.3,
            margin: '0 0 9px 0',
          }}>
            This calendar is currently seeking a founding sponsor.
          </h3>
          <p style={{
            fontSize: '12.5px',
            color: '#4b5563',
            lineHeight: 1.65,
            margin: '0 0 13px 0',
          }}>
            The {cityName} {category} Calendar reaches professionals who actively attend events in this space.
            Sponsoring gives your organization prominent placement on this page{' '}
            <strong style={{ color: '#1a3a5c' }}>and</strong> in the weekly {cityName} {category} email —
            a focused audience delivered to their inbox every week, at no cost to the reader.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
            <a
              href="/sponsorship"
              style={{ fontSize: '12px', fontWeight: 600, color: '#1a3a5c', textDecoration: 'none' }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              Inquire about sponsorship →
            </a>
            <span style={{ color: '#d1d5db' }}>|</span>
            <a
              href="/sponsorship"
              style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              About calendar sponsorships
            </a>
          </div>
        </div>

        {/* Right: logo placeholder + CTA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '10px',
          minWidth: '110px',
        }}>
          <div style={{
            width: '110px',
            height: '44px',
            background: '#f0f5ff',
            border: '1px dashed #c7d9f5',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color: '#a8c0e0',
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
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: '#fff',
              background: '#1a3a5c',
              borderRadius: '4px',
              padding: '8px 12px',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'center' as const,
              transition: 'background 0.15s',
              boxSizing: 'border-box' as const,
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#2c527a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#1a3a5c'; }}
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
// Texas hub page: section just above the footer
// ─────────────────────────────────────────────────────────────
export function SponsorInstitutional() {
  return (
    <div style={{
      background: '#f0f5ff',
      borderTop: '1px solid #c7d9f5',
      borderBottom: '1px solid #c7d9f5',
      padding: '36px 24px',
    }}>
      <div style={{
        maxWidth: '760px',
        margin: '0 auto',
        background: '#fff',
        border: '1px solid #c7d9f5',
        borderLeft: '4px solid #1a3a5c',
        borderRadius: '0 8px 8px 0',
        padding: '28px 32px',
        display: 'flex',
        gap: '32px',
        alignItems: 'flex-start',
        flexWrap: 'wrap' as const,
        boxShadow: '0 2px 12px rgba(26,58,92,0.08)',
      }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <p style={{
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#4a6fa5',
            fontWeight: 700,
            margin: '0 0 10px 0',
          }}>
            Sponsorship Opportunity
          </p>
          <h3 style={{
            fontSize: '17px',
            fontWeight: 700,
            color: '#1a3a5c',
            lineHeight: 1.3,
            margin: '0 0 10px 0',
          }}>
            Support the Texas business community — and be seen across every city.
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#4b5563',
            lineHeight: 1.7,
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
          minWidth: '130px',
        }}>
          <div style={{
            width: '130px',
            height: '52px',
            background: '#f0f5ff',
            border: '1px dashed #c7d9f5',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color: '#a8c0e0',
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
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: '#fff',
              background: '#1a3a5c',
              borderRadius: '4px',
              padding: '10px 16px',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'center' as const,
              transition: 'background 0.15s',
              boxSizing: 'border-box' as const,
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#2c527a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#1a3a5c'; }}
          >
            Become a Sponsor
          </a>
          <p style={{
            fontSize: '10px',
            color: '#9ca3af',
            textAlign: 'center' as const,
            lineHeight: 1.4,
            margin: 0,
          }}>
            Website placement +<br />all four city newsletters
          </p>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// SponsorCityCard — Variant D
// Main city pages: centered card matching sub-calendar style
// ─────────────────────────────────────────────────────────────
interface SponsorCityCardProps {
  cityName: string;
}

export function SponsorCityCard({ cityName }: SponsorCityCardProps) {
  return (
    <div style={{
      padding: '20px 24px 8px',
      background: '#f8faff',
      borderTop: '1px solid #e5eaf5',
      borderBottom: '1px solid #e5eaf5',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        background: '#fff',
        border: '1px solid #c7d9f5',
        borderLeft: '4px solid #1a3a5c',
        borderRadius: '0 6px 6px 0',
        padding: '20px 24px',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        flexWrap: 'wrap' as const,
        boxShadow: '0 2px 8px rgba(26,58,92,0.07)',
      }}>
        {/* Left: copy */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#4a6fa5',
            fontWeight: 700,
            margin: '0 0 7px 0',
          }}>
            Sponsorship Opportunity
          </p>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#1a3a5c',
            lineHeight: 1.3,
            margin: '0 0 9px 0',
          }}>
            This calendar is currently seeking a founding sponsor.
          </h3>
          <p style={{
            fontSize: '12.5px',
            color: '#4b5563',
            lineHeight: 1.65,
            margin: '0 0 13px 0',
          }}>
            The {cityName} Calendar reaches professionals who actively attend events in this space. Sponsoring gives your organization prominent placement on this page{' '}
            <strong style={{ color: '#1a3a5c' }}>and</strong> in the weekly {cityName} email —
            a focused audience delivered to their inbox every week, at no cost to the reader.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
            <a
              href="/sponsorship"
              style={{ fontSize: '12px', fontWeight: 600, color: '#1a3a5c', textDecoration: 'none' }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              Inquire about sponsorship →
            </a>
            <span style={{ color: '#d1d5db' }}>|</span>
            <a
              href="/sponsorship"
              style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              About calendar sponsorships
            </a>
          </div>
        </div>

        {/* Right: logo placeholder + CTA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '10px',
          minWidth: '110px',
        }}>
          <div style={{
            width: '110px',
            height: '44px',
            background: '#f0f5ff',
            border: '1px dashed #c7d9f5',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color: '#a8c0e0',
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
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: '#fff',
              background: '#1a3a5c',
              borderRadius: '4px',
              padding: '8px 12px',
              textDecoration: 'none',
              width: '100%',
              textAlign: 'center' as const,
              transition: 'background 0.15s',
              boxSizing: 'border-box' as const,
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#2c527a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#1a3a5c'; }}
          >
            Become a Sponsor
          </a>
        </div>
      </div>
    </div>
  );
}

// Default export kept for backward compatibility
export default function SponsorSection({ cityName }: { cityName: string }) {
  return <SponsorBanner cityName={cityName} />;
}
