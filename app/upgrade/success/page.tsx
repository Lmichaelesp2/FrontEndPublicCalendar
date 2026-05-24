'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Navigation } from '../../../src/components/Navigation';
import { Footer } from '../../../src/components/Footer';
import { useAuth } from '../../../src/contexts/AuthContext';

export default function UpgradeSuccess() {
  const { profile, refreshProfile } = useAuth();
  const [checking, setChecking] = useState(true);

  // Poll until subscription_tier flips to premium (webhook may take a moment)
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      await refreshProfile?.();
      attempts++;
      if (attempts >= 10) {
        setChecking(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [refreshProfile]);

  useEffect(() => {
    if (profile?.subscription_tier === 'premium') {
      setChecking(false);
    }
  }, [profile]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f7f4' }}>
      <Navigation />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{
          background: '#fff', borderRadius: '20px', padding: '48px 40px',
          maxWidth: '480px', width: '100%', textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        }}>
          <CheckCircle size={56} style={{ color: '#c2410c', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', margin: '0 0 12px' }}>
            Welcome to Premium!
          </h1>
          <p style={{ color: '#555', fontSize: '1rem', margin: '0 0 32px', lineHeight: 1.6 }}>
            Your account is now active. You have 30 days of events, personalized filters, and your custom weekly digest is on the way.
          </p>

          {checking && profile?.subscription_tier !== 'premium' ? (
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>
              Activating your account…
            </p>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/texas/san-antonio" style={{
              display: 'block', background: '#c2410c', color: '#fff',
              padding: '14px 24px', borderRadius: '10px', fontWeight: 700,
              fontSize: '15px', textDecoration: 'none',
            }}>
              Go to San Antonio Calendar
            </Link>
            <Link href="/texas/austin" style={{
              display: 'block', background: 'transparent', color: '#c2410c',
              padding: '12px 24px', borderRadius: '10px', fontWeight: 600,
              fontSize: '14px', textDecoration: 'none', border: '1px solid #c2410c',
            }}>
              Austin Calendar
            </Link>
            <Link href="/texas/dallas" style={{
              display: 'block', background: 'transparent', color: '#c2410c',
              padding: '12px 24px', borderRadius: '10px', fontWeight: 600,
              fontSize: '14px', textDecoration: 'none', border: '1px solid #c2410c',
            }}>
              Dallas Calendar
            </Link>
            <Link href="/texas/houston" style={{
              display: 'block', background: 'transparent', color: '#c2410c',
              padding: '12px 24px', borderRadius: '10px', fontWeight: 600,
              fontSize: '14px', textDecoration: 'none', border: '1px solid #c2410c',
            }}>
              Houston Calendar
            </Link>
          </div>
        </div>
      </main>
      <Footer variant="homepage" />
    </div>
  );
}
