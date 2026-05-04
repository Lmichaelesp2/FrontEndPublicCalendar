'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { User, Mail, Calendar, MapPin, LogOut } from 'lucide-react';

export function AccountPage() {
  const { user, profile, preferences, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !profile) {
    return (
      <>
        <Navigation />
        <div className="acct-loading">Loading your account…</div>
        <Footer />
      </>
    );
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  // Group preferences by city
  const byCityMap: Record<string, string[]> = {};
  preferences.forEach(p => {
    const city = p.city || 'All Cities';
    if (!byCityMap[city]) byCityMap[city] = [];
    byCityMap[city].push(p.category);
  });
  const byCity = Object.entries(byCityMap);

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <>
      <Navigation />
      <main className="acct-page">
        <div className="acct-container">

          {/* Header */}
          <div className="acct-header">
            <div className="acct-avatar">
              <User size={28} />
            </div>
            <div>
              <h1 className="acct-name">Hi, {profile.first_name || 'Member'}</h1>
              <p className="acct-since">Member since {memberSince}</p>
            </div>
          </div>

          {/* Info cards */}
          <div className="acct-cards">

            <div className="acct-card">
              <div className="acct-card-label">
                <Mail size={14} />
                Email Address
              </div>
              <div className="acct-card-value">{profile.email}</div>
            </div>

            <div className="acct-card">
              <div className="acct-card-label">
                <Calendar size={14} />
                Membership
              </div>
              <div className="acct-card-value acct-tier">
                {profile.subscription_tier === 'free' ? 'Free Member' : profile.subscription_tier}
              </div>
            </div>

          </div>

          {/* Subscriptions */}
          <div className="acct-section">
            <h2 className="acct-section-title">
              <MapPin size={16} />
              Your Calendar Subscriptions
            </h2>

            {byCity.length === 0 ? (
              <div className="acct-empty">
                You haven't subscribed to any calendars yet.{' '}
                <a href="/subscribe" className="acct-link">Browse calendars →</a>
              </div>
            ) : (
              <div className="acct-subs">
                {byCity.map(([city, cats]) => (
                  <div key={city} className="acct-sub-row">
                    <div className="acct-sub-city">{city}</div>
                    <div className="acct-sub-cats">
                      {cats.map(cat => (
                        <span key={cat} className="acct-sub-tag">{cat}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sign out */}
          <button className="acct-signout" onClick={handleSignOut}>
            <LogOut size={15} />
            Sign Out
          </button>

        </div>
      </main>
      <Footer />
    </>
  );
}
