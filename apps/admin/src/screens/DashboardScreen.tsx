import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  Card, 
  Typography, 
  Spacing,
  useAuth,
  useAdminStats,
  usePendingRequests,
  Button,
  useTheme,
  ThemeToggle
} from '@time-sync/ui';
import { useRequestApproval } from '../../hooks/useRequestApproval';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [view, setView] = useState<'dashboard' | 'approvals'>('dashboard');
  
  const { stats } = useAdminStats();
  const userCount = stats?.totalUsers || 0;
  const { requests, setRequests } = usePendingRequests();
  
  const { handleApproval } = useRequestApproval((requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>Admin Hub</Text>
            <Text style={{ color: colors.textSecondary }}>Signed in as {user?.firstName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <ThemeToggle />
          <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
             <Ionicons name="log-out-outline" size={24} color={colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => setView('dashboard')} 
            style={[styles.tab, view === 'dashboard' && { borderBottomColor: colors.primary[500] }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="grid-outline" size={16} color={view === 'dashboard' ? colors.primary[500] : colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.tabText, { color: colors.textSecondary }, view === 'dashboard' && { color: colors.primary[500], fontWeight: '700' }]}>
                Overview
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setView('approvals')} 
            style={[styles.tab, view === 'approvals' && { borderBottomColor: colors.primary[500] }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkbox-outline" size={16} color={view === 'approvals' ? colors.primary[500] : colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.tabText, { color: colors.textSecondary }, view === 'approvals' && { color: colors.primary[500], fontWeight: '700' }]}>
                Approvals ({requests.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {view === 'dashboard' ? (
          <>
            <View style={styles.statsGrid}>
              <TouchableOpacity 
                style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]} 
                onPress={() => navigation.navigate('TeamStatus')}
              >
                <Ionicons name="pulse" size={20} color={colors.primary[500]} style={{ marginBottom: 8 }} />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats?.activeToday || 0}/{userCount || 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Live Workforce</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]} 
                onPress={() => navigation.navigate('Schedules')}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.semantic.warning} style={{ marginBottom: 8 }} />
                <Text style={[styles.statValue, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>Schedules</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily & Weekly</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[Typography.heading2, { color: colors.textPrimary }]}>Active Today ({stats?.activeToday || 0})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRow}>
              {Array.from({ length: stats?.activeToday || 0 }).map((_, i) => (
                <View key={i} style={[styles.avatar, { backgroundColor: colors.surface }]}>
                  <Ionicons name="person" size={24} color={colors.primary[500]} />
                </View>
              ))}
              {stats?.activeToday === 0 && (
                 <Text style={[styles.emptyText, { marginLeft: 4, color: colors.textSecondary }]}>No active users currently</Text>
              )}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={[Typography.heading2, { color: colors.textPrimary }]}>Recent Activity</Text>
            </View>
            <Card style={{ padding: Spacing.md }}>
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map(act => (
                  <View key={act.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <Ionicons 
                      name={act.type === 'attendance' ? 'time-outline' : 'calendar-outline'} 
                      size={18} 
                      color={act.type === 'attendance' ? colors.primary[500] : colors.secondary[500]} 
                      style={{ marginRight: 10 }}
                    />
                    <Text style={{ ...Typography.bodyMedium, color: colors.textPrimary }}>{act.text}</Text>
                  </View>
                ))
              ) : (
                <View style={{ alignItems: 'center', padding: Spacing.lg }}>
                   <Ionicons name="list-outline" size={40} color={colors.border} />
                   <Text style={[styles.emptyText, { marginTop: 8, color: colors.textSecondary }]}>No recent activity</Text>
                </View>
              )}
            </Card>
          </>
        ) : (
          <>
            {requests.length === 0 ? (
              <View style={[styles.emptyState, { marginTop: 60 }]}>
                <Ionicons name="checkmark-circle-outline" size={80} color={colors.semantic.success} />
                <Text style={[styles.emptyText, { marginTop: 16, ...Typography.heading3, color: colors.textPrimary }]}>All caught up!</Text>
                <Text style={{ color: colors.textSecondary, marginTop: 8 }}>No pending leave requests.</Text>
              </View>
            ) : (
              requests.map(req => (
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
                    <View style={[styles.badge, { backgroundColor: colors.primary[100] }]}>
                      <Text style={[styles.badgeText, { color: colors.primary[500] }]}>{req.type}</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: colors.background, padding: Spacing.md, borderRadius: 8, marginVertical: Spacing.md }}>
                    <Text style={[styles.requestReason, { color: colors.textPrimary, fontStyle: 'italic' }]}>"{req.reason}"</Text>
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
  greeting: {
    ...Typography.heading1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
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
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
  },
  statValue: {
    ...Typography.heading2,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: Spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
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
  }
});
