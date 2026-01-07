import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { Spacing } from './tokens';

interface ThemeToggleProps {
  style?: ViewStyle;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity 
      onPress={toggleTheme} 
      style={[
        styles.container, 
        { 
          backgroundColor: isDark ? colors.surface : colors.primary[100],
          borderColor: colors.border 
        }, 
        style
      ]}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={isDark ? "sunny" : "moon"} 
        size={20} 
        color={isDark ? "#FFD700" : colors.primary[500]} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
