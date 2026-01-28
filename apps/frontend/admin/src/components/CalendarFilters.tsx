import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useAllUsers, Spacing, Typography } from '@time-sync/ui';

interface CalendarFiltersProps {
  selectedEmployeeId: string | null;
  selectedDepartment: string | null;
  onEmployeeChange: (employeeId: string | null) => void;
  onDepartmentChange: (department: string | null) => void;
  visible?: boolean;
  onClose?: () => void;
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  selectedEmployeeId,
  selectedDepartment,
  onEmployeeChange,
  onDepartmentChange,
  visible,
  onClose,
}) => {
  const { colors, isDark } = useTheme();
  const { users } = useAllUsers();
  const [localShowModal, setLocalShowModal] = useState(false);

  const showFilterModal = visible !== undefined ? visible : localShowModal;
  const setShowFilterModal = onClose ? onClose : setLocalShowModal;

  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    users.forEach((user: any) => {
      if (user.department) {
        deptSet.add(user.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [users]);

  const employees = useMemo(() => {
    return users.filter((user: any) => user.role !== 'ADMIN');
  }, [users]);

  const hasActiveFilters = selectedEmployeeId !== null || selectedDepartment !== null;

  const clearFilters = () => {
    onEmployeeChange(null);
    onDepartmentChange(null);
  };

  const getFilterSummary = () => {
    if (!hasActiveFilters) return 'All';
    const parts: string[] = [];
    if (selectedEmployeeId) {
      const emp = users.find((u: any) => u.id === selectedEmployeeId);
      if (emp) parts.push(`${emp.firstName} ${emp.lastName}`);
    }
    if (selectedDepartment) parts.push(selectedDepartment);
    return parts.join(', ');
  };

  return (
    <Modal visible={showFilterModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[Typography.heading2, { color: colors.textPrimary }]}>
              Calendar Filters
            </Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
              Department
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              <TouchableOpacity
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        selectedDepartment === null
                          ? isDark ? colors.primary[900] : colors.primary[100]
                          : 'transparent',
                      borderColor: selectedDepartment === null ? colors.primary[500] : colors.border,
                    },
                  ]}
                  onPress={() => onDepartmentChange(null)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: selectedDepartment === null ? colors.primary[500] : colors.textPrimary },
                    ]}
                  >
                    All Departments
                  </Text>
                </TouchableOpacity>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          selectedDepartment === dept
                            ? isDark ? colors.primary[900] : colors.primary[100]
                            : 'transparent',
                        borderColor: selectedDepartment === dept ? colors.primary[500] : colors.border,
                      },
                    ]}
                    onPress={() => onDepartmentChange(dept)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selectedDepartment === dept ? colors.primary[500] : colors.textPrimary },
                      ]}
                    >
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                Employee
              </Text>
              <ScrollView style={styles.employeeList}>
                <TouchableOpacity
                  style={[
                    styles.employeeRow,
                    selectedEmployeeId === null && {
                      backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
                    },
                  ]}
                  onPress={() => onEmployeeChange(null)}
                >
                  <Text style={[styles.employeeName, { color: colors.textPrimary }]}>
                    All Employees
                  </Text>
                  {selectedEmployeeId === null && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
                  )}
                </TouchableOpacity>
                {employees.map((emp: any) => (
                  <TouchableOpacity
                    key={emp.id}
                    style={[
                      styles.employeeRow,
                      selectedEmployeeId === emp.id && {
                        backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
                      },
                    ]}
                    onPress={() => onEmployeeChange(emp.id)}
                  >
                    <View>
                      <Text style={[styles.employeeName, { color: colors.textPrimary }]}>
                        {emp.firstName} {emp.lastName}
                      </Text>
                      {emp.department && (
                        <Text style={[styles.employeeDept, { color: colors.textSecondary }]}>
                          {emp.department}
                        </Text>
                      )}
                    </View>
                    {selectedEmployeeId === emp.id && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              {hasActiveFilters && (
                <TouchableOpacity
                  style={[styles.clearButton, { borderColor: colors.semantic.error }]}
                  onPress={clearFilters}
                >
                  <Text style={{ color: colors.semantic.error, fontWeight: '600' }}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: colors.primary[500] }]}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    maxWidth: 200,
  },
  filterButtonText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
  },
  filterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  employeeList: {
    maxHeight: 200,
  },
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  employeeName: {
    fontWeight: '500',
    fontSize: 15,
  },
  employeeDept: {
    fontSize: 12,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CalendarFilters;
