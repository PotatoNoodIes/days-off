import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useTheme, formatLocalDate } from '@time-sync/ui';
import { createStyles } from '../styles/screens/AllEmployeesScreen.styles';
import { useMemo } from 'react';
import { usersApi } from '@time-sync/api';
import { Ionicons } from '@expo/vector-icons';

interface Employee {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  ptoDays?: number;
  timeOffHours?: number;
  leaveBalance?: number;
}

 export const AllEmployeesScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Text style={styles.headerTitle}>All Employees</Text>
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
        <Text style={styles.headerTitle}>All Employees</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddEmployee')}
          style={styles.addButton}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
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
          <Text style={styles.statNumber}>{employees.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {employees.filter(e => e.role === 'EMPLOYEE').length}
          </Text>
          <Text style={styles.statLabel}>Employees</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {employees.filter(e => e.role === 'MANAGER').length}
          </Text>
          <Text style={styles.statLabel}>Managers</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredEmployees.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No matches found' : 'No employees yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : 'Add your first employee to get started'}
            </Text>
          </View>
        ) : (
          filteredEmployees.map((employee) => (
            <TouchableOpacity
              key={employee.id}
              style={styles.employeeCard}
              onPress={() => navigation.navigate('EditEmployee', { employeeId: employee.id })}
            >
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
                  <Text style={styles.employeeEmail}>
                    {employee.email}
                  </Text>
                </View>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>
                    {employee.role}
                  </Text>
                </View>
              </View>

               <View style={styles.divider} />

              <View style={styles.employeeDetails}>
                {employee.department && (
                  <View style={styles.detailRow}>
                    <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {employee.department}
                    </Text>
                  </View>
                )}
                {employee.startDate && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      Started {formatLocalDate(employee.startDate)}
                    </Text>
                  </View>
                )}
                <View style={styles.balanceRow}>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceValuePTO}>
                      {employee.ptoDays || 0}
                    </Text>
                    <Text style={styles.balanceLabel}>PTO Days</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceValueTimeOff}>
                      {employee.timeOffHours || 0}h
                    </Text>
                    <Text style={styles.balanceLabel}>Time Off</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceValueLeave}>
                      {employee.leaveBalance || 0}
                    </Text>
                    <Text style={styles.balanceLabel}>Leave Balance</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

