import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@time-sync/ui';
import { createStyles } from '../styles/screens/CalendarScreen.styles';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';

export const CalendarScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>
      <View style={styles.content}>
        <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
        <Text style={styles.emptyText}>
            Calendar view coming soon.
        </Text>
      </View>
    </View>
  );
};


