import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, adminApi, useTheme } from '@time-sync/ui';

export const TeamStatusScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [workforce, setWorkforce] = useState<any[]>([]);

  const fetchWorkforce = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getWorkforceStatus();
      setWorkforce(res.data);
    } catch (err) {
      console.error('Failed to fetch workforce status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkforce();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={colors.primary[500]} />
          </TouchableOpacity>
          <Text style={[Typography.heading1, { color: colors.textPrimary }]}>Team Status</Text>
        </View>
        <TouchableOpacity onPress={fetchWorkforce} disabled={loading}>
          <Ionicons name="refresh" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : workforce.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="people-outline" size={60} color={colors.border} />
          <Text style={{ marginTop: 16, color: colors.textSecondary }}>No employees found.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          <View style={[styles.table, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.tableHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
              <Text style={[styles.columnHeader, { flex: 2, color: colors.textSecondary }]}>Employee</Text>
              <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center', color: colors.textSecondary }]}>Status</Text>
            </View>

            {workforce.map((emp) => (
              <TouchableOpacity 
                key={emp.id} 
                style={[styles.tableRow, { borderBottomColor: colors.border }]}
                onPress={() => navigation.navigate('TimeAdjustment', { employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}` })}
              >
                <View style={{ flex: 2 }}>
                  <Text style={[styles.nameText, { color: colors.textPrimary }]}>{emp.firstName} {emp.lastName}</Text>
                  <Text style={[styles.roleText, { color: colors.textSecondary }]}>{emp.role}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Ionicons 
                    name={emp.isClockedIn ? "ellipse" : "ellipse-outline"} 
                    size={12} 
                    color={emp.isClockedIn ? colors.semantic.success : colors.textSecondary} 
                  />
                  <Text style={[styles.statusText, { color: emp.isClockedIn ? colors.semantic.success : colors.textSecondary }]}>
                    {emp.isClockedIn ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={[styles.hoursText, { color: colors.primary[500] }]}>{emp.hoursToday}h</Text>
                  {emp.isClockedIn && (
                    <Text style={[styles.sinceText, { color: colors.textSecondary }]}>Since {new Date(emp.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  table: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  columnHeader: {
    ...Typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  nameText: {
    ...Typography.bodyLarge,
    fontWeight: '600',
  },
  roleText: {
    ...Typography.caption,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  hoursText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
  },
  sinceText: {
    ...Typography.caption,
    fontSize: 10,
  },
});
