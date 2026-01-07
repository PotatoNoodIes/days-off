import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, adminApi, useTheme } from '@time-sync/ui';

export const SchedulesScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
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
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to start of week (Monday)
        start = new Date(now.setDate(diff));
        start.setHours(0,0,0,0);
        end = new Date(now.setDate(diff + 6));
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={colors.primary[500]} />
          </TouchableOpacity>
          <Text style={[Typography.heading1, { color: colors.textPrimary }]}>Shift Schedules</Text>
        </View>
      </View>

      <View style={navStyles.tabContainer}>
        <TouchableOpacity 
          style={[
            navStyles.tab, 
            { backgroundColor: colors.surface },
            view === 'today' && { backgroundColor: colors.primary[500] }
          ]}
          onPress={() => setView('today')}
        >
          <Text style={[
            navStyles.tabText, 
            { color: colors.textSecondary },
            view === 'today' && { color: '#fff' }
          ]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            navStyles.tab, 
            { backgroundColor: colors.surface },
            view === 'week' && { backgroundColor: colors.primary[500] }
          ]}
          onPress={() => setView('week')}
        >
          <Text style={[
            navStyles.tabText, 
            { color: colors.textSecondary },
            view === 'week' && { color: '#fff' }
          ]}>This Week</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : schedules.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="calendar-outline" size={60} color={colors.border} />
          <Text style={{ marginTop: 16, color: colors.textSecondary }}>No schedules found for this period.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          {schedules.map((schedule) => (
            <View key={schedule.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary[100] }]}>
                 <Ionicons name="time-outline" size={24} color={colors.primary[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.nameText, { color: colors.textPrimary }]}>{schedule.user.firstName} {schedule.user.lastName}</Text>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View style={[styles.typeBadge, { backgroundColor: colors.background }]}>
                  <Text style={[styles.typeText, { color: colors.textSecondary }]}>{schedule.type}</Text>
                </View>
              </View>
              {view === 'week' && (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.dateText, { color: colors.primary[500] }]}>
                    {new Date(schedule.startTime).toLocaleDateString([], { weekday: 'short', day: 'numeric' })}
                  </Text>
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
  },
  tabText: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  nameText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
  },
  timeText: {
    ...Typography.bodyMedium,
    marginVertical: 2,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  typeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  dateText: {
    ...Typography.caption,
    fontWeight: '700',
  },
});
