import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useTheme, Typography, Spacing, Select } from '@time-sync/ui';
import { usersApi } from '@time-sync/api';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export const AddEmployeeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.heading3, { color: colors.textPrimary }]}>Add Employee</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>First Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={formData.firstName}
              onChangeText={(val) => updateField('firstName', val)}
              placeholder="John"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Last Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={formData.lastName}
              onChangeText={(val) => updateField('lastName', val)}
              placeholder="Doe"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={formData.email}
              onChangeText={(val) => updateField('email', val)}
              placeholder="john.doe@company.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Temporary Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={formData.password}
              onChangeText={(val) => updateField('password', val)}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <Text style={[styles.hint, { color: colors.textSecondary }]}>Employee will change this on first login</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Role & Department</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Role</Text>
            <View style={styles.roleSelector}>
              {roleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.roleOption,
                    { borderColor: colors.border },
                    formData.role === option.value && { backgroundColor: colors.surface, borderColor: colors.primary[500] }
                  ]}
                  onPress={() => updateField('role', option.value)}
                >
                  <Text style={[
                    styles.roleText,
                    { color: colors.textPrimary },
                    formData.role === option.value && { color: colors.primary[500], fontWeight: '700' }
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

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Employment Dates</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Start Date</Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
              <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                {formData.startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>End Date (Optional)</Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
              <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
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

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Time Off Allocation</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>PTO Days</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={formData.ptoDays}
                onChangeText={(val) => updateField('ptoDays', val)}
                placeholder="15"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Time Off (Hours)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
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
          style={[styles.submitButton, { backgroundColor: colors.primary[500] }, loading && { opacity: 0.6 }]}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8 },
  scrollView: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  section: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  roleSelector: { gap: 10 },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  roleText: { fontSize: 15, fontWeight: '600' },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});