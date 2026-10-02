import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  isSupabaseConfigured: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithGoogleAccount: (gmailAddress?: string, displayName?: string) => void;
  signInDemo: () => void;
  signOut: () => Promise<void>;
}

const DEMO_USER: User = {
  id: 'demo-user-id',
  app_metadata: { provider: 'demo' },
  user_metadata: { name: 'Demo Explorer' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@ritronix.ai',
};

const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: DEMO_USER,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const savedGoogle = localStorage.getItem('ritronix_google_session');
    if (savedGoogle) {
      try {
        return JSON.parse(savedGoogle);
      } catch {
        // ignore
      }
    }
    const savedDemo = localStorage.getItem('ritronix_demo_session');
    return savedDemo === 'true' ? DEMO_SESSION : null;
  });

  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(() => {
    return localStorage.getItem('ritronix_demo_session') === 'true';
  });

  useEffect(() => {
    const hasCustomSession = localStorage.getItem('ritronix_demo_session') || localStorage.getItem('ritronix_google_session');
    if (hasCustomSession) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('[Ritronix] Supabase getSession error:', err);
        setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const activeCustom = localStorage.getItem('ritronix_demo_session') || localStorage.getItem('ritronix_google_session');
      if (!activeCustom) {
        setSession(newSession);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [isDemo]);

  const signInDemo = () => {
    localStorage.removeItem('ritronix_google_session');
    localStorage.setItem('ritronix_demo_session', 'true');
    setIsDemo(true);
    setSession(DEMO_SESSION);
  };

  const signInWithGoogleAccount = (gmailAddress?: string, displayName?: string) => {
    const email = gmailAddress?.trim() || 'user@gmail.com';
    const name = displayName?.trim() || email.split('@')[0];
    const googleUser: User = {
      id: `google-${Date.now()}`,
      app_metadata: { provider: 'google' },
      user_metadata: {
        full_name: name,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        email: email,
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: email,
    };
    const googleSession: Session = {
      access_token: `google-token-${Date.now()}`,
      refresh_token: `google-refresh-${Date.now()}`,
      expires_in: 86400 * 7,
      token_type: 'bearer',
      user: googleUser,
    };

    localStorage.removeItem('ritronix_demo_session');
    localStorage.setItem('ritronix_google_session', JSON.stringify(googleSession));
    setIsDemo(false);
    setSession(googleSession);
  };

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    isDemo,
    isSupabaseConfigured,
    signUp: async (email, password) => {
      if (!isSupabaseConfigured) {
        return { error: 'Supabase credentials are not configured. Click "Continue with Google" or "Demo Mode" to test the workspace.' };
      }
      try {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'Sign up failed' };
      }
    },
    signIn: async (email, password) => {
      if (!isSupabaseConfigured) {
        return { error: 'Supabase credentials are not configured. Click "Continue with Google" or "Demo Mode" to test the workspace.' };
      }
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'Sign in failed' };
      }
    },
    signInWithGoogle: async () => {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
            },
          });
          if (error) return { error: error.message };
          return { error: null };
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'Google sign-in error' };
        }
      }
      return { error: 'Supabase is not configured for OAuth' };
    },
    signInWithGoogleAccount,
    signInDemo,
    signOut: async () => {
      localStorage.removeItem('ritronix_demo_session');
      localStorage.removeItem('ritronix_google_session');
      setIsDemo(false);
      setSession(null);
      if (isSupabaseConfigured) {
        try {
          await supabase.auth.signOut();
        } catch {
          // Ignore network errors on signout
        }
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
