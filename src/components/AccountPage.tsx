'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { User, Mail, Calendar, MapPin, LogOut, X, Plus } from 'lucide-react';

const CITY_TO_SLUG: Record<string, string> = {
  'Austin':      'austin',
  'Dallas':      'dallas',
  'Houston':     'houston',
  'San Antonio': 'san-antonio',
};

const CAT_TO_SLUG: Record<string, string> = {
  'Networking':     'networking',
  'Technology':     'technology',
  'Real Estate':    'real-estate',
  'Chamber':        'chamber',
  'Small Business': 'small-business',
};

export function AccountPage() {
  const { user, profile, preferences, signOut, updatePreferences, loading } = useAuth();
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/');
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
  const byCityMap: Record<string, { category: string; prefId: string }[]> = {};
  preferences.forEach(p => {
    const city = p.city || 'All Cities';
    if (!byCityMap[city]) byCityMap[city] = [];
    byCityMap[city].push({ category: p.category, prefId: p.id });
  });
  const byCity = Object.entries(byCityMap);

  async function handleRemove(prefId: string) {
    setRemoving(prefId);
    const remaining = preferences.filter(p => p.id !== prefId);
    await updatePreferences(
      remaining.map(p => ({
        category:           p.category,
        city:               p.city,
        participation_type: p.participation_type,
        time_of_day:        p.time_of_day,
        cost_preference:    p.cost_preference,
      }))
    );
    setRemoving(null);
  }

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
              <div className="acct-card-label"><Mail size={14} />Email Address</div>
              <div className="acct-card-value">{profile.email}</div>
            </div>
            <div className="acct-card">
              <div className="acct-card-label"><Calendar size={14} />Membership</div>
              <div className="acct-card-value acct-tier">
                {profile.subscription_tier === 'free' ? 'Free Member' : profile.subscription_tier}
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="acct-section">
            <div className="acct-section-header">
              <h2 className="acct-section-title">
                <MapPin size={16} />
                Your Calendar Subscriptions
              </h2>
              <a href="/subscribe" className="acct-add-btn">
                <Plus size={13} />
                Add More
              </a>
            </div>

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
                      {cats.map(({ category, prefId }) => {
                        const citySlug = CITY_TO_SLUG[city];
                        const catSlug  = CAT_TO_SLUG[category];
                        return (
                          <div key={prefId} className="acct-sub-tag-wrap">
                            <span className="acct-sub-tag">{category}</span>
                            <button
                              className="acct-sub-remove"
                              onClick={() => handleRemove(prefId)}
                              disabled={removing === prefId}
                              title={`Remove ${category}`}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        );
                      })}
                      {/* Add another category in this city */}
                      {CITY_TO_SLUG[city] && (
                        <a
                          href={`/texas/${CITY_TO_SLUG[city]}/subscribe`}
                          className="acct-sub-add"
                          title={`Add a ${city} calendar`}
                        >
                          <Plus size={12} />
                        </a>
                      )}
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
