import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Typography, Spacing } from '@time-sync/ui';

interface PendingSummaryProps {
  count: number;
}

export const PendingSummary = ({ count }: PendingSummaryProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        You have <Text style={{ color: colors.primary[500], fontWeight: '700' }}>{count}</Text> pending Day-Off Request{count !== 1 ? 's' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  text: {
    ...Typography.heading2, // Large and clear
  }
});
