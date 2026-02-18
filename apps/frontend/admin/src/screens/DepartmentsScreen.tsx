import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, Modal } from 'react-native';
import { useTheme } from '@time-sync/ui';
import { useFocusEffect } from '@react-navigation/native';
import { createStyles } from '../styles/screens/DepartmentsScreen.styles';
import { useMemo } from 'react';
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
  departmentId: string;
}

export const DepartmentsScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptResponse, empResponse] = await Promise.all([
        usersApi.getDepartments(),
        usersApi.getAll(),
      ]);
      setDepartments(deptResponse.data);
      setEmployees(empResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeCountForDepartment = (deptId: string): number => {
    return employees.filter(emp => emp.departmentId === deptId).length;
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) {
      Alert.alert('Error', 'Please enter a department name');
      return;
    }

    try {
      await usersApi.createDepartment(newDepartmentName);
      setNewDepartmentName('');
      setShowAddModal(false);
      fetchData();
      Alert.alert('Success', 'Department created successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create department');
    }
  };

  const handleDeleteDepartment = (deptId: string, deptName: string) => {
    Alert.alert(
      'Delete Department',
      `Are you sure you want to delete "${deptName}"? Employees will remain but will no longer be assigned to a department.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await usersApi.deleteDepartment(deptId);
              fetchData();
              Alert.alert('Success', 'Department deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error?.response?.data?.message || 'Failed to delete department');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Departments</Text>
        </View>
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
        <Text style={styles.headerTitle}>Departments</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search departments..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{departments.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{employees.length}</Text>
          <Text style={styles.statLabel}>Employees</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredDepartments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No matches found' : 'No departments yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : 'Create your first department to get started'}
            </Text>
          </View>
        ) : (
          filteredDepartments.map((department) => (
            <View key={department.id} style={styles.departmentCardContainer}>
              <TouchableOpacity
                style={styles.departmentCard}
                onPress={() => navigation.navigate('DepartmentDetails', { departmentId: department.id })}
              >
                <View style={styles.deptHeader}>
                  <View style={styles.deptInfo}>
                    <Text style={styles.deptName}>{department.name}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.deptFooter}>
                  <View style={styles.employeeCount}>
                    <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.employeeCountText}>
                      {getEmployeeCountForDepartment(department.id)} {getEmployeeCountForDepartment(department.id) === 1 ? 'Employee' : 'Employees'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButtonContainer}
                onPress={() => handleDeleteDepartment(department.id, department.name)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.semantic.error} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowAddModal(false);
          setNewDepartmentName('');
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>Add New Department</Text>
              <TouchableOpacity onPress={() => {
                setShowAddModal(false);
                setNewDepartmentName('');
              }}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                marginBottom: 20,
                color: colors.textPrimary,
                backgroundColor: colors.background,
              }}
              placeholder="Department name"
              placeholderTextColor={colors.textSecondary}
              value={newDepartmentName}
              onChangeText={setNewDepartmentName}
              autoFocus
            />
            <TouchableOpacity
              style={{ backgroundColor: colors.primary[500], padding: 14, borderRadius: 8, alignItems: 'center' }}
              onPress={handleAddDepartment}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Create Department</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
