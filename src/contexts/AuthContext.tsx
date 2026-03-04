import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  email: string;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
};

type UserPreference = {
  id: string;
  user_id: string;
  category: string;
  city: string | null;
  participation_type: string | null;
  time_of_day: string | null;
  cost_preference: string | null;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  preferences: UserPreference[];
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePreferences: (preferences: Omit<UserPreference, 'id' | 'user_id' | 'created_at'>[]) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setProfile(null);
          setPreferences([]);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserData(userId: string) {
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);

      setProfile(profileData);
      setPreferences(prefsData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          subscription_tier: 'free',
        });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setPreferences([]);
  }

  async function updatePreferences(newPreferences: Omit<UserPreference, 'id' | 'user_id' | 'created_at'>[]) {
    if (!user) return;

    try {
      await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user.id);

      const prefsToInsert = newPreferences.map(pref => ({
        user_id: user.id,
        ...pref,
      }));

      const { data } = await supabase
        .from('user_preferences')
        .insert(prefsToInsert)
        .select();

      setPreferences(data || []);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  async function refreshProfile() {
    if (user) {
      await loadUserData(user.id);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updatePreferences,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
