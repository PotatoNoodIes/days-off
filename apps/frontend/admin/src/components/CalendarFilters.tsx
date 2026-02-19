import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useAllUsers, Input } from '@time-sync/ui';
import { createStyles } from '../styles/components/CalendarFilters.styles';

interface CalendarFiltersProps {
  selectedEmployeeId: string | null;
  selectedDepartment: string | null;
  onEmployeeChange: (employeeId: string | null) => void;
  onDepartmentChange: (department: string | null) => void;
  visible?: boolean;
  onClose?: () => void;
  users?: any[]; // Accept users from parent to avoid extra fetch
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  selectedEmployeeId,
  selectedDepartment,
  onEmployeeChange,
  onDepartmentChange,
  visible,
  onClose,
  users: propUsers,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  
  const { users: hookUsers } = useAllUsers();
  const users = propUsers || hookUsers;

  const [localShowModal, setLocalShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [localDept, setLocalDept] = useState<string | null>(selectedDepartment);
  const [localEmp, setLocalEmp] = useState<string | null>(selectedEmployeeId);

  useEffect(() => {
    if (visible) {
      setLocalDept(selectedDepartment);
      setLocalEmp(selectedEmployeeId);
    }
  }, [visible, selectedDepartment, selectedEmployeeId]);

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
    return users.filter((user: any) => {
      if (user.role === 'ADMIN') return false;
      
      if (localDept && user.department?.name !== localDept) return false;
      
      if (searchQuery) {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (!fullName.includes(searchQuery.toLowerCase())) return false;
      }
      
      return true;
    });
  }, [users, localDept, searchQuery]);

  const handleApply = () => {
    onDepartmentChange(localDept);
    onEmployeeChange(localEmp);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setLocalDept(null);
    setLocalEmp(null);
    setSearchQuery('');
  };

  return (
    <Modal 
      visible={showFilterModal} 
      animationType="slide" 
      transparent 
      statusBarTranslucent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowFilterModal(false)} 
          >
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.modalContent} 
              onPress={(e) => e.stopPropagation()}
            >
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
                        localDept === null ? styles.chipActive : styles.chipInactive
                      ]}
                      onPress={() => setLocalDept(null)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          localDept === null ? styles.chipTextActive : styles.chipTextInactive
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
                          localDept === dept ? styles.chipActive : styles.chipInactive
                        ]}
                        onPress={() => setLocalDept(dept)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            localDept === dept ? styles.chipTextActive : styles.chipTextInactive
                          ]}
                        >
                          {dept}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.employeeFilterSection}>
                  <View style={styles.employeeHeader}>
                    <Text style={styles.filterLabel}>
                      Employee
                    </Text>
                    {searchQuery !== '' && (
                      <Text style={styles.resultsCount}>{employees.length} results</Text>
                    )}
                  </View>

                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    leftIcon={<Ionicons name="search" size={18} color={colors.textSecondary} />}
                    rightIcon={
                      searchQuery !== '' ? (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                      ) : undefined
                    }
                    containerStyle={styles.searchContainer}
                    inputWrapperStyle={styles.searchInputWrapper}
                  />

                  <ScrollView 
                    style={styles.employeeList} 
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                  >
                    <TouchableOpacity
                      style={[
                        styles.employeeRow,
                        localEmp === null && styles.employeeRowActive
                      ]}
                      onPress={() => setLocalEmp(null)}
                    >
                      <Text style={styles.employeeName}>
                        All Employees
                      </Text>
                      {localEmp === null && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
                      )}
                    </TouchableOpacity>
                    {employees.map((emp: any) => (
                      <TouchableOpacity
                        key={emp.id}
                        style={[
                          styles.employeeRow,
                          localEmp === emp.id && styles.employeeRowActive
                        ]}
                        onPress={() => setLocalEmp(emp.id)}
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
                        {localEmp === emp.id && (
                          <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.modalActions}>
                  {(localDept !== null || localEmp !== null) && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={clearFilters}
                    >
                      <Text style={styles.clearButtonText}>
                        Clear
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApply}
                  >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CalendarFilters;
