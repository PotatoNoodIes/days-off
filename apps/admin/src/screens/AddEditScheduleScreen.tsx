import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, adminApi, schedulesApi, Button } from '@time-sync/ui';
import { styles as globalStyles } from '../../styles/AppStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export const AddEditScheduleScreen = ({ navigation, route }: any) => {
  // Deep clone initial data to prevent Hermes "property is not writable" errors
  const editData = route.params?.schedule ? JSON.parse(JSON.stringify(route.params.schedule)) : null;
  const initialDateStr = route.params?.initialDate;
  
  const isEditing = !!editData;

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(editData?.userId || '');
  const [role, setRole] = useState(editData?.role || '');
  const [startDate, setStartDate] = useState(editData?.startTime ? new Date(editData.startTime) : (initialDateStr ? new Date(initialDateStr) : new Date()));
  const [endDate, setEndDate] = useState(editData?.endTime ? new Date(editData.endTime) : (initialDateStr ? new Date(initialDateStr) : new Date()));
  const [type, setType] = useState(editData?.type || 'REGULAR');

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApi.getWorkforceStatus();
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
    
    // Default times if creating new
    if (!isEditing && !initialDateStr) {
      const s = new Date();
      s.setHours(9, 0, 0, 0);
      setStartDate(new Date(s.getTime()));
      
      const e = new Date();
      e.setHours(17, 0, 0, 0);
      setEndDate(new Date(e.getTime()));
    }
  }, []);

  const handleSave = async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select an employee');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        userId: selectedUser,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        type,
        role: role.trim() || 'General Staff',
      };

      if (isEditing) {
        await schedulesApi.update(editData.id, payload);
      } else {
        await schedulesApi.create(payload);
      }
      
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save schedule');
    } finally {
      setLoading(false);
    }
  };

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(new Date(selectedDate.getTime()));
    }
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(new Date(selectedDate.getTime()));
    }
  };

  const renderPickerTrigger = (date: Date, onPress: () => void, label: string) => (
    <TouchableOpacity style={styles.pickerTrigger} onPress={onPress}>
      <View style={styles.pickerIcon}>
        <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <Text style={styles.pickerValue}>{format(date, 'MMM do, yyyy - hh:mm aa')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.neutral.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
          <Ionicons name="arrow-back" size={28} color={Colors.primary[500]} />
        </TouchableOpacity>
        <Text style={Typography.heading1}>{isEditing ? 'Edit Shift' : 'Add Shift'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
        <Text style={styles.label}>Select Employee</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
          {employees.map((emp) => (
            <TouchableOpacity 
              key={emp.id}
              onPress={() => setSelectedUser(emp.id)}
              style={[
                styles.userChip,
                selectedUser === emp.id && styles.userChipActive
              ]}
            >
              <View style={[styles.avatarPlaceholder, selectedUser === emp.id && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                 <Text style={[styles.avatarText, selectedUser === emp.id && { color: '#fff' }]}>{emp.firstName[0]}{emp.lastName[0]}</Text>
              </View>
              <Text style={[styles.userChipText, selectedUser === emp.id && styles.userChipTextActive]}>
                {emp.firstName} {emp.lastName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Shift Role (e.g. Cashier, Kitchen, Manager)</Text>
        <TextInput 
          style={styles.input}
          value={role}
          onChangeText={setRole}
          placeholder="Enter role..."
          placeholderTextColor={Colors.neutral.textSecondary}
        />

        <Text style={styles.label}>Schedule Timing</Text>
        {renderPickerTrigger(startDate, () => { setShowStartPicker(true); }, 'Shift Start')}
        <View style={{ height: Spacing.md }} />
        {renderPickerTrigger(endDate, () => { setShowEndPicker(true); }, 'Shift End')}

        {(showStartPicker || showEndPicker) && Platform.OS === 'android' && (
           <DateTimePicker
             value={showStartPicker ? startDate : endDate}
             mode={pickerMode}
             is24Hour={false}
             onChange={(event, date) => {
                if (event.type === 'set' && date) {
                   if (pickerMode === 'date') {
                      setPickerMode('time');
                   } else {
                      if (showStartPicker) onStartTimeChange(event, date);
                      else onEndTimeChange(event, date);
                      setPickerMode('date');
                   }
                } else {
                   setShowStartPicker(false);
                   setShowEndPicker(false);
                   setPickerMode('date');
                }
             }}
           />
        )}

        {Platform.OS === 'ios' && (
          <>
            {showStartPicker && (
               <DateTimePicker 
                  value={startDate} 
                  mode="datetime" 
                  display="spinner" 
                  onChange={onStartTimeChange}
               />
            )}
            {showEndPicker && (
               <DateTimePicker 
                  value={endDate} 
                  mode="datetime" 
                  display="spinner" 
                  onChange={onEndTimeChange}
               />
            )}
          </>
        )}

        <Text style={styles.label}>Shift Type</Text>
        <View style={styles.typeContainer}>
          {['REGULAR', 'OVERTIME', 'REMOTE'].map((t) => (
            <TouchableOpacity 
              key={t}
              onPress={() => setType(t)}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
            >
              <Ionicons 
                name={t === 'REGULAR' ? 'time' : t === 'OVERTIME' ? 'flash' : 'home'} 
                size={16} 
                color={type === t ? Colors.primary[500] : Colors.neutral.textSecondary} 
                style={{ marginBottom: 4 }}
              />
              <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button 
          title={isEditing ? 'Update Schedule' : 'Create Schedule'}
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: Spacing.xl }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.neutral.textSecondary,
    marginBottom: 8,
    marginTop: Spacing.md,
  },
  input: {
    ...Typography.bodyLarge,
    backgroundColor: Colors.neutral.surface,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    color: Colors.neutral.textPrimary,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: Colors.neutral.surface,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    marginRight: 10,
  },
  userChipActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.neutral.textSecondary,
  },
  userChipText: {
    color: Colors.neutral.textPrimary,
    fontWeight: '600',
  },
  userChipTextActive: {
    color: '#fff',
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
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.neutral.surface,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.neutral.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.primary[500],
  },
});
