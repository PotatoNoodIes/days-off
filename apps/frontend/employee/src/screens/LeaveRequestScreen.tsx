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
import DateTimePicker from '@react-native-community/datetimepicker';
import { differenceInDays, parseISO } from 'date-fns';
import { useAuth, useTheme } from '@time-sync/ui';
import { createStyles } from '../styles/screens/LeaveRequestScreen.styles';
import { useMemo } from 'react';
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
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
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
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.primary[500]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Leave</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Leave Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Leave Type
          </Text>
          <View style={styles.typeSelector}>
            {leaveTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => setLeaveType(type.value)}
                style={[
                  styles.typeOption,
                  leaveType === type.value ? styles.typeOptionActive : styles.typeOptionInactive
                ]}
              >
                <Text style={[
                  styles.typeText,
                  leaveType === type.value ? styles.typeTextActive : styles.typeTextInactive
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>



        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Duration
          </Text>
          <View style={styles.durationRow}>
            <View style={styles.durationColumn}>
              <Text style={styles.caption}>Start Date</Text>
              <TouchableOpacity 
                onPress={() => setShowStart(true)}
                style={styles.dateButton}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.dateButtonText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.durationColumn}>
              <Text style={styles.caption}>End Date</Text>
              <TouchableOpacity 
                onPress={() => setShowEnd(true)}
                style={styles.dateButton}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.dateButtonText}>
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

          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.summaryText}>
              Calculated period: <Text style={styles.summaryDays}>{totalDays} Days</Text>
            </Text>
          </View>

          {/* Date Overlap Warning */}
          {hasOverlap() && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning" size={20} color={colors.semantic.error} />
              <Text style={styles.warningText}>
                This range overlaps with an existing request.
              </Text>
            </View>
          )}
        </View>

        {/* Reason Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Reason
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            placeholder="Please provide a brief reason for your leave request..."
            placeholderTextColor={colors.textSecondary}
            style={styles.reasonInput}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled,
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


