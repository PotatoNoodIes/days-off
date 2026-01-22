import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Typography, Spacing } from '@time-sync/ui';
import { Ionicons } from '@expo/vector-icons';

export const AddEmployeeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.heading3, { color: colors.textPrimary }]}>Add Employee</Text>
      </View>
      <View style={styles.content}>
        <Ionicons name="person-add-outline" size={64} color={colors.textSecondary} />
        <Text style={[Typography.bodyMedium, { color: colors.textSecondary, marginTop: 16 }]}>
            Add Employee feature coming soon.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8, marginRight: 16 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
