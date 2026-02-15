import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useAllUsers } from '@time-sync/ui';
import { createStyles } from '../styles/components/CalendarFilters.styles';

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
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const { users } = useAllUsers();
  const [localShowModal, setLocalShowModal] = useState(false);

  const showFilterModal = visible !== undefined ? visible : localShowModal;
  const setShowFilterModal = onClose ? onClose : setLocalShowModal;

  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    users.forEach((user: any) => {
      if (user.department?.name) {
        deptSet.add(user.department.name);
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
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Calendar Filters
            </Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>
              Department
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              <TouchableOpacity
                  style={[
                    styles.chip,
                    selectedDepartment === null ? styles.chipActive : styles.chipInactive
                  ]}
                  onPress={() => onDepartmentChange(null)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedDepartment === null ? styles.chipTextActive : styles.chipTextInactive
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
                      selectedDepartment === dept ? styles.chipActive : styles.chipInactive
                    ]}
                    onPress={() => onDepartmentChange(dept)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedDepartment === dept ? styles.chipTextActive : styles.chipTextInactive
                      ]}
                    >
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>
                Employee
              </Text>
              <ScrollView style={styles.employeeList}>
                <TouchableOpacity
                  style={[
                    styles.employeeRow,
                    selectedEmployeeId === null && styles.employeeRowActive
                  ]}
                  onPress={() => onEmployeeChange(null)}
                >
                  <Text style={styles.employeeName}>
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
                      selectedEmployeeId === emp.id && styles.employeeRowActive
                    ]}
                    onPress={() => onEmployeeChange(emp.id)}
                  >
                    <View>
                      <Text style={styles.employeeName}>
                        {emp.firstName} {emp.lastName}
                      </Text>
                      {emp.department && (
                        <Text style={styles.employeeDept}>
                          {emp.department.name}
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
                  style={styles.clearButton}
                  onPress={clearFilters}
                >
                  <Text style={styles.clearButtonText}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.applyButton}
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



export default CalendarFilters;
