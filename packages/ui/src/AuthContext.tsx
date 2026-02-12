import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authApi, setAuthToken } from '@time-sync/api';
import { supabase } from './supabase';
import { Session, AuthError } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from './ThemeContext';
import { createStyles } from './styles/AuthContext.styles';
import { useMemo } from 'react';

WebBrowser.maybeCompleteAuthSession();

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
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
  signInWithPassword: (email: string, pass: string) => Promise<AuthError | null>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to parse tokens
const parseSessionFromUrl = async (url: string) => {
  try {
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) return null;

    const hash = url.substring(hashIndex + 1);
    const params = new URLSearchParams(hash);

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        return null;
      }
      return data.session;
    }
  } catch (e) {
    console.log("Parse Error", JSON.stringify(e));
  }
  return null;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);

  const refreshProfile = useCallback(async () => {
    try {
      const resp = await authApi.getProfile();
      setUser(resp.data);
    } catch (error: any) {
      console.error('Failed to refresh profile:', error);
      setUser(null);
    }
  }, []);

  const handleSession = useCallback(async (session: Session | null) => {
    setLoading(true);
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

    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      
      if (url && (url.includes('auth/callback') || url.includes('#'))) {
        
        const session = await parseSessionFromUrl(url);
        
        if (session && mounted) {
          await handleSession(session);
        }
      }
    };

    const initAuth = async () => {
      await handleDeepLink();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session) {
        await handleSession(session);
      } else if (mounted) {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Event:', event);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setAuthToken(null);
        setUser(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session) {
          await handleSession(session);
        }
        else {
          setLoading(false);
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
        const session = await parseSessionFromUrl(result.url);
        if (session) {
           await handleSession(session);
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
      if (error) return error;
      if (data.session) {
        await handleSession(data.session);
      }
      return null;
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
        logout,
        refreshProfile,
      }}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        children
      )}
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