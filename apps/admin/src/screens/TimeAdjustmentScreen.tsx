import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, adminApi, Button } from '@time-sync/ui';
import { styles as globalStyles } from '../../styles/AppStyles';

export const TimeAdjustmentScreen = ({ route, navigation }: any) => {
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
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={Colors.primary[500]} />
          </TouchableOpacity>
          <Text style={Typography.heading1}>Adjust Time</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
        <View style={styles.infoCard}>
          <Ionicons name="person-circle-outline" size={40} color={Colors.primary[500]} />
          <View style={{ marginLeft: Spacing.md }}>
            <Text style={Typography.bodyLarge}>Adjusting time for:</Text>
            <Text style={[Typography.heading3, { color: Colors.primary[500] }]}>{employeeName}</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Clock-In Time (ISO or YYYY-MM-DD HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={clockIn}
            onChangeText={setClockIn}
            placeholder="e.g., 2026-01-05 09:00"
            placeholderTextColor={Colors.neutral.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Clock-Out Time (Optional)</Text>
          <TextInput
            style={styles.input}
            value={clockOut}
            onChangeText={setClockOut}
            placeholder="e.g., 2026-01-05 17:00"
            placeholderTextColor={Colors.neutral.textSecondary}
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
            <Text style={{ color: Colors.neutral.textSecondary }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.neutral.textSecondary} />
          <Text style={styles.noticeText}>
            This action will create a new entry or update the most recent one to match these timestamps. Total hours will be recalculated automatically.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
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
    color: Colors.neutral.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.neutral.surface,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.neutral.textPrimary,
  },
  noticeCard: {
    flexDirection: 'row',
    marginTop: Spacing.xxl,
    padding: Spacing.md,
    backgroundColor: Colors.neutral.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    gap: 8,
  },
  noticeText: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    flex: 1,
  }
});
