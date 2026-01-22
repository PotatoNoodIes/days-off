import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useTheme, Typography, Spacing, Button, User } from '@time-sync/ui';
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
  const { colors } = useTheme();
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
            { 
              backgroundColor: selectedDate ? colors.primary[100] : colors.surface,
              borderColor: selectedDate ? colors.primary[500] : colors.border,
            },
            !selectedDate && styles.chipShadow // Only shadow when inactive/surface to lift it off bg
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={16} color={selectedDate ? colors.primary[500] : colors.textSecondary} />
          <Text style={[
            styles.chipText, 
            { color: selectedDate ? colors.primary[500] : colors.textPrimary }
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
            { 
               backgroundColor: selectedEmployeeId ? colors.primary[100] : colors.surface,
               borderColor: selectedEmployeeId ? colors.primary[500] : colors.border
            },
            !selectedEmployeeId && styles.chipShadow
          ]}
          onPress={() => setShowEmployeeModal(true)}
        >
          <Ionicons name="person" size={16} color={selectedEmployeeId ? colors.primary[500] : colors.textSecondary} />
          <Text style={[
            styles.chipText, 
            { color: selectedEmployeeId ? colors.primary[500] : colors.textPrimary }
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
                <Text style={{ color: colors.semantic.error, fontSize: 13, fontWeight: '600' }}>Clear</Text>
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
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                  <View style={styles.modalHeader}>
                      <Text style={[Typography.heading3, { color: colors.textPrimary }]}>Filter by Employee</Text>
                      <TouchableOpacity onPress={() => setShowEmployeeModal(false)} style={styles.closeModalBtn}>
                          <Ionicons name="close" size={24} color={colors.textSecondary} />
                      </TouchableOpacity>
                  </View>
                  <ScrollView style={{ maxHeight: 300 }}>
                      <TouchableOpacity 
                          style={[styles.employeeItem, { borderBottomColor: colors.border }]}
                          onPress={() => {
                              onEmployeeChange(null);
                              setShowEmployeeModal(false);
                          }}
                      >
                          <Text style={{ ...Typography.bodyLarge, color: colors.textPrimary }}>All Employees</Text>
                          {!selectedEmployeeId && <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />}
                      </TouchableOpacity>
                      {users.map(u => (
                          <TouchableOpacity 
                            key={u.id}
                            style={[styles.employeeItem, { borderBottomColor: colors.border }]}
                            onPress={() => {
                                onEmployeeChange(u.id);
                                setShowEmployeeModal(false);
                            }}
                          >
                              <Text style={{ ...Typography.bodyLarge, color: colors.textPrimary }}>{u.firstName} {u.lastName}</Text>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    alignItems: 'center',
    paddingBottom: 4, // Space for shadow
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100, // Full Pill
    borderWidth: 1,
  },
  chipShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  clearBtn: {
      paddingHorizontal: 12,
      paddingVertical: 10,
  },
  modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
  },
  modalContent: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: Spacing.xl,
      paddingBottom: 40,
      maxHeight: '80%',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 10,
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
  },
  closeModalBtn: {
      padding: 4,
  },
  employeeItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  }
});
