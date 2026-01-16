import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuth, Typography, Spacing, useTheme, ThemeToggle, useLeaveRequests } from '@time-sync/ui';
import { Ionicons } from '@expo/vector-icons';
import { differenceInDays, parseISO } from 'date-fns';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, logout, refreshProfile } = useAuth();
  const { colors, isDark } = useTheme();
  const { requests: activity, loading, refetch } = useLeaveRequests();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refreshProfile();
    }, [refetch, refreshProfile])
  );

  const calculateDays = (start: string, end: string) => {
    return differenceInDays(parseISO(end), parseISO(start)) + 1;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return colors.semantic.success;
      case 'REJECTED': return colors.semantic.error;
      default: return colors.semantic.warning;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View>
          <Text style={[Typography.heading1, { color: colors.textPrimary }]}>Hi, {user?.firstName}</Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <ThemeToggle />
          <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
             <Ionicons name="log-out-outline" size={24} color={colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Leave Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
           <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Leave Balance</Text>
           <Text style={[styles.statValue, { color: colors.textPrimary, fontSize: 42 }]}>{user?.leaveBalance || 0} Days</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.requestButton, { backgroundColor: colors.primary[500] }]}
          onPress={() => navigation.navigate('LeaveRequest')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ ...Typography.bodyLarge, fontWeight: '700', color: "#fff" }}>
              Request New Leave
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[Typography.heading2, { color: colors.textPrimary }]}>Leave History</Text>
        </View>

        <View style={[styles.activityList, { backgroundColor: colors.surface }]}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary[500]} />
          ) : activity.length === 0 ? (
            <View style={{ alignItems: 'center', padding: Spacing.xl }}>
              <Ionicons name="documents-outline" size={40} color={colors.border} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No leave history found.</Text>
            </View>
          ) : (
            activity.map((entry) => (
              <View key={entry.id} style={[styles.activityItem, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <View style={styles.activityItemRow}>
                  <Text style={[styles.activityItemText, { color: colors.textPrimary, fontWeight: '600' }]}>{entry.type}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(entry.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(entry.status) }]}>
                      {entry.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityItemRow}>
                  <Text style={[styles.activityItemText, { color: colors.textSecondary }]}>
                    {new Date(entry.startDate).toLocaleDateString()} - {new Date(entry.endDate).toLocaleDateString()}
                  </Text>
                  <Text style={[styles.activityItemText, { color: colors.primary[500], fontWeight: '700' }]}>
                    {calculateDays(entry.startDate, entry.endDate)} Days
                  </Text>
                </View>
                {entry.reason && (
                  <Text style={[styles.reasonText, { color: colors.textSecondary }]} numberOfLines={1}>
                    {entry.reason}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dateText: {
    ...Typography.bodyMedium,
  },
  balanceCard: {
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    elevation: 2,
  },
  statLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statValue: {
    ...Typography.heading2,
  },
  requestButton: {
    borderRadius: 18,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  activityList: {
    borderRadius: 20,
    padding: Spacing.md,
    minHeight: 120,
    marginBottom: Spacing.xl,
  },
  activityItem: {
    paddingVertical: 14,
  },
  activityItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityItemText: {
    ...Typography.bodyMedium,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reasonText: {
    ...Typography.caption,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyText: {
    ...Typography.bodyMedium,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
});
