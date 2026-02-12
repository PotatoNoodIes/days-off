import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Spacing, Typography } from './tokens';
import { useTheme } from './ThemeContext';
import { createStyles } from './styles/Button.styles';
import { useMemo } from 'react';

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
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);

  const getVariantStyle = () => {
    if (disabled) return styles.buttonDisabled;
    if (variant === 'secondary') return styles.buttonSecondary;
    if (variant === 'ghost') return styles.buttonGhost;
    if (variant === 'google') return styles.buttonGoogle;
    return styles.buttonPrimary;
  };

  const getTextStyle = () => {
    if (disabled) return styles.textDisabled;
    if (variant === 'secondary') return styles.textSecondary;
    if (variant === 'ghost') return styles.textGhost;
    if (variant === 'google') return styles.textGoogle;
    return styles.textPrimary;
  };

  const textColor = (getTextStyle() as any).color;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {(icon || variant === 'google') && (
            <Ionicons 
              name={(variant === 'google' ? 'logo-google' : icon) as any} 
              size={20} 
              color={variant === 'google' ? '#ea4335' : textColor} 
              style={styles.icon} 
            />
          )}
          <Text style={[styles.text, getTextStyle()]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

