import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authApi, setAuthToken } from '@time-sync/api';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// WebBrowser needs this to handle the redirect
WebBrowser.maybeCompleteAuthSession();

// User interface matching backend User entity
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  firstName: string;
  lastName: string;
  orgId: string;
  leaveBalance: number;
  startDate?: string;
  endDate?: string;
  department?: string;
  ptoDays?: number;
  timeOffHours?: number;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, metadata: { first_name: string, last_name: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const resp = await authApi.getProfile();
      setUser(resp.data);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const handleSession = useCallback(async (session: Session | null) => {
    if (session) {
      setAuthToken(session.access_token);
      await refreshProfile();
    } else {
      setAuthToken(null);
      setUser(null);
    }
    setLoading(false);
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        await handleSession(session);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Event:', event);
      if (mounted) {
        if (event === 'SIGNED_OUT') {
          setAuthToken(null);
          setUser(null);
          setLoading(false);
        } else if (session) {
          await handleSession(session);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const signInWithGoogle = async () => {
    const redirectUrl = Linking.createURL('auth/callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success' && result.url) {
        const hashIndex = result.url.indexOf('#');
        if (hashIndex !== -1) {
          const hash = result.url.substring(hashIndex + 1);
          const params = new URLSearchParams(hash);

          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
          }
        }
      }
    }
  };

  const signInWithPassword = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
      if (data.session) {
        await handleSession(data.session);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, metadata: { first_name: string, last_name: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: metadata
        }
      });
      if (error) throw error;
      if (data.session) {
        await handleSession(data.session);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signInWithGoogle,
        signInWithPassword,
        signUp,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
