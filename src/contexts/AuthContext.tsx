'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

interface UserPreference {
  id: string;
  user_id: string;
  category: string;
  city?: string;
  participation_type?: string;
  time_of_day?: string;
  cost_preference?: string;
}

export interface NewsletterSubscription {
  id: number;
  email: string;
  city: string;
  sub_calendar: string | null;
  status: string;
  first_name: string | null;
  source: string | null;
}

// filter_view shape saved by the questionnaire
export interface NetworkProfile {
  categories: string[];
  city: string;
  timeOfDay: string[];
  participation: string;
}

interface UserFilter {
  id: number;
  user_id: string;
  name: string;
  filter_view: NetworkProfile;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  preferences: UserPreference[];
  newsletterSubs: NewsletterSubscription[];
  userFilters: UserFilter[];
  showQuestionnaire: boolean;
  showWelcomeModal: boolean;
  loading: boolean;
  completeWelcome: (firstName: string) => void;
  signUp: (email: string, password: string, firstName: string, cityName?: string) => Promise<{ error: Error | null; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  sendMagicLink: (email: string) => Promise<{ error: Error | null }>;
  removeNewsletterSub: (subId: number) => Promise<void>;
  addNewsletterSub: (city: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePreferences: (prefs: Omit<UserPreference, 'id' | 'user_id'>[]) => Promise<void>;
  saveNetworkProfile: (profile: NetworkProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [session, setSession]         = useState<Session | null>(null);
  const [profile, setProfile]         = useState<UserProfile | null>(null);
  const [preferences, setPrefs]           = useState<UserPreference[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<NewsletterSubscription[]>([]);
  const [userFilters, setUserFilters]     = useState<UserFilter[]>([]);
  const [loading, setLoading]         = useState(true);

  // showQuestionnaire: premium user who hasn't saved a network profile yet
  const isPremium = profile?.subscription_tier === 'premium';
  const showQuestionnaire = !loading && isPremium && userFilters.length === 0;

  // showWelcomeModal: free user who logged in but has no first_name yet (legacy user first login)
  const showWelcomeModal = !loading && !!user && !!profile && !isPremium && !profile.first_name;

  function completeWelcome(firstName: string) {
    if (profile) setProfile({ ...profile, first_name: firstName });
  }

  // ── Load profile + preferences + user_filters
  // On first login, auto-creates profile + preferences from newsletter_subscriptions
  async function loadUserData(userId: string) {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const email = authUser?.email;

    const [{ data: profileData }, { data: filtersData }] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', userId).single(),
      supabase.from('user_filters').select('*').eq('user_id', userId),
    ]);

    // Auto-create profile on first login if it doesn't exist
    if (!profileData && email) {
      await supabase.from('user_profiles').insert({
        id:                userId,
        email,
        first_name:        null,
        subscription_tier: 'free',
      });

      // Pull their city from newsletter_subscriptions
      const { data: subData } = await supabase
        .from('newsletter_subscriptions')
        .select('city')
        .eq('email', email)
        .eq('status', 'active')
        .in('city', ['San Antonio', 'Austin', 'Dallas', 'Houston'])
        .is('sub_calendar', null)
        .limit(1)
        .maybeSingle();

      if (subData?.city) {
        await supabase.from('user_preferences').insert({
          user_id:  userId,
          category: 'Networking',
          city:     subData.city,
        });
      }

      // Re-fetch the newly created profile
      const { data: newProfile } = await supabase
        .from('user_profiles').select('*').eq('id', userId).single();
      if (newProfile) setProfile(newProfile);
    } else {
      if (profileData) setProfile(profileData);
    }

    // Load preferences
    const { data: prefsData } = await supabase
      .from('user_preferences').select('*').eq('user_id', userId);
    if (prefsData) setPrefs(prefsData as UserPreference[]);

    // Load newsletter subscriptions (source of truth for what emails they get)
    const { data: { user: authUser2 } } = await supabase.auth.getUser();
    const userEmail = authUser2?.email;
    if (userEmail) {
      const { data: subsData } = await supabase
        .from('newsletter_subscriptions')
        .select('id, email, city, sub_calendar, status, first_name, source')
        .eq('email', userEmail)
        .eq('status', 'active')
        .order('city', { ascending: true });
      if (subsData) setNewsletterSubs(subsData as NewsletterSubscription[]);
    }

    if (filtersData) setUserFilters(filtersData as UserFilter[]);
  }

  // ── Session listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadUserData(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserData(session.user.id); // don't await — let loading resolve immediately
        } else {
          setProfile(null);
          setPrefs([]);
          setNewsletterSubs([]);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── signUp — accepts firstName and optional cityName for auto-subscription
  async function signUp(email: string, password: string, firstName: string, cityName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error as Error };

      if (data.user) {
        await supabase.from('user_profiles').insert({
          id:                data.user.id,
          email:             data.user.email!,
          first_name:        firstName.trim(),
          subscription_tier: 'free',
        });

        // Auto-subscribe to the city they signed up from
        if (cityName) {
          await supabase.from('user_preferences').insert({
            user_id:  data.user.id,
            category: 'Networking',
            city:     cityName,
          });
        }
      }

      return { error: null, data };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // ── removeNewsletterSub — marks a specific subscription as unsubscribed
  async function removeNewsletterSub(subId: number) {
    await supabase
      .from('newsletter_subscriptions')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('id', subId);
    // Refresh the list
    setNewsletterSubs(prev => prev.filter(s => s.id !== subId));
  }

  // ── addNewsletterSub — subscribe the signed-in user to a city newsletter
  // (city-wide, sub_calendar = null) directly from the account page.
  async function addNewsletterSub(city: string) {
    if (!user) return;
    const email = (profile?.email ?? user.email ?? '').trim().toLowerCase();
    if (!email) return;
    const { data } = await supabase
      .from('newsletter_subscriptions')
      .upsert({
        user_id:      user.id,
        email,
        first_name:   profile?.first_name ?? null,
        city,
        sub_calendar: null,
        status:       'active',
        source:       'account_page',
      }, { onConflict: 'email,city,sub_calendar' })
      .select()
      .single();
    if (data) {
      setNewsletterSubs(prev => {
        const without = prev.filter(s => s.id !== (data as NewsletterSubscription).id);
        return [...without, data as NewsletterSubscription];
      });
    }
  }

  // ── sendMagicLink
  async function sendMagicLink(email: string) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/account` },
      });
      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // ── signIn
  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error as Error };
      return { error: null, data };
    } catch (err) {
      return { error: err as Error };
    }
  }

  // ── signOut
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setPrefs([]);
    setUserFilters([]);
  }

  // ── saveNetworkProfile — writes questionnaire answers to user_filters
  async function saveNetworkProfile(networkProfile: NetworkProfile) {
    if (!user) return;
    // Upsert: delete existing default profile then insert fresh
    await supabase.from('user_filters').delete().eq('user_id', user.id).eq('name', 'My Network Profile');
    await supabase.from('user_filters').insert({
      user_id: user.id,
      name: 'My Network Profile',
      filter_view: networkProfile,
    });
    await loadUserData(user.id);
  }

  // ── updatePreferences
  async function updatePreferences(prefs: Omit<UserPreference, 'id' | 'user_id'>[]) {
    if (!user) return;
    await supabase.from('user_preferences').delete().eq('user_id', user.id);
    if (prefs.length > 0) {
      await supabase.from('user_preferences').insert(
        prefs.map(p => ({ ...p, user_id: user.id }))
      );
    }
    await loadUserData(user.id);
  }

  // ── refreshProfile
  async function refreshProfile() {
    if (user) await loadUserData(user.id);
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, preferences, newsletterSubs, userFilters, showQuestionnaire, showWelcomeModal, loading,
      signUp, signIn, sendMagicLink, removeNewsletterSub, addNewsletterSub, signOut, updatePreferences, saveNetworkProfile, refreshProfile, completeWelcome,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
