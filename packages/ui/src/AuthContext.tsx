import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi, setAuthToken } from '@time-sync/api';

// User interface matching backend User entity
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  firstName: string;
  lastName: string;
  orgId: string;
  leaveBalance: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_KEY);

      if (token && userData) {
        setAuthToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const { accessToken, user: loggedUser } = response.data;

      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(loggedUser));

      setAuthToken(accessToken);
      setUser(loggedUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
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
        login,
        logout,
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
