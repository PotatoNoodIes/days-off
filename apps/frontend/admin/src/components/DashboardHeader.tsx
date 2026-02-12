import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@time-sync/ui';
import { createStyles } from '../styles/components/DashboardHeader.styles';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface DashboardHeaderProps {
  onMenuPress: () => void;
}

export const DashboardHeader = ({ onMenuPress }: DashboardHeaderProps) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
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
      
      <Text style={styles.dateText}>
        {formattedDate}
      </Text>
    </View>
  );
};


