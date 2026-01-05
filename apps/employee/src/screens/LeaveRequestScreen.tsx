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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, Colors, Typography, Spacing } from '@time-sync/ui';
import { styles } from '../../styles/AppStyles';
import { useLeaveRequest } from '../../hooks/useLeaveRequest';

type LeaveType = 'VACATION' | 'SICK' | 'UNPAID';

const leaveTypes: { label: string; value: LeaveType }[] = [
  { label: 'Vacation', value: 'VACATION' },
  { label: 'Sick Leave', value: 'SICK' },
  { label: 'Unpaid Leave', value: 'UNPAID' },
];

export const LeaveRequestScreen = ({ navigation }: any) => {
  const { user } = useAuth();
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
      style={[styles.container, { paddingTop: 60 }]}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
          <Ionicons name="arrow-back" size={28} color={Colors.primary[500]} />
        </TouchableOpacity>
        <Text style={Typography.heading1}>Request Leave</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Leave Type Selection */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={[Typography.bodyLarge, { fontWeight: '600', marginBottom: Spacing.sm }]}>
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
                    leaveType === type.value ? Colors.primary[500] : Colors.neutral.surface,
                  borderWidth: 1,
                  borderColor:
                    leaveType === type.value ? Colors.primary[500] : Colors.neutral.border,
                }}
              >
                <Text style={{ color: leaveType === type.value ? '#fff' : Colors.neutral.textSecondary }}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reason Input */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={[Typography.bodyLarge, { fontWeight: '600', marginBottom: Spacing.sm }]}>
            Reason
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            placeholder="Please provide a brief reason for your leave request..."
            style={{
              backgroundColor: Colors.neutral.surface,
              borderRadius: 12,
              padding: Spacing.md,
              height: 120,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: Colors.neutral.border,
            }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[
            styles.clockButton,
            { backgroundColor: Colors.primary[500] },
            loading && { opacity: 0.7 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.clockButtonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
