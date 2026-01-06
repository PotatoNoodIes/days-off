import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth, Colors, Typography } from '@time-sync/ui';
import { styles } from '../../styles/AppStyles';
import { useClockInOut } from '../../hooks/useClockInOut';
import { useAttendanceStatus } from '@time-sync/ui';
import { useRecentActivity } from '../../hooks/useRecentActivity';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={Typography.heading1}>Hi, {user?.firstName}</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Schedule')} 
            style={{ padding: 8, marginRight: 8 }}
          >
             <Ionicons name="calendar" size={24} color={Colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
             <Ionicons name="log-out-outline" size={24} color={Colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Clock Card */}
        <View style={styles.clockCard}>
          <View style={styles.statusBadge}>
            <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }], opacity: isClockedIn ? 1 : 0.5 }]} />
            <Text style={styles.statusText}>{isClockedIn ? 'Working Now' : 'Not Working'}</Text>
          </View>
          
          <Text style={styles.timeText}>{isClockedIn ? elapsedTime : '--:--:--'}</Text>
          <Text style={styles.clockSubtext}>
            {isClockedIn ? `In since ${clockInTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Ready to start your shift?'}
          </Text>

          <TouchableOpacity 
            style={[styles.clockButton, isClockedIn ? styles.clockButtonOut : styles.clockButtonIn]}
            onPress={() => toggleClock()}
            disabled={clockLoading}
          >
            {clockLoading ? (
              <ActivityIndicator color={isClockedIn ? Colors.semantic.error : "#fff"} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons 
                  name={isClockedIn ? "stop-circle" : "play-circle"} 
                  size={24} 
                  color={isClockedIn ? Colors.semantic.error : "#fff"} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.clockButtonText, isClockedIn && styles.clockButtonTextOut]}>
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.clockButton, { backgroundColor: Colors.primary[100], borderWidth: 0, paddingVertical: 14 }]}
          onPress={() => navigation.navigate('LeaveRequest')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} style={{ marginRight: 8 }} />
            <Text style={{ ...Typography.bodyLarge, fontWeight: '600', color: Colors.primary[500] }}>
              Request Leave
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>{status.weeklyHours || 0}h</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Leave Balance</Text>
            <Text style={styles.statValue}>{user?.leaveBalance || 0}d</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={Typography.heading2}>Recent Activity</Text>
        </View>

        <View style={styles.activityList}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary[500]} />
          ) : activity.length === 0 ? (
            <>
              <Ionicons name="documents-outline" size={40} color={Colors.neutral.border} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No recent activity found.</Text>
            </>
          ) : (
            activity.map((entry) => (
              <View key={entry.id} style={styles.activityItem}>
                <View style={styles.activityItemRow}>
                  <Text style={styles.activityItemText}>{entry.type}</Text>
                  <Text style={styles.activityItemText}>{entry.clockIn.toLocaleString()}</Text>
                </View>
                {entry.clockOut && (
                  <Text style={styles.activityItemText}>Out: {entry.clockOut.toLocaleTimeString()}</Text>
                )}
                {entry.duration && (
                  <Text style={styles.activityItemText}>
                    Duration: {Math.floor(entry.duration / 3600)}h {Math.floor((entry.duration % 3600) / 60)}m
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
