import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Colors } from './tokens';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  colors: typeof Colors.light & Pick<typeof Colors, 'primary' | 'secondary' | 'semantic'>;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark'); // Default to dark mode

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await SecureStore.getItemAsync(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setMode(savedTheme);
      } else {
        // First time load or no saved theme, default to dark
        setMode('dark');
        await SecureStore.setItemAsync(THEME_KEY, 'dark');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    await SecureStore.setItemAsync(THEME_KEY, newMode);
  };

  const colors = {
    ...(mode === 'light' ? Colors.light : Colors.dark),
    primary: Colors.primary,
    secondary: Colors.secondary,
    semantic: Colors.semantic,
  };

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
