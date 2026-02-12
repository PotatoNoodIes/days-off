import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { 
  Card, 
  useAllLeaveRequests,
  useTheme,
  Button,
  formatLocalDate
} from '@time-sync/ui';
import { createStyles } from '../styles/screens/LeaveHistoryScreen.styles';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { differenceInDays, parseISO } from 'date-fns';

export const LeaveHistoryScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const { requests: allRequests } = useAllLeaveRequests();

  const historyRequests = allRequests.filter(r => r.status !== 'PENDING');

  const escapeCSV = (str: string) => {
    if (!str) return '';
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const exportCSV = async () => {
    if (historyRequests.length === 0) {
      Alert.alert("No Data", "There are no leave requests to export.");
      return;
    }

    try {
      const headers = "Employee Name,Start Date,End Date,Reason,Description,Number of Days,Status\n";
      const rows = historyRequests.map(req => {
        const days = differenceInDays(parseISO(req.endDate), parseISO(req.startDate)) + 1;
        const name = `${req.user?.firstName} ${req.user?.lastName}`;
        const startDate = req.startDate; // Backend already provides YYYY-MM-DD
        const endDate = req.endDate;
        
        return [
          escapeCSV(name),
          escapeCSV(startDate),
          escapeCSV(endDate),
          escapeCSV(req.reason || ''),
          escapeCSV(req.type),
          days,
          escapeCSV(req.status)
        ].join(',');
      }).join("\n");
      
      const csvContent = headers + rows;
      const fileName = `leave_export_${new Date().getTime()}.csv`;

      if (Platform.OS === 'web') {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }

      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: 'utf8' });

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName.replace('.csv', ''),
            'text/csv'
          );
          await FileSystem.writeAsStringAsync(destinationUri, csvContent, { encoding: 'utf8' });
          Alert.alert("Success", "File saved successfully");
        }
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Export Leave Data',
            UTI: 'public.comma-separated-values-text',
          });
        }
      }
    } catch (error) {
      console.error('CSV Export failed:', error);
      Alert.alert("Export Failed", "An error occurred while generating the CSV file.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave History</Text>
        <Button 
          title="Export CSV" 
          onPress={exportCSV} 
          variant="ghost"
          style={styles.exportButton}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {historyRequests.length === 0 ? (
          <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={80} color={colors.border} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No requests in history</Text>
          </View>
        ) : (
          historyRequests.map(req => (
            <Card key={req.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View>
                  <Text style={styles.employeeName}>
                    {req.user?.firstName} {req.user?.lastName}
                  </Text>
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar" size={14} color={colors.textSecondary} />
                    <Text style={styles.requestDates}>
                      {formatLocalDate(req.startDate)} - {formatLocalDate(req.endDate)}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: req.status === 'APPROVED' ? colors.semantic.success : colors.semantic.error }]} />
                  <Text style={[styles.statusText, { color: req.status === 'APPROVED' ? colors.semantic.success : colors.semantic.error }]}>
                    {req.status}
                  </Text>
                </View>
              </View>
              <View style={styles.reasonRow}>
                 <Text style={styles.requestReason}>{req.reason || 'No reason provided'}</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};


