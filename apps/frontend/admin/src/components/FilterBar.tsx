import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useTheme, Button, User } from '@time-sync/ui';
import { createStyles } from '../styles/components/FilterBar.styles';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterBarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  selectedEmployeeId: string | null;
  onEmployeeChange: (id: string | null) => void;
  users: User[];
}

export const FilterBar = ({ 
  selectedDate, 
  onDateChange, 
  selectedEmployeeId, 
  onEmployeeChange,
  users 
}: FilterBarProps) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const [showEmployeeModal, setShowEmployeeModal] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  // Derive unique employees who actually have requests? 
  // Requirement says "Dynamically populated". Passing in all users is safer.
  
  const selectedEmployeeName = users.find(u => u.id === selectedEmployeeId)?.firstName 
    ? `${users.find(u => u.id === selectedEmployeeId)?.firstName} ${users.find(u => u.id === selectedEmployeeId)?.lastName}` 
    : 'All Employees';

  const clearFilters = () => {
    onDateChange(null);
    onEmployeeChange(null);
  };

  const hasFilters = selectedDate || selectedEmployeeId;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Date Filter */}
        <TouchableOpacity 
          style={[
            styles.filterChip, 
            selectedDate ? styles.chipActive : styles.chipInactive,
            !selectedDate && styles.chipShadow
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={16} color={selectedDate ? colors.primary[500] : colors.textSecondary} />
          <Text style={[
            styles.chipText, 
            selectedDate ? styles.chipTextActive : styles.chipTextInactive
          ]}>
            {selectedDate ? selectedDate.toLocaleDateString() : 'Date Submitted'}
          </Text>
          {selectedDate ? (
             <TouchableOpacity onPress={() => onDateChange(null)} style={{ marginLeft: 6 }}>
                <Ionicons name="close-circle" size={18} color={colors.primary[500]} />
             </TouchableOpacity>
          ) : (
             <Ionicons name="chevron-down" size={14} color={colors.textSecondary} style={{ marginLeft: 6 }} />
          )}
        </TouchableOpacity>

         {/* Employee Filter */}
        <TouchableOpacity 
          style={[
            styles.filterChip, 
            selectedEmployeeId ? styles.chipActive : styles.chipInactive,
            !selectedEmployeeId && styles.chipShadow
          ]}
          onPress={() => setShowEmployeeModal(true)}
        >
          <Ionicons name="person" size={16} color={selectedEmployeeId ? colors.primary[500] : colors.textSecondary} />
          <Text style={[
            styles.chipText, 
            selectedEmployeeId ? styles.chipTextActive : styles.chipTextInactive
          ]}>
            {selectedEmployeeName}
          </Text>
           {selectedEmployeeId ? (
             <TouchableOpacity onPress={() => onEmployeeChange(null)} style={{ marginLeft: 6 }}>
                <Ionicons name="close-circle" size={18} color={colors.primary[500]} />
             </TouchableOpacity>
          ) : (
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} style={{ marginLeft: 6 }} />
          )}
        </TouchableOpacity>

        {hasFilters && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
        )}

      </ScrollView>

      {/* Date Picker Modal/Component */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) onDateChange(date);
          }}
        />
      )}

      {/* Employee Selection Modal */}
      <Modal visible={showEmployeeModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Filter by Employee</Text>
                      <TouchableOpacity onPress={() => setShowEmployeeModal(false)} style={styles.closeModalBtn}>
                          <Ionicons name="close" size={24} color={colors.textSecondary} />
                      </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.employeeList}>
                      <TouchableOpacity 
                          style={styles.employeeItem}
                          onPress={() => {
                              onEmployeeChange(null);
                              setShowEmployeeModal(false);
                          }}
                      >
                          <Text style={styles.employeeItemText}>All Employees</Text>
                          {!selectedEmployeeId && <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />}
                      </TouchableOpacity>
                      {users.map(u => (
                          <TouchableOpacity 
                            key={u.id}
                            style={styles.employeeItem}
                            onPress={() => {
                                onEmployeeChange(u.id);
                                setShowEmployeeModal(false);
                            }}
                          >
                              <Text style={styles.employeeItemText}>{u.firstName} {u.lastName}</Text>
                              {selectedEmployeeId === u.id && <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />}
                          </TouchableOpacity>
                      ))}
                  </ScrollView>
              </View>
          </View>
      </Modal>

    </View>
  );
};


