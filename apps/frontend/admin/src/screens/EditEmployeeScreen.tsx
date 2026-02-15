import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTheme, Select } from '@time-sync/ui';
import { createStyles } from '../styles/screens/EditEmployeeScreen.styles';
import { usersApi } from '@time-sync/api';
import { Ionicons } from '@expo/vector-icons';

export const EditEmployeeScreen = ({ route, navigation }: any) => {
  const { employeeId } = route.params;
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [availableDepartments, setAvailableDepartments] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    currentPtoBalance: '',
    annualPtoEntitlement: '',
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
        departmentId: emp.departmentId || (emp.department as any)?.id || '',
        currentPtoBalance: String(emp.currentPtoBalance ?? emp.leaveBalance ?? '0'),
        annualPtoEntitlement: String(emp.annualPtoEntitlement ?? emp.ptoDays ?? '0'),
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
      setAvailableDepartments(response.data);
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.departmentId) {
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
        departmentId: formData.departmentId,
        currentPtoBalance: parseFloat(formData.currentPtoBalance) || 0,
        annualPtoEntitlement: parseFloat(formData.annualPtoEntitlement) || 0,
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
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Employee</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.primary[500]} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary[500]} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(val) => updateField('firstName', val)}
              placeholderTextColor={colors.textSecondary}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(val) => updateField('lastName', val)}
              placeholderTextColor={colors.textSecondary}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
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
            value={formData.departmentId}
            options={availableDepartments.map(dept => ({ label: dept.name, value: dept.id }))}
            onValueChange={(val) => updateField('departmentId', val)}
            placeholder="Select Department"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color={colors.primary[500]} />
            <Text style={styles.sectionTitle}>Leave Balances</Text>
          </View>
          
          <View style={styles.row}>
            <View style={styles.balanceInputGroupLeft}>
              <Text style={styles.label}>Annual Entitlement</Text>
              <TextInput
                style={styles.input}
                value={formData.annualPtoEntitlement}
                onChangeText={(val) => updateField('annualPtoEntitlement', val)}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.balanceInputGroupRight}>
              <Text style={styles.label}>Current Balance</Text>
              <TextInput
                style={styles.input}
                value={formData.currentPtoBalance}
                onChangeText={(val) => updateField('currentPtoBalance', val)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton, 
            (!isDirty || saving) && styles.submitButtonDisabled
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


