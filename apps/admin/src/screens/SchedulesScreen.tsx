import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, adminApi, schedulesApi } from '@time-sync/ui';
import { styles as globalStyles } from '../../styles/AppStyles';
import { useFocusEffect } from '@react-navigation/native';
import { format, startOfDay, endOfDay, addDays, subDays } from 'date-fns';

export const SchedulesScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<any[]>([]);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const start = startOfDay(new Date(selectedDate.getTime()));
      const end = endOfDay(new Date(selectedDate.getTime()));

      const res = await schedulesApi.getAll(start.toISOString(), end.toISOString());
      setSchedules(res.data);
    } catch (err) {
      console.error('Failed to fetch schedules', err);
      Alert.alert('Error', 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [fetchSchedules])
  );

  const changeDate = (amount: number) => {
    const nextDate = amount > 0 ? addDays(selectedDate, amount) : subDays(selectedDate, -amount);
    setSelectedDate(new Date(nextDate.getTime()));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Remove Shift",
      "Are you sure you want to delete this schedule entry?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await schedulesApi.delete(id);
              fetchSchedules();
            } catch (err) {
              Alert.alert("Error", "Failed to delete schedule");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={Colors.primary[500]} />
          </TouchableOpacity>
          <Text style={Typography.heading1}>Shift Schedules</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddEditSchedule')}
          style={{ backgroundColor: Colors.primary[500], padding: 8, borderRadius: 8 }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateArrow}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary[500]} />
        </TouchableOpacity>
        <View style={styles.dateInfo}>
          <Text style={styles.dateDay}>{format(selectedDate, 'EEEE')}</Text>
          <Text style={styles.dateString}>{format(selectedDate, 'MMM do, yyyy')}</Text>
        </View>
        <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateArrow}>
          <Ionicons name="chevron-forward" size={24} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : schedules.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Ionicons name="calendar-outline" size={80} color={Colors.neutral.border} />
          <Text style={{ marginTop: 16, textAlign: 'center', ...Typography.bodyLarge, color: Colors.neutral.textSecondary }}>
            No schedules found for this day.
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('AddEditSchedule', { initialDate: selectedDate.toISOString() })}
          >
            <Text style={styles.emptyStateButtonText}>Add First Shift</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          {schedules.map((schedule) => (
            <TouchableOpacity 
              key={schedule.id} 
              style={styles.card}
              onPress={() => navigation.navigate('AddEditSchedule', { schedule })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{schedule.user.firstName[0]}{schedule.user.lastName[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.nameText}>{schedule.user.firstName} {schedule.user.lastName}</Text>
                    <Text style={styles.roleText}>{schedule.role || 'General Staff'}</Text>
                  </View>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{schedule.type}</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.timeInfo}>
                  <Ionicons name="time-outline" size={16} color={Colors.primary[500]} />
                  <Text style={styles.timeText}>
                    {format(new Date(schedule.startTime), 'hh:mm aa')} - {format(new Date(schedule.endTime), 'hh:mm aa')}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(schedule.id);
                    }}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={Colors.semantic.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.neutral.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },
  dateArrow: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary[100],
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateDay: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
  },
  dateString: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginTop: 2,
  },
  emptyStateButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary[500],
  },
  nameText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
  },
  roleText: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.primary[100],
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary[500],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.background,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textSecondary,
    marginLeft: 6,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  deleteBtn: {
    padding: 4,
  },
});
