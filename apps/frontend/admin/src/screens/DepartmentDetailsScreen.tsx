import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useTheme } from '@time-sync/ui';
import { createStyles } from '../styles/screens/DepartmentDetailsScreen.styles';
import { usersApi } from '@time-sync/api';
import { Ionicons } from '@expo/vector-icons';

interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId: string;
}

export const DepartmentDetailsScreen = ({ route, navigation }: any) => {
  const { departmentId } = route.params;
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [departmentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptResponse, empResponse] = await Promise.all([
        usersApi.getDepartments(),
        usersApi.getAll(),
      ]);
      
      const dept = deptResponse.data.find((d: any) => d.id === departmentId);
      setDepartment(dept);
      setEditedName(dept?.name || '');
      
      const deptEmployees = empResponse.data.filter((emp: any) => emp.departmentId === departmentId);
      setEmployees(deptEmployees);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Failed to load department details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Department name cannot be empty');
      return;
    }

    if (editedName === department?.name) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      await usersApi.updateDepartment(departmentId, { name: editedName });
      setDepartment(prev => prev ? { ...prev, name: editedName } : null);
      setIsEditing(false);
      Alert.alert('Success', 'Department name updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update department');
      setEditedName(department?.name || '');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = () => {
    Alert.alert(
      'Delete Department',
      `Are you sure you want to delete "${department?.name}"? Employees will remain but will no longer be assigned to a department.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await usersApi.deleteDepartment(departmentId);
              Alert.alert('Success', 'Department deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.response?.data?.message || 'Failed to delete department');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return colors.semantic.error;
      case 'MANAGER': return colors.primary[500];
      case 'EMPLOYEE': return colors.semantic.success;
      default: return colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Department</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </View>
    );
  }

  if (!department) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Department</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.textSecondary }}>Department not found</Text>
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
        <Text style={styles.headerTitle}>Department Details</Text>
        <View style={styles.headerButtons}>
          {!isEditing && (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                <Ionicons name="pencil" size={20} color={colors.primary[500]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteDepartment} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Info</Text>
          
          {isEditing ? (
            <View style={styles.editingContainer}>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Department name"
                placeholderTextColor={colors.textSecondary}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setEditedName(department.name);
                  }}
                >
                  <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
                  onPress={handleSaveEdit}
                  disabled={saving}
                >
                  <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{department.name}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>Total Employees</Text>
                <Text style={styles.value}>{employees.length}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employees ({employees.length})</Text>
          
          {employees.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No employees in this department</Text>
            </View>
          ) : (
            employees.map((employee) => (
              <View key={employee.id} style={styles.employeeCard}>
                <View style={styles.employeeHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {employee.firstName?.[0]}{employee.lastName?.[0]}
                    </Text>
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>
                      {employee.firstName} {employee.lastName}
                    </Text>
                    <Text style={styles.employeeEmail}>{employee.email}</Text>
                  </View>
                  <View style={[styles.roleBadge, { borderColor: getRoleBadgeColor(employee.role) }]}>
                    <Text style={[styles.roleText, { color: getRoleBadgeColor(employee.role) }]}>
                      {employee.role}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
