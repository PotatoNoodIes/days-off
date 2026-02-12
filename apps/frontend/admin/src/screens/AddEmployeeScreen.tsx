import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useTheme, Select } from '@time-sync/ui';
import { createStyles } from '../styles/screens/AddEmployeeScreen.styles';
import { useMemo } from 'react';
import { usersApi } from '@time-sync/api';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export const AddEmployeeScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Welcome123!',
    role: 'EMPLOYEE' as 'EMPLOYEE' | 'MANAGER' | 'ADMIN',
    department: '',
    startDate: new Date(),
    endDate: null as Date | null,
    ptoDays: '15',
    timeOffHours: '0',
  });

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await usersApi.getDepartments();
      setAvailableDepartments(response.data.map((d: any) => d.name));
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await usersApi.create({
        ...formData,
        ptoDays: parseFloat(formData.ptoDays) || 0,
        timeOffHours: parseFloat(formData.timeOffHours) || 0,
      });
      Alert.alert('Success', 'Employee added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'EMPLOYEE', label: 'Employee', color: colors.semantic.success },
    { value: 'MANAGER', label: 'Manager', color: colors.primary[500] },
    { value: 'ADMIN', label: 'Admin', color: colors.semantic.error },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Employee</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(val) => updateField('firstName', val)}
              placeholder="John"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(val) => updateField('lastName', val)}
              placeholder="Doe"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(val) => updateField('email', val)}
              placeholder="john.doe@company.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Temporary Password</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(val) => updateField('password', val)}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <Text style={styles.hint}>Employee will change this on first login</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role & Department</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleSelector}>
              {roleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.roleOption,
                    formData.role === option.value && styles.roleOptionSelected
                  ]}
                  onPress={() => updateField('role', option.value)}
                >
                  <Text style={[
                    styles.roleText,
                    formData.role === option.value && styles.roleTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {formData.role === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Select
            label="Department"
            value={formData.department}
            options={availableDepartments.map(dept => ({ label: dept, value: dept }))}
            onValueChange={(val) => updateField('department', val)}
            placeholder="Select Department"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Dates</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
              <Text style={styles.dateButtonText}>
                {formData.startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>End Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
              <Text style={styles.dateButtonText}>
                {formData.endDate ? formData.endDate.toLocaleDateString() : 'No end date'}
              </Text>
              {formData.endDate && (
                <TouchableOpacity onPress={() => updateField('endDate', null)}>
                  <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Off Allocation</Text>
          
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PTO Days</Text>
              <TextInput
                style={styles.input}
                value={formData.ptoDays}
                onChangeText={(val) => updateField('ptoDays', val)}
                placeholder="15"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time Off (Hours)</Text>
              <TextInput
                style={styles.input}
                value={formData.timeOffHours}
                onChangeText={(val) => updateField('timeOffHours', val)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding Employee...' : 'Add Employee'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showStartDatePicker && (
        <DateTimePicker
          value={formData.startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) updateField('startDate', date);
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={formData.endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) updateField('endDate', date);
          }}
        />
      )}
    </View>
  );
};