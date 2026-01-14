import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, schedulesApi, adminApi, useTheme, useAuth } from '@time-sync/ui';
import { useFocusEffect } from '@react-navigation/native';
import { format, startOfDay, endOfDay, addDays, subDays } from 'date-fns';

export const SchedulesScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<any[]>([]);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);
        const res = await schedulesApi.getAll(start.toISOString(), end.toISOString());
        setSchedules(res.data);
      } else {
        // Employee: read-only schedules
        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);
        const res = await adminApi.getSchedules(start.toISOString(), end.toISOString());
        setSchedules(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch schedules', err);
      if (isAdmin) Alert.alert('Error', 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, isAdmin]);

  useFocusEffect(useCallback(() => { fetchSchedules(); }, [fetchSchedules]));

  const changeDate = (amount: number) => {
    const nextDate = amount > 0 ? addDays(selectedDate, amount) : subDays(selectedDate, -amount);
    setSelectedDate(new Date(nextDate.getTime()));
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
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
            } catch {
              Alert.alert("Error", "Failed to delete schedule");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={colors.primary[500]} />
          </TouchableOpacity>
          <Text style={[Typography.heading1, { color: colors.textPrimary }]}>Shift Schedules</Text>
        </View>

        {isAdmin && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddEditSchedule')}
            style={{ backgroundColor: colors.primary[500], padding: 8, borderRadius: 8 }}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Date selector */}
      <View style={[styles.dateSelector, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={[styles.dateArrow, { backgroundColor: colors.primary[100] }]}>
          <Ionicons name="chevron-back" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
        <View style={styles.dateInfo}>
          <Text style={[styles.dateDay, { color: colors.textPrimary }]}>{format(selectedDate, 'EEEE')}</Text>
          <Text style={[styles.dateString, { color: colors.textSecondary }]}>{format(selectedDate, 'MMM do, yyyy')}</Text>
        </View>
        <TouchableOpacity onPress={() => changeDate(1)} style={[styles.dateArrow, { backgroundColor: colors.primary[100] }]}>
          <Ionicons name="chevron-forward" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Loading / Empty / Schedule list */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : schedules.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Ionicons name="calendar-outline" size={80} color={colors.border} />
          <Text style={{ marginTop: 16, textAlign: 'center', color: colors.textSecondary }}>
            No schedules found for this day.
          </Text>
          {isAdmin && (
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: colors.primary[500] }]}
              onPress={() => navigation.navigate('AddEditSchedule', { initialDate: selectedDate.toISOString() })}
            >
              <Text style={styles.emptyStateButtonText}>Add First Shift</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          {schedules.map((schedule) => (
            <TouchableOpacity 
              key={schedule.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => isAdmin && navigation.navigate('AddEditSchedule', { schedule })}
              activeOpacity={isAdmin ? 0.7 : 1}
            >
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <View style={[styles.avatar, { backgroundColor: colors.background }]}>
                    <Text style={[styles.avatarText, { color: colors.primary[500] }]}>
                      {schedule.user.firstName[0]}{schedule.user.lastName[0]}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.nameText, { color: colors.textPrimary }]}>
                      {schedule.user.firstName} {schedule.user.lastName}
                    </Text>
                    {isAdmin && <Text style={[styles.roleText, { color: colors.textSecondary }]}>{schedule.role || 'General Staff'}</Text>}
                  </View>
                </View>
                {isAdmin && (
                  <View style={[styles.typeBadge, { backgroundColor: colors.primary[100] }]}>
                    <Text style={[styles.typeText, { color: colors.primary[500] }]}>{schedule.type}</Text>
                  </View>
                )}
              </View>

              {isAdmin && (
                <View style={[styles.cardFooter, { borderTopColor: colors.background }]}>
                  <View style={styles.timeInfo}>
                    <Ionicons name="time-outline" size={16} color={colors.primary[500]} />
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                      {format(new Date(schedule.startTime), 'hh:mm aa')} - {format(new Date(schedule.endTime), 'hh:mm aa')}
                    </Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleDelete(schedule.id); }} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Employee read-only view */}
              {!isAdmin && (
                <View style={{ marginTop: 4 }}>
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                    {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <View style={[styles.typeBadge, { backgroundColor: colors.background }]}>
                    <Text style={[styles.typeText, { color: colors.textSecondary }]}>{schedule.type}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Styles (unchanged)
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: 20, justifyContent: 'space-between' },
  dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  dateArrow: { padding: 8, borderRadius: 8 },
  dateInfo: { alignItems: 'center' },
  dateDay: { ...Typography.bodyLarge, fontWeight: '700' },
  dateString: { ...Typography.caption, marginTop: 2 },
  emptyStateButton: { marginTop: 24, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  emptyStateButtonText: { color: '#fff', fontWeight: '700' },
  card: { borderRadius: 16, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 14, fontWeight: '700' },
  nameText: { ...Typography.bodyMedium, fontWeight: '700' },
  roleText: { ...Typography.caption },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  typeText: { fontSize: 10, fontWeight: '700' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1 },
  timeInfo: { flexDirection: 'row', alignItems: 'center' },
  timeText: { ...Typography.bodyMedium, marginLeft: 6, fontWeight: '600' },
  actions: { flexDirection: 'row' },
  deleteBtn: { padding: 4 },
});
