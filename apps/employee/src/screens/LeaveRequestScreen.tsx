import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, Typography, Spacing, useTheme } from '@time-sync/ui';
import { useLeaveRequest } from '../../hooks/useLeaveRequest';

type LeaveType = 'VACATION' | 'SICK' | 'UNPAID';

const leaveTypes: { label: string; value: LeaveType }[] = [
  { label: 'Vacation', value: 'VACATION' },
  { label: 'Sick Leave', value: 'SICK' },
  { label: 'Unpaid Leave', value: 'UNPAID' },
];

export const LeaveRequestScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const {
    leaveType,
    setLeaveType,
    reason,
    setReason,
    loading,
    submitLeaveRequest,
  } = useLeaveRequest(() => {
    navigation.goBack();
  });

  const handleSubmit = () => {
    if (!leaveType) return;

    submitLeaveRequest();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
          <Ionicons name="arrow-back" size={28} color={colors.primary[500]} />
        </TouchableOpacity>
        <Text style={[Typography.heading1, { color: colors.textPrimary }]}>Request Leave</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Leave Type Selection */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={[Typography.bodyLarge, { fontWeight: '600', marginBottom: Spacing.sm, color: colors.textPrimary }]}>
            Leave Type
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {leaveTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => setLeaveType(type.value)}
                style={{
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.xs,
                  borderRadius: 20,
                  backgroundColor:
                    leaveType === type.value ? colors.primary[500] : colors.surface,
                  borderWidth: 1,
                  borderColor:
                    leaveType === type.value ? colors.primary[500] : colors.border,
                }}
              >
                <Text style={{ color: leaveType === type.value ? '#fff' : colors.textSecondary }}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reason Input */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={[Typography.bodyLarge, { fontWeight: '600', marginBottom: Spacing.sm, color: colors.textPrimary }]}>
            Reason
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            placeholder="Please provide a brief reason for your leave request..."
            placeholderTextColor={colors.textSecondary}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: Spacing.md,
              height: 120,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary[500] },
            loading && { opacity: 0.7 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    paddingTop: 60,
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  submitButtonText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: '#fff',
  },
});
