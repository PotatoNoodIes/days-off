import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from './tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = ({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled) return Colors.neutral.border;
    if (variant === 'secondary') return 'transparent';
    if (variant === 'ghost') return 'transparent';
    return Colors.primary[500];
  };

  const getTextColor = () => {
    if (disabled) return Colors.neutral.textSecondary;
    if (variant === 'secondary') return Colors.primary[500];
    if (variant === 'ghost') return Colors.neutral.textSecondary;
    return Colors.neutral.surface;
  };

  const borderStyle: ViewStyle = variant === 'secondary' ? {
    borderWidth: 1,
    borderColor: Colors.primary[500],
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
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
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
