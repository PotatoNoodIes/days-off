import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, adminApi, Button, useTheme } from '@time-sync/ui';

export const TimeAdjustmentScreen = ({ route, navigation }: any) => {
  const { colors, isDark } = useTheme();
  const { employeeId, employeeName } = route.params;
  const [loading, setLoading] = useState(false);
  const [clockIn, setClockIn] = useState('');
  const [clockOut, setClockOut] = useState('');

  const handleSave = async () => {
    if (!clockIn) {
      Alert.alert('Validation Error', 'Clock-in time is required.');
      return;
    }

    try {
      setLoading(true);
      await adminApi.createTimeEntry({
        userId: employeeId,
        clockIn: new Date(clockIn).toISOString(),
        clockOut: clockOut ? new Date(clockOut).toISOString() : null,
      });
      Alert.alert('Success', 'Time entry adjusted successfully');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to adjust time entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={colors.primary[500]} />
          </TouchableOpacity>
          <Text style={[Typography.heading1, { color: colors.textPrimary }]}>Adjust Time</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
        <View style={[styles.infoCard, { backgroundColor: colors.primary[100] }]}>
          <Ionicons name="person-circle-outline" size={40} color={colors.primary[500]} />
          <View style={{ marginLeft: Spacing.md }}>
            <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>Adjusting time for:</Text>
            <Text style={[Typography.heading3, { color: colors.primary[500] }]}>{employeeName}</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Clock-In Time (ISO or YYYY-MM-DD HH:MM)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              color: colors.textPrimary 
            }]}
            value={clockIn}
            onChangeText={setClockIn}
            placeholder="e.g., 2026-01-05 09:00"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Clock-Out Time (Optional)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              color: colors.textPrimary 
            }]}
            value={clockOut}
            onChangeText={setClockOut}
            placeholder="e.g., 2026-01-05 17:00"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={{ marginTop: Spacing.xl }}>
          <Button 
            title="Update Entry" 
            onPress={handleSave} 
            loading={loading}
          />
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={{ marginTop: Spacing.md, alignItems: 'center' }}
          >
            <Text style={{ color: colors.textSecondary }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.noticeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
            This action will create a new entry or update the most recent one to match these timestamps. Total hours will be recalculated automatically.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.caption,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
  },
  noticeCard: {
    flexDirection: 'row',
    marginTop: Spacing.xxl,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  noticeText: {
    ...Typography.caption,
    flex: 1,
  }
});
