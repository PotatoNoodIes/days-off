import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuth, useTheme, ThemeToggle, useLeaveRequests, formatLocalDate } from '@time-sync/ui';
import { createStyles } from '../styles/screens/DashboardScreen.styles';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { differenceInDays, parseISO } from 'date-fns';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, logout, refreshProfile } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const { requests: activity, loading, refetch } = useLeaveRequests();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refreshProfile();
    }, [refetch, refreshProfile])
  );

  const calculateDays = (start: string, end: string) => {
    return differenceInDays(parseISO(end), parseISO(start)) + 1;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return colors.semantic.success;
      case 'REJECTED': return colors.semantic.error;
      default: return colors.semantic.warning;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hi, {user?.firstName}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
             <Ionicons name="log-out-outline" size={24} color={colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Leave Balance Card */}
        <View style={styles.balanceCard}>
           <Text style={styles.statLabel}>Total Leave Balance</Text>
           <Text style={styles.statValue}>{user?.currentPtoBalance || 0} Days</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.requestButton}
          onPress={() => navigation.navigate('LeaveRequest')}
        >
          <View style={styles.requestButtonContent}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.requestButtonIcon} />
            <Text style={styles.requestButtonText}>
              Request New Leave
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Leave History</Text>
        </View>

        <View style={styles.activityList}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary[500]} style={styles.loadingIndicator} />
          ) : activity.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="documents-outline" size={40} color={colors.border} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No leave history found.</Text>
            </View>
          ) : (
            activity.map((entry) => (
              <View key={entry.id} style={styles.activityItem}>
                <View style={styles.activityItemRow}>
                  <Text style={styles.activityItemType}>{entry.type}</Text>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(entry.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(entry.status) }]}>
                      {entry.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityItemRow}>
                  <Text style={styles.activityItemDates}>
                    {formatLocalDate(entry.startDate)} - {formatLocalDate(entry.endDate)}
                  </Text>
                  <Text style={styles.activityItemDays}>
                    {calculateDays(entry.startDate, entry.endDate)} Days
                  </Text>
                </View>
                {entry.reason && (
                  <Text style={styles.reasonText} numberOfLines={1}>
                    {entry.reason}
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


