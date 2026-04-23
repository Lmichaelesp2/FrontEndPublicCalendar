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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  preferences: UserPreference[];
  loading: boolean;
  signUp: (email: string, password: string, firstName: string) => Promise<{ error: Error | null; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signOut: () => Promise<void>;
  updatePreferences: (prefs: Omit<UserPreference, 'id' | 'user_id'>[]) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [session, setSession]     = useState<Session | null>(null);
  const [profile, setProfile]     = useState<UserProfile | null>(null);
  const [preferences, setPrefs]   = useState<UserPreference[]>([]);
  const [loading, setLoading]     = useState(true);

  // ── Load profile + preferences
  async function loadUserData(userId: string) {
    const [{ data: profileData }, { data: prefsData }] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', userId).single(),
      supabase.from('user_preferences').select('*').eq('user_id', userId),
    ]);
    if (profileData) setProfile(profileData);
    if (prefsData)   setPrefs(prefsData);
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
      user, session, profile, preferences, loading,
      signUp, signIn, signOut, updatePreferences, refreshProfile,
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
