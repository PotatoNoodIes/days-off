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
  const [availableDepartments, setAvailableDepartments] = useState<{ id: string, name: string }[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE' as 'EMPLOYEE' | 'MANAGER' | 'ADMIN',
    departmentId: '',
    startDate: new Date(),
    endDate: null as Date | null,
    annualPtoEntitlement: '15',
    timeOffHours: '0',
  });

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await usersApi.getDepartments();
      setAvailableDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
       newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await usersApi.create({
        ...formData,
        annualPtoEntitlement: parseFloat(formData.annualPtoEntitlement) || 0,
        timeOffHours: parseFloat(formData.timeOffHours) || 0,
      });
      // @ts-ignore
      navigation.goBack();
      // Temporarily removed alert for smoother UX, can add toast later
    } catch (error: any) {
      const message = error?.response?.data?.message;
      const errorMessage = Array.isArray(message) 
        ? message.join('\n') 
        : (message || 'Failed to add employee');
        
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'EMPLOYEE', label: 'Employee', color: colors.semantic.success },
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
              style={[styles.input, errors.firstName && styles.inputError]}
              value={formData.firstName}
              onChangeText={(val) => updateField('firstName', val)}
              placeholder="Enter first name"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              value={formData.lastName}
              onChangeText={(val) => updateField('lastName', val)}
              placeholder="Enter last name"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(val) => updateField('email', val)}
              placeholder="Enter email address"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Temporary Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={formData.password}
              onChangeText={(val) => updateField('password', val)}
              placeholder="Enter temporary password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
          
          <View style={styles.inputGroup}>
            <Select
              label="Department"
              value={formData.departmentId}
              options={availableDepartments.map(dept => ({ label: dept.name, value: dept.id }))}
              onValueChange={(val) => updateField('departmentId', val)}
              placeholder="Select Department"
            />
             {errors.departmentId && <Text style={styles.errorText}>{errors.departmentId}</Text>}
          </View>
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
              <Text style={styles.label}>Annual PTO Entitlement</Text>
              <TextInput
                style={styles.input}
                value={formData.annualPtoEntitlement}
                onChangeText={(val) => updateField('annualPtoEntitlement', val)}
                placeholder="15"
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