import { StyleSheet, ViewStyle } from 'react-native';
import { Spacing, Typography } from '../tokens';

export const createStyles = (colors: any, isDark: boolean) => {
  const getBackgroundColor = (variant: string, disabled?: boolean) => {
    if (disabled) return colors.border;
    if (variant === 'secondary') return 'transparent';
    if (variant === 'ghost') return 'transparent';
    if (variant === 'google') return '#FFFFFF';
    return colors.primary[500];
  };

  const getTextColor = (variant: string, disabled?: boolean) => {
    if (disabled) return colors.textSecondary;
    if (variant === 'secondary') return colors.primary[500];
    if (variant === 'ghost') return colors.textSecondary;
    if (variant === 'google') return '#1f1f1f';
    return colors.surface;
  };

  const getBorderStyle = (variant: string): ViewStyle => {
    if (variant === 'secondary') {
      return {
        borderWidth: 1,
        borderColor: colors.primary[500],
      };
    }
    if (variant === 'google') {
      return {
        borderWidth: 1,
        borderColor: '#747775',
      };
    }
    return {};
  };

  const getGoogleIconColor = (variant: string) => {
    return variant === 'google' ? '#ea4335' : undefined;
  };

  return StyleSheet.create({
    button: {
      paddingVertical: 12,
      paddingHorizontal: Spacing.lg,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    primary: {
      backgroundColor: getBackgroundColor('primary'),
    },
    secondary: {
      backgroundColor: getBackgroundColor('secondary'),
      ...getBorderStyle('secondary'),
    },
    ghost: {
      backgroundColor: getBackgroundColor('ghost'),
    },
    google: {
      backgroundColor: getBackgroundColor('google'),
      ...getBorderStyle('google'),
    },
    disabled: {
      backgroundColor: getBackgroundColor('primary', true),
    },
    text: {
      ...Typography.bodyMedium,
      fontWeight: '600',
    },
    textPrimary: {
      color: getTextColor('primary'),
    },
    textSecondary: {
      color: getTextColor('secondary'),
    },
    textGhost: {
      color: getTextColor('ghost'),
    },
    textGoogle: {
      color: getTextColor('google'),
    },
    textDisabled: {
      color: getTextColor('primary', true),
    },
    icon: {
      marginRight: 10,
    },
    // Adding separate keys for cleaner mapping
    buttonPrimary: { backgroundColor: getBackgroundColor('primary') },
    buttonSecondary: { 
      backgroundColor: getBackgroundColor('secondary'),
      borderWidth: 1,
      borderColor: colors.primary[500],
    },
    buttonGhost: { backgroundColor: getBackgroundColor('ghost') },
    buttonGoogle: { 
      backgroundColor: getBackgroundColor('google'),
      borderWidth: 1,
      borderColor: '#747775',
    },
    buttonDisabled: { backgroundColor: getBackgroundColor('primary', true) },
  });
};
