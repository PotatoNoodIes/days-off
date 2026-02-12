import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography, Spacing } from './tokens';
import { useTheme } from './ThemeContext';
import { createStyles } from './styles/Card.styles';
import { useMemo } from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card = ({ children, style }: CardProps) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

