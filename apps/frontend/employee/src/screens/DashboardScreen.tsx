import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth, Typography, Spacing, useTheme, useAttendanceStatus, ThemeToggle } from '@time-sync/ui';
import { useClockInOut } from '../../hooks/useClockInOut';
import { useRecentActivity } from '../../hooks/useRecentActivity';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { colors, mode, isDark } = useTheme();
  const { status, refetch: refetchStatus } = useAttendanceStatus();
  const { isClockedIn, clockInTime, loading: clockLoading, toggleClock } = useClockInOut(status, refetchStatus);
  const { activity, loading } = useRecentActivity();

  const [elapsedTime, setElapsedTime] = React.useState('00:00:00');

  // Animation for the pulsing dot when clocked in
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - clockInTime.getTime();
        
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      setElapsedTime('00:00:00');
      pulseAnim.setValue(1);
    }

    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

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
          <TouchableOpacity 
            onPress={() => navigation.navigate('Schedules')} 
            style={{ padding: 8 }}
          >
             <Ionicons name="calendar-outline" size={24} color={colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
             <Ionicons name="log-out-outline" size={24} color={colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Clock Card */}
        <View style={[styles.clockCard, { backgroundColor: colors.surface, shadowColor: isDark ? '#000' : '#242424' }]}>
          <View style={[styles.statusBadge, { backgroundColor: colors.background }]}>
            <Animated.View style={[
              styles.pulseDot, 
              { 
                transform: [{ scale: pulseAnim }], 
                opacity: isClockedIn ? 1 : 0.5,
                backgroundColor: isClockedIn ? colors.semantic.success : colors.textSecondary
              }
            ]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {isClockedIn ? 'Working Now' : 'Not Working'}
            </Text>
          </View>
          
          <Text style={[styles.timeText, { color: colors.textPrimary }]}>{isClockedIn ? elapsedTime : '--:--:--'}</Text>
          <Text style={[styles.clockSubtext, { color: colors.textSecondary }]}>
            {isClockedIn ? `In since ${clockInTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Ready to start your shift?'}
          </Text>

          <TouchableOpacity 
            style={[
              styles.clockButton, 
              isClockedIn 
                ? { backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.semantic.error } 
                : { backgroundColor: colors.primary[500] }
            ]}
            onPress={() => toggleClock()}
            disabled={clockLoading}
          >
            {clockLoading ? (
              <ActivityIndicator color={isClockedIn ? colors.semantic.error : "#fff"} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons 
                  name={isClockedIn ? "stop-circle" : "play-circle"} 
                  size={24} 
                  color={isClockedIn ? colors.semantic.error : "#fff"} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[
                  styles.clockButtonText, 
                  { color: isClockedIn ? colors.semantic.error : "#fff" }
                ]}>
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.clockButton, { backgroundColor: colors.primary[100], borderWidth: 0, paddingVertical: 14 }]}
          onPress={() => navigation.navigate('LeaveRequest')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} style={{ marginRight: 8 }} />
            <Text style={{ ...Typography.bodyLarge, fontWeight: '600', color: colors.primary[500] }}>
              Request Leave
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Week</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{status.weeklyHours || 0}h</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Leave Balance</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{user?.leaveBalance || 0}d</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[Typography.heading2, { color: colors.textPrimary }]}>Recent Activity</Text>
        </View>

        <View style={[styles.activityList, { backgroundColor: colors.surface }]}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary[500]} />
          ) : activity.length === 0 ? (
            <>
              <Ionicons name="documents-outline" size={40} color={colors.border} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No recent activity found.</Text>
            </>
          ) : (
            activity.map((entry) => (
              <View key={entry.id} style={[styles.activityItem, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <View style={styles.activityItemRow}>
                  <Text style={[styles.activityItemText, { color: colors.textPrimary, fontWeight: '600' }]}>{entry.type}</Text>
                  <Text style={[styles.activityItemText, { color: colors.textSecondary }]}>{new Date(entry.clockIn).toLocaleDateString()}</Text>
                </View>
                <View style={styles.activityItemRow}>
                  <Text style={[styles.activityItemText, { color: colors.textSecondary }]}>
                    {new Date(entry.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {entry.clockOut ? ` - ${new Date(entry.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ' (In Progress)'}
                  </Text>
                  {entry.duration && (
                    <Text style={[styles.activityItemText, { color: colors.primary[500], fontWeight: '700' }]}>
                      {Math.floor(entry.duration / 3600)}h {Math.floor((entry.duration % 3600) / 60)}m
                    </Text>
                  )}
                </View>
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
  clockCard: {
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 54,
    fontWeight: '800',
    marginVertical: Spacing.sm,
    letterSpacing: -1,
  },
  clockSubtext: {
    ...Typography.bodyMedium,
    marginBottom: Spacing.xl,
  },
  clockButton: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  clockButtonText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: 20,
    elevation: 2,
  },
  statLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    ...Typography.heading2,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  activityList: {
    borderRadius: 20,
    padding: Spacing.md,
    minHeight: 120,
  },
  emptyText: {
    ...Typography.bodyMedium,
  },
  activityItem: {
    paddingVertical: 14,
    paddingHorizontal: 4,
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
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
});
