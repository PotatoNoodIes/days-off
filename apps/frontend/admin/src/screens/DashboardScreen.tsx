import React, { useState, useMemo, useRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Animated, PanResponder, Dimensions, StatusBar } from 'react-native';
import { 
  useAdminStats,
  usePendingRequests,
  useAllUsers,
  useTheme,
  Input
} from '@time-sync/ui';
import { createStyles } from '../styles/screens/DashboardScreen.styles';
import { useRequestApproval } from '../../hooks/useRequestApproval';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 120;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;
const COLLAPSED_Y = SCREEN_HEIGHT - SHEET_MIN_HEIGHT;
const EXPANDED_Y = SCREEN_HEIGHT - SHEET_MAX_HEIGHT;

import { DashboardHeader } from '../components/DashboardHeader';
import { SideMenu } from '../components/SideMenu';
import { PendingRequestCard } from '../components/PendingRequestCard';
import { PTOCalendar, PTOCalendarHandle } from '../components/PTOCalendar';

export const DashboardScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
  
  const { refetch: refetchStats } = useAdminStats();
  const { requests: pendingRequests, setRequests: setPendingRequests } = usePendingRequests();
  const { users } = useAllUsers();
  
  const calendarRef = useRef<PTOCalendarHandle>(null);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [calendarEmployeeFilter, setCalendarEmployeeFilter] = useState<string | null>(null);
  const [calendarDepartmentFilter, setCalendarDepartmentFilter] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    // 1. Filter out SICK leave as requested
    let filtered = pendingRequests.filter(req => req.type !== 'SICK');

    // 2. Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => {
        const fullName = `${req.user?.firstName} ${req.user?.lastName}`.toLowerCase();
        return fullName.includes(query);
      });
    }

    return filtered;
  }, [pendingRequests, searchQuery]);

  const { handleApproval } = useRequestApproval((requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    
    refetchStats();
    
    calendarRef.current?.refetch();
  });

  const translateY = React.useRef(new Animated.Value(COLLAPSED_Y)).current;
  const lastSheetY = React.useRef(COLLAPSED_Y);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newY = lastSheetY.current + gestureState.dy;
        if (newY >= EXPANDED_Y && newY <= SCREEN_HEIGHT) {
           translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldExpand = gestureState.vy < -0.5 || gestureState.dy < -50;
        const targetY = shouldExpand ? EXPANDED_Y : COLLAPSED_Y;
        
        Animated.spring(translateY, {
          toValue: targetY,
          useNativeDriver: true,
          tension: 60,
          friction: 10
        }).start(() => {
          lastSheetY.current = targetY;
        });
      },
    })
  ).current;

  const sheetTranslateStyle = {
    top: 0,
    transform: [{ translateY }],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <DashboardHeader onMenuPress={() => setMenuVisible(true)} />

      <View style={styles.calendarContainer}>
        <PTOCalendar
          ref={calendarRef}
          filterEmployeeId={calendarEmployeeFilter}
          filterDepartment={calendarDepartmentFilter}
          onEmployeeChange={setCalendarEmployeeFilter}
          onDepartmentChange={setCalendarDepartmentFilter}
        />
      </View>

      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            backgroundColor: colors.surface, 
            transform: [{ translateY }],
          }
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.sheetHeader}>
          <View style={styles.handle} />
          <View style={styles.pendingSectionHeader}>
            <Text style={styles.sectionTitle}>
              Pending Requests ({pendingRequests.length})
            </Text>
          </View>
        </View>

        <View style={styles.sheetContent}>
          <Input
            placeholder="Search employee..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
            containerStyle={styles.searchContainer}
            inputWrapperStyle={styles.searchInputWrapper}
          />

          <ScrollView 
            style={styles.scrollViewContainer}
            contentContainerStyle={styles.requestsList} 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {filteredRequests.length === 0 ? (
              <View style={styles.emptyState}>
                 <Ionicons name="checkmark-circle-outline" size={60} color={colors.semantic.success} />
                 <Text style={styles.emptyTitle}>
                   {pendingRequests.length === 0 ? 'All caught up!' : 'No matching requests'}
                 </Text>
                 <Text style={styles.emptySubtitle}>
                    {pendingRequests.length === 0 ? 'You have no pending leave requests.' : 'Try a different search term.'}
                 </Text>
               </View>
            ) : (
               <>
                 {filteredRequests.map(req => (
                   <PendingRequestCard 
                      key={req.id} 
                      request={req} 
                      onApprove={(id) => handleApproval(id, 'APPROVED')}
                      onReject={(id) => handleApproval(id, 'REJECTED')}
                   />
                 ))}
               </>
            )}
          </ScrollView>
        </View>
      </Animated.View>

      <SideMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    </View>
  );
};