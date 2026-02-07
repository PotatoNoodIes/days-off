import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Spacing, Typography } from './tokens';
import { useTheme } from './ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'google';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
}

import { Ionicons } from '@expo/vector-icons';

export const Button = ({ title, onPress, variant = 'primary', loading, disabled, icon, style }: ButtonProps) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    if (variant === 'secondary') return 'transparent';
    if (variant === 'ghost') return 'transparent';
    if (variant === 'google') return '#FFFFFF';
    return colors.primary[500];
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    if (variant === 'secondary') return colors.primary[500];
    if (variant === 'ghost') return colors.textSecondary;
    if (variant === 'google') return '#1f1f1f';
    return colors.surface;
  };

  const borderStyle: ViewStyle = variant === 'secondary' ? {
    borderWidth: 1,
    borderColor: colors.primary[500],
  } : variant === 'google' ? {
    borderWidth: 1,
    borderColor: '#747775',
  } : {};

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        borderStyle,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {(icon || variant === 'google') && (
            <Ionicons 
              name={(variant === 'google' ? 'logo-google' : icon) as any} 
              size={20} 
              color={variant === 'google' ? '#ea4335' : getTextColor()} 
              style={{ marginRight: 10 }} 
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12, // Pill or Rounded-lg
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
});
