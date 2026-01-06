import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, adminApi } from '@time-sync/ui';
import { styles as globalStyles } from '../../styles/AppStyles';

export const SchedulesScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'today' | 'week'>('today');
  const [schedules, setSchedules] = useState<any[]>([]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const now = new Date();
      let start, end;

      if (view === 'today') {
        start = new Date(now.setHours(0,0,0,0));
        end = new Date(now.setHours(23,59,59,999));
      } else {
        const first = now.getDate() - now.getDay();
        start = new Date(now.setDate(first));
        start.setHours(0,0,0,0);
        end = new Date(now.setDate(first + 6));
        end.setHours(23,59,59,999);
      }

      const res = await adminApi.getSchedules(start.toISOString(), end.toISOString());
      setSchedules(res.data);
    } catch (err) {
      console.error('Failed to fetch schedules', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [view]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={Colors.primary[500]} />
          </TouchableOpacity>
          <Text style={Typography.heading1}>Shift Schedules</Text>
        </View>
      </View>

      <View style={navStyles.tabContainer}>
        <TouchableOpacity 
          style={[navStyles.tab, view === 'today' && navStyles.activeTab]}
          onPress={() => setView('today')}
        >
          <Text style={[navStyles.tabText, view === 'today' && navStyles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[navStyles.tab, view === 'week' && navStyles.activeTab]}
          onPress={() => setView('week')}
        >
          <Text style={[navStyles.tabText, view === 'week' && navStyles.activeTabText]}>This Week</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : schedules.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="calendar-outline" size={60} color={Colors.neutral.border} />
          <Text style={{ marginTop: 16, color: Colors.neutral.textSecondary }}>No schedules found for this period.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          {schedules.map((schedule) => (
            <View key={schedule.id} style={styles.card}>
              <View style={styles.iconContainer}>
                 <Ionicons name="time-outline" size={24} color={Colors.primary[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nameText}>{schedule.user.firstName} {schedule.user.lastName}</Text>
                <Text style={styles.timeText}>
                  {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{schedule.type}</Text>
                </View>
              </View>
              {view === 'week' && (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.dateText}>{new Date(schedule.startTime).toLocaleDateString([], { weekday: 'short', day: 'numeric' })}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const navStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.neutral.surface,
  },
  activeTab: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  nameText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
  },
  timeText: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textSecondary,
    marginVertical: 2,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.neutral.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  typeText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.neutral.textSecondary,
    fontWeight: '700',
  },
  dateText: {
    ...Typography.caption,
    color: Colors.primary[500],
    fontWeight: '700',
  },
});
