import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Typography, Spacing, useAllLeaveRequests, ThemeToggle, useAuth } from '@time-sync/ui';
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
        const startDate = new Date(req.startDate).toISOString().split('T')[0];
        const endDate = new Date(req.endDate).toISOString().split('T')[0];
        
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
          backgroundColor: colors.surface, 
          transform: [{ translateX: slideAnim }],
          borderRightColor: colors.border
        }
      ]}>
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={[Typography.heading2, { color: colors.textPrimary }]}>Menu</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('LeaveHistory')}>
                    <Ionicons name="time-outline" size={24} color={colors.primary[500]} style={styles.icon} />
                    <Text style={[styles.menuText, { color: colors.textPrimary }]}>Leave History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleDownloadTimesheet}>
                    <Ionicons name="download-outline" size={24} color={colors.primary[500]} style={styles.icon} />
                    <Text style={[styles.menuText, { color: colors.textPrimary }]}>Download Timesheet</Text>
                </TouchableOpacity>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'Calendar feature is under development')}>
                    <Ionicons name="calendar-outline" size={24} color={colors.textSecondary} style={styles.icon} />
                    <Text style={[styles.menuText, { color: colors.textSecondary }]}>Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('AddEmployee')}>
                    <Ionicons name="person-add-outline" size={24} color={colors.textSecondary} style={styles.icon} />
                    <Text style={[styles.menuText, { color: colors.textSecondary }]}>Add Employee</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem]} onPress={() => handleNavigate('AllEmployees')} >
                    <Ionicons name="people-outline" size={24} color={colors.textSecondary} style={styles.icon} />
                    <Text style={[ styles.menuText, { color: colors.textSecondary }]}> All Employees </Text>
                </TouchableOpacity>
              </View>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.themeRow}>
                    <Text style={[Typography.bodyMedium, { color: colors.textPrimary }]}>Appearance</Text>
                    <ThemeToggle />
                </View>
                <TouchableOpacity 
                    style={[styles.logoutBtn, { borderColor: colors.semantic.error }]} 
                    onPress={() => {
                        onClose();
                        logout();
                    }}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} style={{ marginRight: 8 }} />
                    <Text style={{ color: colors.semantic.error, fontWeight: '600', fontSize: 15 }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 320, // Slightly wider for better breathing room
    paddingTop: Platform.OS === 'android' ? 40 : 0, 
    borderRightWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  closeBtn: {
    padding: 8,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 16,
  },
  menuText: {
    ...Typography.bodyLarge, // Larger text for menu items
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  footer: {
      padding: Spacing.xl,
      borderTopWidth: 1,
  },
  themeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
  },
  logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderWidth: 1,
      borderRadius: 12,
  }
});
