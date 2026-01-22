import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { 
  Spacing,
  useAdminStats,
  usePendingRequests,
  useAllUsers,
  useTheme,
  Typography
} from '@time-sync/ui';
import { useRequestApproval } from '../../hooks/useRequestApproval';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Components
import { DashboardHeader } from '../components/DashboardHeader';
import { SideMenu } from '../components/SideMenu';
import { PendingRequestCard } from '../components/PendingRequestCard';

export const DashboardScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  
  // Data Hooks
  const { refetch: refetchStats } = useAdminStats();
  const { requests: pendingRequests, setRequests: setPendingRequests } = usePendingRequests();
  const { users } = useAllUsers();
  
  // State
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterEmployeeId, setFilterEmployeeId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Stats
  const pendingCount = pendingRequests.length;
  const hasFilters = filterDate !== null || filterEmployeeId !== null;

  // Filter Logic
  const filteredRequests = useMemo(() => {
    return pendingRequests.filter(req => {
      let matches = true;
      if (filterDate) {
        const reqDate = new Date(req.createdAt);
        matches = matches && (
            reqDate.getDate() === filterDate.getDate() &&
            reqDate.getMonth() === filterDate.getMonth() &&
            reqDate.getFullYear() === filterDate.getFullYear()
        );
      }
      if (filterEmployeeId) {
        matches = matches && req.userId === filterEmployeeId;
      }
      return matches;
    });
  }, [pendingRequests, filterDate, filterEmployeeId]);

  const { handleApproval } = useRequestApproval((requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    refetchStats();
  });

  const clearFilters = () => {
    setFilterDate(null);
    setFilterEmployeeId(null);
  };

  const selectedEmployee = users.find((u: any) => u.id === filterEmployeeId);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <DashboardHeader onMenuPress={() => setMenuVisible(true)} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: isDark ? colors.primary[900] : colors.primary[500] }]}>
          <View style={styles.heroAccent} />
          <Text style={styles.heroLabel}>Pending Requests</Text>
          <Text style={styles.heroCount}>{pendingCount}</Text>
          <Text style={styles.heroSubtext}>
            {pendingCount === 1 ? 'request awaiting your approval' : 'requests awaiting your approval'}
          </Text>
        </View>

        {/* Filter Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[
              styles.filterBtn, 
              { backgroundColor: colors.surface, borderColor: hasFilters ? colors.primary[500] : colors.border }
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={18} color={hasFilters ? colors.primary[500] : colors.textSecondary} />
            <Text style={[styles.filterBtnText, { color: hasFilters ? colors.primary[500] : colors.textPrimary }]}>
              {hasFilters ? 'Filtered' : 'Filters'}
            </Text>
            {hasFilters && (
              <View style={[styles.filterBadge, { backgroundColor: colors.primary[500] }]}>
                <Text style={styles.filterBadgeText}>
                  {(filterDate ? 1 : 0) + (filterEmployeeId ? 1 : 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {hasFilters && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersBtn}>
              <Text style={{ color: colors.semantic.error, fontWeight: '600', fontSize: 13 }}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
             <Ionicons name="checkmark-circle-outline" size={72} color={colors.semantic.success} />
             <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
               {pendingCount === 0 ? 'All caught up!' : 'No matching requests'}
             </Text>
             <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {pendingCount === 0 ? 'You have no pending leave requests.' : 'Try clearing your filters.'}
             </Text>
           </View>
        ) : (
           <View style={styles.requestsList}>
             {filteredRequests.map(req => (
               <PendingRequestCard 
                  key={req.id} 
                  request={req} 
                  onApprove={(id) => handleApproval(id, 'APPROVED')}
                  onReject={(id) => handleApproval(id, 'REJECTED')}
               />
             ))}
           </View>
        )}

      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[Typography.heading2, { color: colors.textPrimary }]}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Date Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Submission Date</Text>
              <TouchableOpacity 
                style={[styles.filterOption, { borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={colors.primary[500]} />
                <Text style={[styles.filterOptionText, { color: filterDate ? colors.textPrimary : colors.textSecondary }]}>
                  {filterDate ? filterDate.toLocaleDateString() : 'Select Date'}
                </Text>
                {filterDate && (
                  <TouchableOpacity onPress={() => setFilterDate(null)}>
                    <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>

            {/* Employee Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Employee</Text>
              <ScrollView style={{ maxHeight: 200 }}>
                <TouchableOpacity 
                  style={[styles.employeeRow, filterEmployeeId === null && { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }]}
                  onPress={() => setFilterEmployeeId(null)}
                >
                  <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>All Employees</Text>
                  {filterEmployeeId === null && <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />}
                </TouchableOpacity>
                {(() => {
                  // Deduplicate users by id and filter out ADMIN role
                  const uniqueUsers = (users as any[])
                    .filter((u, index, self) => index === self.findIndex((t) => t.id === u.id))
                    .filter((u) => u.role !== 'ADMIN');
                  // For dark mode, use primary[900] for selected bg, light mode uses primary[100]
                  const selectedBg = isDark ? colors.primary[900] : colors.primary[100];
                  return uniqueUsers.map((u: any) => (
                    <TouchableOpacity 
                      key={u.id}
                      style={[styles.employeeRow, filterEmployeeId === u.id && { backgroundColor: selectedBg }]}
                      onPress={() => setFilterEmployeeId(u.id)}
                    >
                      <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>{u.firstName} {u.lastName}</Text>
                      {filterEmployeeId === u.id && <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />}
                    </TouchableOpacity>
                  ));
                })()}
              </ScrollView>
            </View>

            {/* Apply Button */}
            <TouchableOpacity 
              style={[styles.applyBtn, { backgroundColor: colors.primary[500] }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setFilterDate(date);
          }}
        />
      )}

      <SideMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // Hero
  heroSection: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroCount: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '800',
    lineHeight: 72,
  },
  heroSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
  },
  heroAccent: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  // Filters
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    gap: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  filterBtnText: {
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
  clearFiltersBtn: {
    padding: 8,
  },
  // Requests
  requestsList: {
    marginTop: Spacing.sm,
  },
  // Empty
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.heading2,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  // Modal
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
    marginBottom: Spacing.xl,
  },
  filterLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    gap: 12,
  },
  filterOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  applyBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

