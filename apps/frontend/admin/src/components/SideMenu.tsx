import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemeToggle, useAuth, useAllLeaveRequests } from '@time-sync/ui';
import { createStyles } from '../styles/components/SideMenu.styles';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { differenceInDays, parseISO } from 'date-fns';

const { width, height } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const SideMenu = ({ visible, onClose }: SideMenuProps) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  const { logout } = useAuth();
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-320)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const { requests: allRequests } = useAllLeaveRequests();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -320,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false);
      });
    }
  }, [visible]);

  const handleNavigate = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  const escapeCSV = (str: string) => {
    if (!str) return '';
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const handleDownloadTimesheet = async () => {
    onClose();
    const historyRequests = allRequests.filter(r => r.status !== 'PENDING');
    
    if (historyRequests.length === 0) {
      Alert.alert("No Data", "There are no approved/rejected requests to export.");
      return;
    }

    try {
      const headers = "Employee Name,Start Date,End Date,Reason,Description,Number of Days,Status\n";
      const rows = historyRequests.map(req => {
        const days = differenceInDays(parseISO(req.endDate), parseISO(req.startDate)) + 1;
        const name = `${req.user?.firstName} ${req.user?.lastName}`;
        const startDate = req.startDate; // Already YYYY-MM-DD
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
      const fileName = `timesheet_export_${new Date().getTime()}.csv`;

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
            dialogTitle: 'Download Timesheet',
            UTI: 'public.comma-separated-values-text',
          });
        }
      }
    } catch (error) {
      console.error('CSV Export failed:', error);
      Alert.alert("Export Failed", "An error occurred while generating the CSV file.");
    }
  };

  if (!isModalVisible && !visible) return null;

  return (
    <Modal transparent visible={isModalVisible} onRequestClose={onClose} animationType="none">
        
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

        <Animated.View style={[
          styles.container, 
          { 
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.header}>
                  <Text style={styles.title}>Menu</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('LeaveHistory')}>
                    <Ionicons name="time-outline" size={24} color={colors.primary[500]} style={styles.icon} />
                    <Text style={styles.menuText}>Leave History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleDownloadTimesheet}>
                    <Ionicons name="download-outline" size={24} color={colors.primary[500]} style={styles.icon} />
                    <Text style={styles.menuText}>Download Timesheet</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'Calendar feature is under development')}>
                    <Ionicons name="calendar-outline" size={24} color={colors.textSecondary} style={styles.icon} />
                    <Text style={styles.menuTextSecondary}>Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('AddEmployee')}>
                    <Ionicons name="person-add-outline" size={24} color={colors.textSecondary} style={styles.icon} />
                    <Text style={styles.menuTextSecondary}>Add Employee</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem]} onPress={() => handleNavigate('AllEmployees')} >
                    <Ionicons name="people-outline" size={24} color={colors.textSecondary} style={styles.icon} />
                    <Text style={styles.menuTextSecondary}> All Employees </Text>
                </TouchableOpacity>
              </View>

            <View style={styles.footer}>
                <View style={styles.themeRow}>
                    <Text style={styles.appearanceText}>Appearance</Text>
                    <ThemeToggle />
                </View>
                <TouchableOpacity 
                    style={styles.logoutBtn} 
                    onPress={() => {
                        onClose();
                        logout();
                    }}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};


