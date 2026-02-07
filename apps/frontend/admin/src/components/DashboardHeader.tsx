import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Typography, Spacing } from '@time-sync/ui';
import { Ionicons } from '@expo/vector-icons';

interface DashboardHeaderProps {
  onMenuPress: () => void;
}

export const DashboardHeader = ({ onMenuPress }: DashboardHeaderProps) => {
  const { colors } = useTheme();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={32} color={colors.textPrimary} />
      </TouchableOpacity>
      
      <Text style={[styles.dateText, { color: colors.textSecondary }]}>
        {formattedDate}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  menuButton: {
    // Increase hit slop for better touch target if needed
    padding: 4, 
    marginLeft: -4, // visual alignment
  },
  dateText: {
    ...Typography.bodyLarge,
    fontWeight: '500',
  }
});
