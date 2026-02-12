import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { Spacing } from './tokens';
import { createStyles } from './styles/ThemeToggle.styles';
import { useMemo } from 'react';

interface ThemeToggleProps {
  style?: ViewStyle;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);

  return (
    <TouchableOpacity 
      onPress={toggleTheme} 
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={isDark ? "sunny" : "moon"} 
        size={20} 
        color={(styles.icon as any).color} 
      />
    </TouchableOpacity>
  );
};

