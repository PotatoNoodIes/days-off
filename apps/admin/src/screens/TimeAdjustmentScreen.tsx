import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, adminApi, Button } from '@time-sync/ui';
import { styles as globalStyles } from '../../styles/AppStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export const TimeAdjustmentScreen = ({ route, navigation }: any) => {
  const { employeeId, employeeName } = route.params;
  const [loading, setLoading] = useState(false);
  const [clockIn, setClockIn] = useState(new Date());
  const [clockOut, setClockOut] = useState<Date | null>(null);

  const [showInPicker, setShowInPicker] = useState(false);
  const [showOutPicker, setShowOutPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  const handleSave = async () => {
    if (clockOut && clockOut <= clockIn) {
      Alert.alert('Validation Error', 'Clock-out time must be after clock-in time.');
      return;
    }

    try {
      setLoading(true);
      await adminApi.createTimeEntry({
        userId: employeeId,
        clockIn: clockIn.toISOString(),
        clockOut: clockOut ? clockOut.toISOString() : null,
      });
      Alert.alert('Success', 'Time entry adjusted successfully');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to adjust time entry');
    } finally {
      setLoading(false);
    }
  };

  const onInChange = (event: any, selectedDate?: Date) => {
    setShowInPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setClockIn(new Date(selectedDate.getTime()));
    }
  };

  const onOutChange = (event: any, selectedDate?: Date) => {
    setShowOutPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setClockOut(new Date(selectedDate.getTime()));
    }
  };

  const renderPickerTrigger = (date: Date | null, onPress: () => void, label: string) => (
    <TouchableOpacity style={styles.pickerTrigger} onPress={onPress}>
      <View style={styles.pickerIcon}>
        <Ionicons name="time-outline" size={20} color={Colors.primary[500]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <Text style={styles.pickerValue}>
          {date ? format(date, 'MMM do, yyyy - hh:mm aa') : 'Not Set (Still In)'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.neutral.textSecondary} />
    </TouchableOpacity>
  );

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
          <View style={styles.avatar}>
             <Text style={styles.avatarText}>{employeeName?.[0]}</Text>
          </View>
          <View style={{ marginLeft: Spacing.md }}>
            <Text style={styles.adjustLabel}>Adjusting time for:</Text>
            <Text style={styles.employeeName}>{employeeName}</Text>
          </View>
        </View>

        <Text style={styles.label}>Clock-In & Out</Text>
        {renderPickerTrigger(clockIn, () => setShowInPicker(true), 'Reset Clock-In')}
        <View style={{ height: Spacing.md }} />
        {renderPickerTrigger(clockOut, () => {
          if (!clockOut) setClockOut(new Date(clockIn.getTime()));
          setShowOutPicker(true);
        }, 'Reset Clock-Out')}

        {(showInPicker || showOutPicker) && Platform.OS === 'android' && (
           <DateTimePicker
             value={showInPicker ? clockIn : (clockOut || new Date())}
             mode={pickerMode}
             is24Hour={false}
             onChange={(event, date) => {
                if (event.type === 'set' && date) {
                   if (pickerMode === 'date') {
                      setPickerMode('time');
                   } else {
                      if (showInPicker) onInChange(event, date);
                      else onOutChange(event, date);
                      setPickerMode('date');
                   }
                } else {
                   setShowInPicker(false);
                   setShowOutPicker(false);
                   setPickerMode('date');
                }
             }}
           />
        )}

        {Platform.OS === 'ios' && (
          <>
            {showInPicker && <DateTimePicker value={clockIn} mode="datetime" display="spinner" onChange={onInChange} />}
            {showOutPicker && <DateTimePicker value={clockOut || new Date()} mode="datetime" display="spinner" onChange={onOutChange} />}
          </>
        )}

        <View style={{ marginTop: Spacing.xl }}>
          <Button 
            title="Create Adjusted Entry" 
            onPress={handleSave} 
            loading={loading}
          />
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={{ marginTop: Spacing.md, alignItems: 'center' }}
          >
            <Text style={{ color: Colors.neutral.textSecondary, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle" size={20} color={Colors.primary[500]} />
          <Text style={styles.noticeText}>
            This action creates a new attendance record. Total hours for the week will be updated automatically.
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
    backgroundColor: Colors.neutral.surface,
    padding: Spacing.lg,
    borderRadius: 20,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  adjustLabel: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginBottom: 2,
  },
  employeeName: {
    ...Typography.heading3,
    color: Colors.neutral.textPrimary,
  },
  label: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.neutral.textSecondary,
    marginBottom: 8,
    marginTop: Spacing.md,
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.surface,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  pickerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  pickerLabel: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginBottom: 2,
  },
  pickerValue: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
  },
  noticeCard: {
    flexDirection: 'row',
    marginTop: Spacing.xxl,
    padding: Spacing.lg,
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    gap: 12,
  },
  noticeText: {
    ...Typography.caption,
    color: Colors.primary[500],
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  }
});
