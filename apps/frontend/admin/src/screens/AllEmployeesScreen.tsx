import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useTheme, Typography, Spacing } from '@time-sync/ui';
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[Typography.heading3, { color: colors.textPrimary }]}>All Employees</Text>
        </View>
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
        <Text style={[Typography.heading3, { color: colors.textPrimary }]}>All Employees</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddEmployee')}
          style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
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
        <View style={[styles.statCard, { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }]}>
          <Text style={[styles.statNumber, { color: colors.primary[500] }]}>{employees.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }]}>
          <Text style={[styles.statNumber, { color: colors.primary[500] }]}>
            {employees.filter(e => e.role === 'EMPLOYEE').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Employees</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }]}>
          <Text style={[styles.statNumber, { color: colors.primary[500] }]}>
            {employees.filter(e => e.role === 'MANAGER').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Managers</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredEmployees.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={[Typography.heading3, { color: colors.textPrimary, marginTop: 16 }]}>
              {searchQuery ? 'No matches found' : 'No employees yet'}
            </Text>
            <Text style={[Typography.bodyMedium, { color: colors.textSecondary, marginTop: 8 }]}>
              {searchQuery ? 'Try a different search term' : 'Add your first employee to get started'}
            </Text>
          </View>
        ) : (
          filteredEmployees.map((employee) => (
            <TouchableOpacity
              key={employee.id}
              style={[styles.employeeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('EditEmployee', { employeeId: employee.id })}
            >
              <View style={styles.employeeHeader}>
                <View style={[styles.avatar, { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }]}>
                  <Text style={[styles.avatarText, { color: colors.primary[500] }]}>
                    {employee.firstName?.[0]}{employee.lastName?.[0]}
                  </Text>
                </View>
                <View style={styles.employeeInfo}>
                  <Text style={[Typography.bodyLarge, { color: colors.textPrimary, fontWeight: '600' }]}>
                    {employee.firstName} {employee.lastName}
                  </Text>
                  <Text style={[Typography.bodyMedium, { color: colors.textSecondary }]}>
                    {employee.email}
                  </Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}>
                  <Text style={[styles.roleText, { color: colors.textPrimary }]}>
                    {employee.role}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.employeeDetails}>
                {employee.department && (
                  <View style={styles.detailRow}>
                    <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                      {employee.department}
                    </Text>
                  </View>
                )}
                {employee.startDate && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                      Started {new Date(employee.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                <View style={styles.balanceRow}>
                  <View style={styles.balanceItem}>
                    <Text style={[styles.balanceValue, { color: colors.primary[500] }]}>
                      {employee.ptoDays || 0}
                    </Text>
                    <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>PTO Days</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={[styles.balanceValue, { color: colors.semantic.warning }]}>
                      {employee.timeOffHours || 0}h
                    </Text>
                    <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Time Off</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={[styles.balanceValue, { color: colors.semantic.success }]}>
                      {employee.leaveBalance || 0}
                    </Text>
                    <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Leave Balance</Text>
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
  addButton: { 
    padding: 10, 
    borderRadius: 12 
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 15 
  },
  statsRow: { 
    flexDirection: 'row', 
    paddingHorizontal: Spacing.xl, 
    paddingTop: Spacing.md, 
    gap: 12 
  },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.xl, paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  employeeCard: { borderRadius: 16, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1 },
  employeeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  employeeInfo: { flex: 1 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  roleText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  divider: { height: 1, marginVertical: Spacing.md },
  employeeDetails: { gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14 },
  balanceRow: { flexDirection: 'row', marginTop: 12, gap: 16 },
  balanceItem: { flex: 1, alignItems: 'center' },
  balanceValue: { fontSize: 20, fontWeight: '700' },
  balanceLabel: { fontSize: 11, marginTop: 4 },
  cardFooter: { position: 'absolute', right: 16, top: '50%', marginTop: -10 },
});