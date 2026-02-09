import React, { useState, useMemo, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { 
  Spacing,
  useAdminStats,
  usePendingRequests,
  useAllUsers,
  useTheme,
  Typography,
  Input
} from '@time-sync/ui';
import { useRequestApproval } from '../../hooks/useRequestApproval';
import { Ionicons } from '@expo/vector-icons';
import { 
  Animated, 
  PanResponder, 
  Dimensions, 
  StatusBar
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 120;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;
const COLLAPSED_Y = SCREEN_HEIGHT - SHEET_MIN_HEIGHT;
const EXPANDED_Y = SCREEN_HEIGHT - SHEET_MAX_HEIGHT;

import { DashboardHeader } from '../components/DashboardHeader';
import { SideMenu } from '../components/SideMenu';
import { PendingRequestCard } from '../components/PendingRequestCard';
import { PTOCalendar, PTOCalendarHandle } from '../components/PTOCalendar';
import { CalendarFilters } from '../components/CalendarFilters';

export const DashboardScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            borderTopColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            borderTopWidth: 2,
          },
          sheetTranslateStyle
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.sheetHeader}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={styles.pendingSectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
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
            inputWrapperStyle={[
              styles.searchInputWrapper,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
            ]}
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
                 <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                   {pendingRequests.length === 0 ? 'All caught up!' : 'No matching requests'}
                 </Text>
                 <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
    marginTop: -Spacing.xl,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 30,
    zIndex: 1000,
    width: '100%',
  },
  sheetHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  pendingSectionHeader: {
    marginBottom: Spacing.sm,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading3,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchInputWrapper: {
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  requestsList: {
    paddingBottom: 40,
  },
  scrollViewContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...Typography.heading3,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
});