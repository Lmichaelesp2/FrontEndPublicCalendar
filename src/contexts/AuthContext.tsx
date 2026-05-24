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
  userFilters: UserFilter[];
  showQuestionnaire: boolean;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string) => Promise<{ error: Error | null; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
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
  const [preferences, setPrefs]       = useState<UserPreference[]>([]);
  const [userFilters, setUserFilters] = useState<UserFilter[]>([]);
  const [loading, setLoading]         = useState(true);

  // showQuestionnaire: premium user who hasn't saved a network profile yet
  const isPremium = profile?.subscription_tier === 'premium';
  const showQuestionnaire = !loading && isPremium && userFilters.length === 0;

  // ── Load profile + preferences + user_filters
  async function loadUserData(userId: string) {
    const [{ data: profileData }, { data: filtersData }] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', userId).single(),
      supabase.from('user_filters').select('*').eq('user_id', userId),
    ]);
    if (profileData) setProfile(profileData);
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
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setProfile(null);
          setPrefs([]);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── signUp — now accepts firstName
  async function signUp(email: string, password: string, firstName: string) {
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
      }

      return { error: null, data };
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
      user, session, profile, preferences, userFilters, showQuestionnaire, loading,
      signUp, signIn, signOut, updatePreferences, saveNetworkProfile, refreshProfile,
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
