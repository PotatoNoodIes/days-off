import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, adminApi, useAuth } from '@time-sync/ui';
import { styles as globalStyles } from '../../styles/AppStyles';
import { useFocusEffect } from '@react-navigation/native';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';

export const ScheduleScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const start = startOfWeek(new Date(selectedWeek.getTime()));
      const end = endOfWeek(new Date(selectedWeek.getTime()));

      const res = await adminApi.getSchedules(start.toISOString(), end.toISOString());
      
      // Filter for current user's schedule
      const mySchedules = res.data.filter((s: any) => s.userId === user?.id);
      setSchedules(mySchedules);
    } catch (err) {
      console.error('Failed to fetch schedules', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedWeek]);

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [fetchSchedules])
  );

  const daysInRange = eachDayOfInterval({
    start: startOfWeek(new Date(selectedWeek.getTime())),
    end: endOfWeek(new Date(selectedWeek.getTime())),
  });

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={Colors.primary[500]} />
          </TouchableOpacity>
          <Text style={Typography.heading1}>My Schedule</Text>
        </View>
      </View>

      <View style={styles.weekHeader}>
        <Text style={styles.weekRange}>
          {format(daysInRange[0], 'MMM d')} - {format(daysInRange[6], 'MMM d, yyyy')}
        </Text>
        <Text style={styles.weekSub}>This Week's Shifts</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : schedules.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="calendar-clear-outline" size={80} color={Colors.neutral.border} />
          </View>
          <Text style={styles.emptyTitle}>All Clear!</Text>
          <Text style={styles.emptyText}>No shifts scheduled for this week. Enjoy your time off or check back later.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          {daysInRange.map((day) => {
            const daySchedules = schedules.filter(s => format(new Date(s.startTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <View key={day.toISOString()} style={[styles.daySection, isToday && styles.todaySection]}>
                <View style={styles.dayHeader}>
                  <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>{format(day, 'EEEE')}</Text>
                  <Text style={styles.dayDate}>{format(day, 'MMM do')}</Text>
                </View>
                
                {daySchedules.length === 0 ? (
                  <View style={styles.noShiftRow}>
                    <Text style={styles.noShiftText}>No shifts</Text>
                  </View>
                ) : (
                  daySchedules.map((schedule) => (
                    <View key={schedule.id} style={styles.shiftCard}>
                      <View style={styles.shiftInfo}>
                        <View style={styles.timeRow}>
                          <Ionicons name="time" size={16} color={Colors.primary[500]} />
                          <Text style={styles.shiftTime}>
                            {format(new Date(schedule.startTime), 'hh:mm aa')} - {format(new Date(schedule.endTime), 'hh:mm aa')}
                          </Text>
                        </View>
                        <Text style={styles.shiftRole}>{schedule.role || 'Staff Member'}</Text>
                      </View>
                      <View style={styles.badgeContainer}>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeText}>{schedule.type}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  weekHeader: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.neutral.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },
  weekRange: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
  },
  weekSub: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginTop: 2,
  },
  daySection: {
    marginBottom: 20,
  },
  todaySection: {
    paddingLeft: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[500],
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  dayLabel: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.neutral.textSecondary,
    width: 100,
  },
  todayLabel: {
    color: Colors.primary[500],
  },
  dayDate: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
  },
  shiftCard: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.surface,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftInfo: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shiftTime: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    marginLeft: 6,
  },
  shiftRole: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginLeft: 22,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  typeBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary[500],
  },
  noShiftRow: {
    padding: 12,
    backgroundColor: Colors.neutral.background,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  noShiftText: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    textAlign: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neutral.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    ...Typography.heading2,
    color: Colors.neutral.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textSecondary,
    textAlign: 'center',
  },
});
