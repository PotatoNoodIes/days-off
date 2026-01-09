import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, adminApi, schedulesApi, useAuth, useTheme } from '@time-sync/ui';
import { useFocusEffect } from '@react-navigation/native';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';

export const ScheduleScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const start = startOfWeek(new Date(selectedWeek.getTime()), { weekStartsOn: 1 });
      const end = endOfWeek(new Date(selectedWeek.getTime()), { weekStartsOn: 1 });

      const res = await schedulesApi.getAll(start.toISOString(), end.toISOString());
      setSchedules(res.data);
    } catch (err) {
      console.error('Failed to fetch schedules', err);
    } finally {
      setLoading(false);
    }
  }, [selectedWeek]);

  const navigateWeek = (direction: 'next' | 'prev') => {
    const newDate = new Date(selectedWeek);
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setSelectedWeek(newDate);
  };

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [fetchSchedules])
  );

  const daysInRange = eachDayOfInterval({
    start: startOfWeek(new Date(selectedWeek.getTime()), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(selectedWeek.getTime()), { weekStartsOn: 1 }),
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={colors.primary[500]} />
          </TouchableOpacity>
          <Text style={[Typography.heading1, { color: colors.textPrimary }]}>My Schedule</Text>
        </View>
      </View>

      <View style={[styles.weekHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigateWeek('prev')} style={[styles.navButton, { backgroundColor: colors.primary[100] }]}>
          <Ionicons name="chevron-back" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.weekRange, { color: colors.textPrimary }]}>
            {format(daysInRange[0], 'MMM d')} - {format(daysInRange[6], 'MMM d, yyyy')}
          </Text>
          <Text style={[styles.weekSub, { color: colors.textSecondary }]}>Team Schedule</Text>
        </View>
        <TouchableOpacity onPress={() => navigateWeek('next')} style={[styles.navButton, { backgroundColor: colors.primary[100] }]}>
          <Ionicons name="chevron-forward" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : schedules.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="calendar-clear-outline" size={80} color={colors.border} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>All Clear!</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No shifts scheduled for this week. Enjoy your time off or check back later.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          {daysInRange.map((day) => {
            const daySchedules = schedules.filter(s => format(new Date(s.startTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <View key={day.toISOString()} style={[styles.daySection, isToday && { ...styles.todaySection, borderLeftColor: colors.primary[500] }]}>
                <View style={styles.dayHeader}>
                  <Text style={[styles.dayLabel, { color: isToday ? colors.primary[500] : colors.textSecondary }]}>{format(day, 'EEEE')}</Text>
                  <Text style={[styles.dayDate, { color: colors.textSecondary }]}>{format(day, 'MMM do')}</Text>
                </View>
                
                {daySchedules.length === 0 ? (
                  <View style={[styles.noShiftRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.noShiftText, { color: colors.textSecondary }]}>No shifts</Text>
                  </View>
                ) : (
                  daySchedules.map((schedule) => (
                    <View 
                      key={schedule.id} 
                      style={[
                        styles.shiftCard, 
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        schedule.userId === user?.id && { borderColor: colors.primary[500], backgroundColor: colors.primary[100] + '20' }
                      ]}
                    >
                      <View style={styles.shiftEmployee}>
                        <View style={[styles.avatarMini, { backgroundColor: colors.background, borderColor: colors.border }]}>
                          <Text style={[styles.avatarMiniText, { color: colors.primary[500] }]}>
                            {schedule.user.firstName[0]}{schedule.user.lastName[0]}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.shiftInfo}>
                        <Text style={[styles.employeeName, { color: colors.textPrimary }]}>
                          {schedule.user.firstName} {schedule.user.lastName} {schedule.userId === user?.id && '(You)'}
                        </Text>
                        <View style={styles.timeRow}>
                          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                          <Text style={[styles.shiftTime, { color: colors.textSecondary }]}>
                            {format(new Date(schedule.startTime), 'hh:mm aa')} - {format(new Date(schedule.endTime), 'hh:mm aa')}
                          </Text>
                        </View>
                        <Text style={[styles.shiftRole, { color: colors.textSecondary }]}>{schedule.role || 'Staff Member'}</Text>
                      </View>
                      <View style={styles.badgeContainer}>
                        <View style={[styles.typeBadge, { backgroundColor: colors.primary[100] }]}>
                          <Text style={[styles.typeText, { color: colors.primary[500] }]}>{schedule.type}</Text>
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
  },
  weekHeader: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekRange: {
    ...Typography.bodyLarge,
    fontWeight: '700',
  },
  weekSub: {
    ...Typography.caption,
    marginTop: 2,
  },
  daySection: {
    marginBottom: 20,
  },
  todaySection: {
    paddingLeft: 4,
    borderLeftWidth: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  dayLabel: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    width: 100,
  },
  dayDate: {
    ...Typography.caption,
  },
  shiftCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftInfo: {
    flex: 1,
  },
  shiftEmployee: {
    marginRight: 12,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarMiniText: {
    fontSize: 10,
    fontWeight: '700',
  },
  employeeName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shiftTime: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    marginLeft: 6,
  },
  shiftRole: {
    ...Typography.caption,
    marginLeft: 20,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noShiftRow: {
    padding: 12,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  noShiftText: {
    ...Typography.caption,
    textAlign: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    ...Typography.heading2,
    marginBottom: 8,
  },
  emptyText: {
    ...Typography.bodyMedium,
    textAlign: 'center',
  },
});
