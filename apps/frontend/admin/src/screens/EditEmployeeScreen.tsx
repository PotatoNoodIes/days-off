import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTheme, Typography, Spacing, Select } from '@time-sync/ui';
import { usersApi } from '@time-sync/api';
import { Ionicons } from '@expo/vector-icons';

export const EditEmployeeScreen = ({ route, navigation }: any) => {
  const { employeeId } = route.params;
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    leaveBalance: '',
    ptoDays: '',
  });

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchEmployee(), fetchDepartments()]);
    };
    init();
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getById(employeeId);
      const emp = response.data;
      const data = {
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        email: emp.email || '',
        department: (emp.department as any) || '',
        leaveBalance: String(emp.leaveBalance || '0'),
        ptoDays: String(emp.ptoDays || '0'),
      };
      setInitialData(data);
      setFormData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch employee details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await usersApi.getDepartments();
      setAvailableDepartments(response.data.map((d: any) => d.name));
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  const isDirty = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Confirm Changes',
      'Are you sure you want to save these changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', style: 'default', onPress: saveChanges }
      ]
    );
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await usersApi.updateEmployee(employeeId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        leaveBalance: parseFloat(formData.leaveBalance) || 0,
        ptoDays: parseFloat(formData.ptoDays) || 0,
      });
      Alert.alert('Success', 'Employee record updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.heading3, { color: colors.textPrimary }]}>Edit Employee</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }]}>
            <Ionicons name="person" size={48} color={colors.primary[500]} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary[500]} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Personal Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>First Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={formData.firstName}
              onChangeText={(val) => updateField('firstName', val)}
              placeholderTextColor={colors.textSecondary}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Last Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={formData.lastName}
              onChangeText={(val) => updateField('lastName', val)}
              placeholderTextColor={colors.textSecondary}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={formData.email}
              onChangeText={(val) => updateField('email', val)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <Select
            label="Department *"
            value={formData.department}
            options={availableDepartments.map(dept => ({ label: dept, value: dept }))}
            onValueChange={(val) => updateField('department', val)}
            placeholder="Select Department"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color={colors.primary[500]} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Leave Balances</Text>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 0.9, marginBottom: 0 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Total PTO Days</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={formData.ptoDays}
                onChangeText={(val) => updateField('ptoDays', val)}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1.1, marginBottom: 0 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Remaining Balance</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={formData.leaveBalance}
                onChangeText={(val) => updateField('leaveBalance', val)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton, 
            { backgroundColor: colors.primary[500] }, 
            (!isDirty || saving) && { opacity: 0.5 }
          ]}
          onPress={handleSubmit}
          disabled={!isDirty || saving}
        >
          <Text style={styles.submitButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  avatarContainer: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  section: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, fontSize: 15 },
  selectorContainer: { flexDirection: 'row', gap: 12 },
  selectorOption: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 12, 
    borderWidth: 1,
  },
  selectorText: { fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-end', marginBottom: Spacing.md },
  submitButton: { 
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
