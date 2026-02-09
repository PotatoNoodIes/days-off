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
import DateTimePicker from '@react-native-community/datetimepicker';
import { differenceInDays, parseISO } from 'date-fns';
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    hasOverlap,
  } = useLeaveRequest(() => {
    navigation.goBack();
  });

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const totalDays = differenceInDays(endDate, startDate) + 1;

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
          <View style={{ 
            flexDirection: 'row', 
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 24,
            padding: 4,
            borderWidth: 1,
            borderColor: colors.border
          }}>
            {leaveTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => setLeaveType(type.value)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor:
                    leaveType === type.value ? colors.primary[500] : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ 
                  color: leaveType === type.value ? '#fff' : colors.textSecondary,
                  fontWeight: leaveType === type.value ? '700' : '500',
                  fontSize: 13
                }}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>



        {/* Date Selection */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={[Typography.bodyLarge, { fontWeight: '600', marginBottom: Spacing.sm, color: colors.textPrimary }]}>
            Duration
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.caption, { marginBottom: 4, color: colors.textSecondary }]}>Start Date</Text>
              <TouchableOpacity 
                onPress={() => setShowStart(true)}
                style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
                <Text style={{ marginLeft: 8, color: colors.textPrimary }}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.caption, { marginBottom: 4, color: colors.textSecondary }]}>End Date</Text>
              <TouchableOpacity 
                onPress={() => setShowEnd(true)}
                style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
                <Text style={{ marginLeft: 8, color: colors.textPrimary }}>
                  {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {showStart && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, date) => {
                setShowStart(false);
                if (date) {
                  setStartDate(date);
                  if (date > endDate) {
                    setEndDate(date);
                  }
                }
              }}
            />
          )}

          {showEnd && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              minimumDate={startDate}
              onChange={(event, date) => {
                setShowEnd(false);
                if (date) setEndDate(date);
              }}
            />
          )}

          <View style={{ marginTop: Spacing.sm, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={{ marginLeft: 6, color: colors.textSecondary }}>
              Calculated period: <Text style={{ fontWeight: '700', color: colors.primary[500] }}>{totalDays} Days</Text>
            </Text>
          </View>

          {/* Date Overlap Warning */}
          {hasOverlap() && (
            <View style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', // Light red
              padding: Spacing.md, 
              borderRadius: 12, 
              marginTop: Spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(239, 68, 68, 0.2)'
            }}>
              <Ionicons name="warning" size={20} color={colors.semantic.error} />
              <Text style={{ 
                color: colors.semantic.error, 
                marginLeft: 8, 
                fontSize: 13, 
                fontWeight: '600',
                flex: 1 
              }}>
                This range overlaps with an existing request.
              </Text>
            </View>
          )}
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
              height: 100,
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  }
});
