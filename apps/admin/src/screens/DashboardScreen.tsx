import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Card, 
  Colors, 
  Typography, 
  Spacing,
  useAuth,
  useAdminStats,
  usePendingRequests,
  Button
} from '@time-sync/ui';
import { styles } from '../../styles/AppStyles';
import { useRequestApproval } from '../../hooks/useRequestApproval';

import { Ionicons } from '@expo/vector-icons';

export const AdminDashboardScreen = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState<'dashboard' | 'approvals'>('dashboard');
  
  const { stats } = useAdminStats();
  const { requests, setRequests } = usePendingRequests();
  
  const { handleApproval } = useRequestApproval((requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
            <Text style={styles.greeting}>Admin Hub</Text>
            <Text style={{color: Colors.neutral.textSecondary}}>Signed in as {user?.firstName}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
           <Ionicons name="log-out-outline" size={24} color={Colors.semantic.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
          <TouchableOpacity 
            onPress={() => setView('dashboard')} 
            style={[styles.tab, view === 'dashboard' && styles.activeTab]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="grid-outline" size={16} color={view === 'dashboard' ? Colors.primary[500] : Colors.neutral.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.tabText, view === 'dashboard' && styles.activeTabText]}>
                Overview
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setView('approvals')} 
            style={[styles.tab, view === 'approvals' && styles.activeTab]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkbox-outline" size={16} color={view === 'approvals' ? Colors.primary[500] : Colors.neutral.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.tabText, view === 'approvals' && styles.activeTabText]}>
                Approvals ({requests.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {view === 'dashboard' ? (
          <>
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Ionicons name="people-outline" size={20} color={Colors.primary[500]} style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>{stats?.attendanceRate || '0%'}</Text>
                <Text style={styles.statLabel}>Attendance</Text>
              </Card>
              <Card style={styles.statCard}>
                <Ionicons name="hourglass-outline" size={20} color={Colors.semantic.warning} style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>{stats?.pendingRequests || 0}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </Card>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={Typography.heading2}>Active Today ({stats?.activeToday || 0})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRow}>
              {Array.from({ length: stats?.activeToday || 0 }).map((_, i) => (
                <View key={i} style={styles.avatar}>
                  <Ionicons name="person" size={24} color={Colors.primary[500]} />
                </View>
              ))}
              {stats?.activeToday === 0 && (
                 <Text style={[styles.emptyText, { marginLeft: 4 }]}>No active users currently</Text>
              )}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={Typography.heading2}>Recent Activity</Text>
            </View>
            <Card style={{ padding: Spacing.md }}>
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map(act => (
                  <View key={act.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.neutral.border }}>
                    <Ionicons 
                      name={act.type === 'attendance' ? 'time-outline' : 'calendar-outline'} 
                      size={18} 
                      color={act.type === 'attendance' ? Colors.primary[500] : Colors.secondary[500]} 
                      style={{ marginRight: 10 }}
                    />
                    <Text style={{ ...Typography.bodyMedium, color: Colors.neutral.textPrimary }}>{act.text}</Text>
                  </View>
                ))
              ) : (
                <View style={{ alignItems: 'center', padding: Spacing.lg }}>
                   <Ionicons name="list-outline" size={40} color={Colors.neutral.border} />
                   <Text style={[styles.emptyText, { marginTop: 8 }]}>No recent activity</Text>
                </View>
              )}
            </Card>
          </>
        ) : (
          <>
            {requests.length === 0 ? (
              <View style={[styles.emptyState, { marginTop: 60 }]}>
                <Ionicons name="checkmark-circle-outline" size={80} color={Colors.semantic.success} />
                <Text style={[styles.emptyText, { marginTop: 16, ...Typography.heading3 }]}>All caught up!</Text>
                <Text style={{ color: Colors.neutral.textSecondary, marginTop: 8 }}>No pending leave requests.</Text>
              </View>
            ) : (
              requests.map(req => (
                <Card key={req.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <View>
                      <Text style={Typography.heading3}>
                        {req.user?.firstName} {req.user?.lastName}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Ionicons name="calendar" size={14} color={Colors.neutral.textSecondary} />
                        <Text style={[styles.requestDates, { marginLeft: 4 }]}>
                          {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{req.type}</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: Colors.neutral.background, padding: Spacing.md, borderRadius: 8, marginVertical: Spacing.md }}>
                    <Text style={[styles.requestReason, { fontStyle: 'italic' }]}>"{req.reason}"</Text>
                  </View>
                  <View style={styles.actionRow}>
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
                  </View>
                </Card>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};
