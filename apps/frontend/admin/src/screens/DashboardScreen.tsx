import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { 
  Card, 
  Typography, 
  Spacing,
  useAuth,
  useAdminStats,
  usePendingRequests,
  useAllLeaveRequests,
  useAllUsers,
  Button,
  useTheme,
  ThemeToggle,
  LeaveRequest
} from '@time-sync/ui';
import { useRequestApproval } from '../../hooks/useRequestApproval';
import { Ionicons } from '@expo/vector-icons';
import { differenceInDays, parseISO } from 'date-fns';
import { leavesApi } from '@time-sync/api';
import { ManageLeaveModal } from '../components/ManageLeaveModal';

export const DashboardScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [view, setView] = useState<'pending' | 'all'>('pending');
  const [showConfigModal, setShowConfigModal] = useState(false);

  
  const { stats, refetch: refetchStats } = useAdminStats();
  const { requests: pendingRequests, setRequests: setPendingRequests, refetch: refetchPending } = usePendingRequests();
  const { requests: allRequests, refetch: refetchAll } = useAllLeaveRequests();
  const { users, refetch: refetchUsers } = useAllUsers();
  
  const { handleApproval } = useRequestApproval((requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    refetchAll();
    refetchStats();
  });



  const handleEditDecision = async (id: string) => {
    Alert.alert(
      "Edit Decision",
      "Change the status of this request:",
      [
        { text: "Approve", onPress: () => updateStatus(id, 'APPROVED') },
        { text: "Reject", onPress: () => updateStatus(id, 'REJECTED') },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await leavesApi.updateStatus(id, status);
      refetchAll();
      refetchPending();
      refetchStats();
    } catch (e) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const escapeCSV = (str: string) => {
    if (!str) return '';
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const exportCSV = async () => {
    if (allRequests.length === 0) {
      Alert.alert("No Data", "There are no leave requests to export.");
      return;
    }

    try {
      const headers = "Employee Name,Start Date,End Date,Reason,Description,Number of Days,Status\n";
      const rows = allRequests.filter(r => r.status !== 'PENDING').map(req => {
        const days = differenceInDays(parseISO(req.endDate), parseISO(req.startDate)) + 1;
        const name = `${req.user?.firstName} ${req.user?.lastName}`;
        const startDate = new Date(req.startDate).toISOString().split('T')[0];
        const endDate = new Date(req.endDate).toISOString().split('T')[0];
        
        return [
          escapeCSV(name),
          escapeCSV(startDate),
          escapeCSV(endDate),
          escapeCSV(req.reason || ''),
          escapeCSV(req.type), // Map Leave Type to Description column as requested
          days,
          escapeCSV(req.status)
        ].join(',');
      }).join("\n");
      
      const csvContent = headers + rows;
      const fileName = `leave_export_${new Date().getTime()}.csv`;

      if (Platform.OS === 'web') {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }

      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: 'utf8' });

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName.replace('.csv', ''),
            'text/csv'
          );
          await FileSystem.writeAsStringAsync(destinationUri, csvContent, { encoding: 'utf8' });
          Alert.alert("Success", "File saved successfully");
        }
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Export Leave Data',
            UTI: 'public.comma-separated-values-text',
          });
        }
      }
    } catch (error) {
      console.error('CSV Export failed:', error);
      Alert.alert("Export Failed", "An error occurred while generating the CSV file.");
    }
  };

  const renderRequestCard = (req: LeaveRequest, showEdit = false) => (
    <Card key={req.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View>
          <Text style={[Typography.heading3, { color: colors.textPrimary }]}>
            {req.user?.firstName} {req.user?.lastName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="calendar" size={14} color={colors.textSecondary} />
            <Text style={[styles.requestDates, { color: colors.textSecondary, marginLeft: 4 }]}>
              {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.statusDot, { backgroundColor: req.status === 'PENDING' ? colors.primary[500] : (req.status === 'APPROVED' ? colors.semantic.success : colors.semantic.error) }]} />
          <Text style={[styles.statusText, { color: req.status === 'PENDING' ? colors.primary[500] : (req.status === 'APPROVED' ? colors.semantic.success : colors.semantic.error) }]}>
            {req.status}
          </Text>
        </View>
      </View>
      <View style={{ marginVertical: Spacing.md }}>
        <Text style={[styles.requestReason, { color: colors.textSecondary }]}>{req.reason || 'No reason provided'}</Text>
      </View>
      <View style={styles.actionRow}>
        {req.status === 'PENDING' ? (
          <>
            <Button 
              title="Reject" 
              onPress={() => handleApproval(req.id, 'REJECTED')} 
              variant="ghost" 
              style={{ flex: 1 }}
            />
            <View style={{ width: Spacing.md }} />
            <Button 
              title="Approve" 
              onPress={() => handleApproval(req.id, 'APPROVED')} 
              style={{ flex: 2 }}
            />
          </>
        ) : showEdit && (
          <Button 
            title="Edit Decision" 
            onPress={() => handleEditDecision(req.id)} 
            variant="secondary" 
            style={{ flex: 1 }}
          />
        )}
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>Dashboard</Text>
            <Text style={{ color: colors.textSecondary }}>Signed in as {user?.firstName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <ThemeToggle />
          <TouchableOpacity 
            onPress={() => {
              setShowConfigModal(true);
            }} 
            style={[styles.headerButton, { 
              backgroundColor: isDark ? colors.surface : colors.primary[100],
              borderColor: colors.border
            }]}
            activeOpacity={0.7}
          >
             <Ionicons name="settings-outline" size={18} color={isDark ? colors.textPrimary : colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={logout} 
            style={[styles.headerButton, { 
              backgroundColor: isDark ? colors.surface : colors.primary[100],
              borderColor: colors.border
            }]}
            activeOpacity={0.7}
          >
             <Ionicons name="log-out-outline" size={18} color={colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => setView('pending')} 
            style={[styles.tab, view === 'pending' && { borderBottomColor: colors.primary[500] }]}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary }, view === 'pending' && { color: colors.primary[500], fontWeight: '700' }]}>
              Pending Approvals ({pendingRequests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setView('all')} 
            style={[styles.tab, view === 'all' && { borderBottomColor: colors.primary[500] }]}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary }, view === 'all' && { color: colors.primary[500], fontWeight: '700' }]}>
              Leave History ({allRequests.filter(r => r.status !== 'PENDING').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={exportCSV} 
            style={[styles.tab, { marginLeft: 'auto' }]}
          >
            <Ionicons name="download-outline" size={20} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {view === 'pending' ? (
          pendingRequests.length === 0 ? (
            <View style={[styles.emptyState, { marginTop: 60 }]}>
              <Ionicons name="checkmark-circle-outline" size={80} color={colors.semantic.success} />
              <Text style={[styles.emptyText, { marginTop: 16, ...Typography.heading3, color: colors.textPrimary }]}>All caught up!</Text>
              <Text style={{ color: colors.textSecondary, marginTop: 8 }}>No pending leave requests.</Text>
            </View>
          ) : (
            pendingRequests.map(req => renderRequestCard(req))
          )
        ) : (
          allRequests.filter(r => r.status !== 'PENDING').length === 0 ? (
            <View style={[styles.emptyState, { marginTop: 60 }]}>
               <Ionicons name="list-outline" size={80} color={colors.border} />
               <Text style={[styles.emptyText, { marginTop: 16, ...Typography.heading3, color: colors.textPrimary }]}>No requests in history</Text>
            </View>
          ) : (
            allRequests.filter(r => r.status !== 'PENDING').map(req => renderRequestCard(req, true))
          )
        )}
      </ScrollView>

      <ManageLeaveModal 
        visible={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        users={users}
        refetchUsers={refetchUsers}
        currentUserEmail={user?.email}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greeting: {
    ...Typography.heading1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  requestCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  requestDates: {
    ...Typography.caption,
  },
  requestReason: {
    ...Typography.bodyMedium,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.bodyMedium,
  },
});
