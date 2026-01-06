import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, adminApi } from '@time-sync/ui';
import { styles as globalStyles } from '../../styles/AppStyles';

export const WorkforceStatusScreen = ({ navigation }: any) => {
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
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.md }}>
            <Ionicons name="arrow-back" size={28} color={Colors.primary[500]} />
          </TouchableOpacity>
          <Text style={Typography.heading1}>Live Workforce</Text>
        </View>
        <TouchableOpacity onPress={fetchWorkforce} disabled={loading}>
          <Ionicons name="refresh" size={24} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : workforce.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="people-outline" size={60} color={Colors.neutral.border} />
          <Text style={{ marginTop: 16, color: Colors.neutral.textSecondary }}>No employees found.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl }}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { flex: 2 }]}>Employee</Text>
              <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Status</Text>
              <Text style={[styles.columnHeader, { flex: 1, textAlign: 'right' }]}>Hours Today</Text>
            </View>

            {workforce.map((emp) => (
              <TouchableOpacity 
                key={emp.id} 
                style={styles.tableRow}
                onPress={() => navigation.navigate('TimeAdjustment', { employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}` })}
              >
                <View style={{ flex: 2 }}>
                  <Text style={styles.nameText}>{emp.firstName} {emp.lastName}</Text>
                  <Text style={styles.roleText}>{emp.role}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Ionicons 
                    name={emp.isClockedIn ? "ellipse" : "ellipse-outline"} 
                    size={12} 
                    color={emp.isClockedIn ? Colors.semantic.success : Colors.neutral.textSecondary} 
                  />
                  <Text style={[styles.statusText, { color: emp.isClockedIn ? Colors.semantic.success : Colors.neutral.textSecondary }]}>
                    {emp.isClockedIn ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.hoursText}>{emp.hoursToday}h</Text>
                  {emp.isClockedIn && (
                    <Text style={styles.sinceText}>Since {new Date(emp.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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
  table: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.neutral.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },
  columnHeader: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.neutral.textSecondary,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    alignItems: 'center',
  },
  nameText: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
  },
  roleText: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  hoursText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: Colors.primary[500],
  },
  sinceText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.neutral.textSecondary,
  },
});
