import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useTheme,
  useAllLeaveRequests,
  useAllUsers,
  Spacing,
  Typography,
  LeaveRequest,
} from '@time-sync/ui';
import { CalendarFilters } from './CalendarFilters';

const EMPLOYEE_COLORS = [
  '#E0F2F1', '#FCE4EC', '#E3F2FD', '#F1F8E9', '#FFFDE7', '#F3E5F5', '#E8EAF6', '#E0F7FA',
];

const PTO_TEXT_COLORS = [
  '#00695C', '#C2185B', '#1565C0', '#33691E', '#F57F17', '#6A1B9A', '#283593', '#006064',
];

export type CalendarView = 'monthly' | 'weekly' | 'daily';

export interface PTOCalendarHandle {
  refetch: () => void;
}

interface PTOCalendarProps {
  filterEmployeeId?: string | null;
  filterDepartment?: string | null;
  onEmployeeChange: (id: string | null) => void;
  onDepartmentChange: (dept: string | null) => void;
}

interface DayPTOData {
  date: Date;
  requests: Array<LeaveRequest & { color: string; textColor: string }>;
};

const PTOCalendar = forwardRef<PTOCalendarHandle, PTOCalendarProps>(({
  filterEmployeeId,
  filterDepartment,
  onEmployeeChange,
  onDepartmentChange,
}, ref) => {
  const { colors, isDark } = useTheme();
  
  const { requests: allRequests, refetch } = useAllLeaveRequests(); 
  
  const { users } = useAllUsers();
  const [showFilters, setShowFilters] = useState(false);

  const [viewMode, setViewMode] = useState<CalendarView>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showViewPicker, setShowViewPicker] = useState(false);

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const resetToToday = () => {
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  const filteredRequests = useMemo(() => {
    return allRequests.filter((req) => {
      if (req.status !== 'APPROVED') return false;
      if (filterEmployeeId && req.userId !== filterEmployeeId) return false;
      if (filterDepartment && req.user?.department !== filterDepartment) return false;
      return true;
    });
  }, [allRequests, filterEmployeeId, filterDepartment]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const isDateInRange = (date: Date, startDate: string, endDate: string) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
  };

  const getPTOForDate = (date: Date): DayPTOData => {
    const requests = filteredRequests
      .filter((req) => isDateInRange(date, req.startDate, req.endDate))
      .map((req) => {
        const colorIndex = users.findIndex(u => u.id === req.userId) % EMPLOYEE_COLORS.length;
        return {
          ...req,
          color: EMPLOYEE_COLORS[colorIndex],
          textColor: PTO_TEXT_COLORS[colorIndex],
        };
      });
    return { date, requests };
  };

  const getCurrentWeekDays = () => {
    const startOfWeek = new Date(currentYear, currentMonth, 1);
    const refDate = (currentMonth === now.getMonth() && currentYear === now.getFullYear()) ? now : startOfWeek;
    const dayOfWeek = refDate.getDay();
    const sunday = new Date(refDate);
    sunday.setDate(refDate.getDate() - dayOfWeek);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const renderPTOSquare = (
    request: LeaveRequest & { color: string; textColor: string },
    isCompact: boolean = false
  ) => {
    const userName = request.user?.firstName || 'Unknown';
    return (
      <View
        key={request.id}
        style={[styles.ptoSquare, { backgroundColor: request.color }, isCompact && styles.ptoSquareCompact]}
      >
        <Text style={[styles.ptoSquareText, { color: request.textColor }]} numberOfLines={1}>
          {userName}
        </Text>
      </View>
    );
  };

  const renderDayCell = (day: number | null, isCurrentMonth: boolean = true) => {
    if (!day) return <View key={`empty-${Math.random()}`} style={styles.dayCell} />;

    const date = new Date(currentYear, currentMonth, day);
    const ptoData = getPTOForDate(date);
    const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();

    return (
      <TouchableOpacity
        key={`day-${day}`}
        style={[
          styles.dayCell,
          isToday && { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)' },
          selectedDate?.getDate() === day && { 
            backgroundColor: colors.primary[500] + '15',
            borderColor: colors.primary[500],
            borderWidth: 1,
            borderRadius: 14,
          },
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <View style={[styles.dayNumberContainer, selectedDate?.getDate() === day && { backgroundColor: colors.primary[500], borderRadius: 12 }]}>
          <Text
            style={[
              styles.dayNumber,
              { color: isCurrentMonth ? colors.textPrimary : colors.textSecondary },
              isToday && { color: colors.primary[500], fontWeight: '900' },
              selectedDate?.getDate() === day && { color: '#fff', fontWeight: '900' },
            ]}
          >
            {day}
          </Text>
        </View>
        <View style={styles.ptoContainer}>
          {ptoData.requests.slice(0, 3).map((req) => renderPTOSquare(req, true))}
          {ptoData.requests.length > 3 && (
            <View style={styles.moreIndicatorContainer}>
               <Text style={[styles.moreIndicator, { color: colors.textSecondary }]}>
                +{ptoData.requests.length - 3}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) currentWeek.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) currentWeek.push(null);
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <View style={styles.monthGrid}>
        <View style={[styles.weekDaysRow, { borderBottomColor: colors.border }]}>
          {weekDays.map((day) => (
            <Text key={day} style={[styles.weekDayLabel, { color: colors.textSecondary }]}>{day}</Text>
          ))}
        </View>
        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.weekRow}>
            {week.map((day) => renderDayCell(day))}
          </View>
        ))}
      </View>
    );
  };

  const renderWeeklyView = () => {
    const weekDays = getCurrentWeekDays();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <ScrollView horizontal={false} style={styles.weeklyContainer} showsVerticalScrollIndicator={false}>
        {weekDays.map((date, index) => {
          const ptoData = getPTOForDate(date);
          const isToday = date.toDateString() === now.toDateString();

          return (
            <TouchableOpacity
              key={`weekday-${index}`}
              style={[styles.weeklyDayRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }, isToday && { backgroundColor: isDark ? 'rgba(255, 102, 204, 0.05)' : 'rgba(255, 102, 204, 0.03)' }]}
              onPress={() => setSelectedDate(date)}
            >
              <View style={styles.weeklyDayHeader}>
                <View style={[styles.weeklyBadge, { backgroundColor: isToday ? '#FF66CC' : (isDark ? colors.primary[900] : colors.primary[100]) }]}>
                  <Text style={[styles.weeklyDayNum, { color: isToday ? '#fff' : (isDark ? colors.primary[400] : colors.primary[500]) }]}>{date.getDate()}</Text>
                </View>
                <Text style={[styles.weeklyDayLabel, { color: isToday ? colors.textPrimary : colors.textSecondary }]}>{dayNames[date.getDay()]}</Text>
              </View>
              <View style={styles.weeklyContent}>
                {ptoData.requests.length > 0 ? (
                  <View style={styles.weeklySquaresContainer}>
                    {ptoData.requests.map((req) => renderPTOSquare(req, false))}
                  </View>
                ) : (
                  <Text style={[styles.weeklyEmptyText, { color: colors.textSecondary }]}>No PTO scheduled</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderDailyView = () => {
    const displayDate = selectedDate || (currentMonth === now.getMonth() && currentYear === now.getFullYear() ? now : new Date(currentYear, currentMonth, 1));
    const ptoData = getPTOForDate(displayDate);

    return (
      <View style={styles.dailyView}>
        <Text style={[styles.dailyDateTitle, { color: colors.textPrimary }]}>
          {displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <ScrollView style={styles.dailyPTOList}>
          {ptoData.requests.length > 0 ? (
            ptoData.requests.map((req) => (
              <View key={req.id} style={[styles.dailyPTOCard, { backgroundColor: colors.surface, borderLeftColor: req.color }]}>
                <View style={styles.dailyPTOInfo}>
                  <Text style={[styles.dailyPTOName, { color: colors.textPrimary }]}>{req.user?.firstName} {req.user?.lastName}</Text>
                  <View style={styles.dailyPTODetails}>
                    <View style={[styles.leaveTypeBadge, { backgroundColor: req.status === 'PENDING' ? (isDark ? colors.semantic.warning + '30' : colors.semantic.warning + '20') : colors.primary[100] }]}>
                      <Text style={[styles.leaveTypeText, { color: req.status === 'PENDING' ? colors.semantic.warning : colors.primary[500] }]}>{req.type}</Text>
                    </View>
                    {req.status === 'PENDING' && <Text style={[styles.pendingLabel, { color: colors.semantic.warning }]}>Pending</Text>}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noPTOContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.noPTOText, { color: colors.textSecondary }]}>No PTO scheduled for today</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderDatePopup = () => {
    if (!selectedDate) return null;
    const ptoData = getPTOForDate(selectedDate);

    return (
      <Modal visible={!!selectedDate} transparent animationType="fade">
        <TouchableOpacity style={styles.popupOverlay} activeOpacity={1} onPress={() => setSelectedDate(null)}>
          <View style={[styles.popupContent, { backgroundColor: colors.surface }]} onStartShouldSetResponder={() => true}>
            <View style={styles.popupHeader}>
              <Text style={[styles.popupTitle, { color: colors.textPrimary }]}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => setSelectedDate(null)}><Ionicons name="close" size={24} color={colors.textSecondary} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.popupList}>
              {ptoData.requests.length > 0 ? (
                ptoData.requests.map((req) => (
                  <View key={req.id} style={[styles.popupItem, { borderLeftColor: req.color }]}>
                    <View style={[styles.popupColorDot, { backgroundColor: req.color }]} />
                    <View style={styles.popupItemInfo}>
                      <Text style={[styles.popupItemName, { color: colors.textPrimary }]}>{req.user?.firstName} {req.user?.lastName}</Text>
                      <View style={styles.popupItemMeta}>
                        <Text style={[styles.popupItemType, { color: colors.textSecondary }]}>{req.type}</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No PTO on this date</Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderViewPicker = () => (
    <Modal visible={showViewPicker} transparent animationType="fade">
      <TouchableOpacity style={styles.popupOverlay} activeOpacity={1} onPress={() => setShowViewPicker(false)}>
        <View style={[styles.viewPickerContent, { backgroundColor: colors.surface }]} onStartShouldSetResponder={() => true}>
          {(['monthly', 'weekly', 'daily'] as CalendarView[]).map((view) => (
            <TouchableOpacity
              key={view}
              style={[styles.viewPickerOption, viewMode === view && { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }]}
              onPress={() => { setViewMode(view); setShowViewPicker(false); }}
            >
              <Ionicons name={view === 'monthly' ? 'calendar' : view === 'weekly' ? 'calendar-outline' : 'today'} size={20} color={viewMode === view ? colors.primary[500] : colors.textSecondary} />
              <Text style={[styles.viewPickerText, { color: viewMode === view ? colors.primary[500] : colors.textPrimary }]}>{view.charAt(0).toUpperCase() + view.slice(1)}</Text>
              {viewMode === view && <Ionicons name="checkmark" size={20} color={colors.primary[500]} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity style={styles.headerLeft} onPress={resetToToday}>
          <Text style={[styles.monthYearText, { color: colors.textPrimary }]}>{monthNames[currentMonth]} {currentYear}</Text>
        </TouchableOpacity>
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}><Ionicons name="chevron-back" size={20} color={colors.textSecondary} /></TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}><Ionicons name="chevron-forward" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(true)}>
            <Ionicons name="funnel-outline" size={22} color={colors.textSecondary} />
            {(filterEmployeeId || filterDepartment) && <View style={[styles.activeDot, { backgroundColor: colors.primary[500] }]} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowViewPicker(true)}>
            <Ionicons name="calendar-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'monthly' && renderMonthlyView()}
      {viewMode === 'weekly' && renderWeeklyView()}
      {viewMode === 'daily' && renderDailyView()}

      {renderDatePopup()}
      {renderViewPicker()}

      <CalendarFilters
        selectedEmployeeId={filterEmployeeId || null}
        selectedDepartment={filterDepartment || null}
        onEmployeeChange={onEmployeeChange}
        onDepartmentChange={onDepartmentChange}
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  headerLeft: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  monthYearText: { ...Typography.heading2, fontSize: 22, fontWeight: '900', letterSpacing: -1 },
  navButtons: { flexDirection: 'row', gap: 12, alignItems: 'center', marginLeft: 4 },
  navBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)' },
  iconBtn: { position: 'relative', padding: 8, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 12 },
  activeDot: { position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: 3 },
  monthGrid: { width: '100%' },
  weekDaysRow: { flexDirection: 'row', paddingBottom: 4, borderBottomWidth: 0.5, marginBottom: 8, paddingHorizontal: 16, opacity: 0.5 },
  weekDayLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 },
  weekRow: { flexDirection: 'row' },
  dayCell: { flex: 1, minHeight: 80, padding: 4, borderRadius: 16, alignItems: 'center', margin: 2, backgroundColor: 'rgba(0,0,0,0.015)', borderWidth: 0 },
  dayNumberContainer: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  dayNumber: { fontSize: 13, fontWeight: '700', letterSpacing: -0.5 },
  ptoContainer: { flex: 1, width: '100%', gap: 2 },
  ptoSquare: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginVertical: 1, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  ptoSquareCompact: { paddingHorizontal: 2, paddingVertical: 1 },
  ptoSquareText: { fontSize: 10, fontWeight: '800', letterSpacing: -0.1 },
  moreIndicatorContainer: { marginTop: 2, alignSelf: 'center' },
  moreIndicator: { fontSize: 9, fontWeight: '700', opacity: 0.6 },
  weeklyContainer: { maxHeight: 500 },
  weeklyDayRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1 },
  weeklyDayHeader: { width: 100, alignItems: 'center', gap: 4 },
  weeklyBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  weeklyDayNum: { fontSize: 16, fontWeight: '800' },
  weeklyDayLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  weeklyContent: { flex: 1, paddingLeft: Spacing.md },
  weeklySquaresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  weeklyEmptyText: { fontSize: 13, fontStyle: 'italic', opacity: 0.6 },
  dailyView: { minHeight: 200 },
  dailyDateTitle: { ...Typography.heading2, marginBottom: Spacing.md },
  dailyPTOList: { maxHeight: 300 },
  dailyPTOCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.sm, borderLeftWidth: 4 },
  dailyPTOInfo: { flex: 1 },
  dailyPTOName: { ...Typography.bodyLarge, fontWeight: '600', marginBottom: 4 },
  dailyPTODetails: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  leaveTypeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  leaveTypeText: { fontSize: 12, fontWeight: '600' },
  pendingLabel: { fontSize: 12, fontWeight: '500' },
  noPTOContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl },
  noPTOText: { marginTop: Spacing.sm, ...Typography.bodyMedium },
  popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  popupContent: { width: '100%', maxWidth: 400, borderRadius: 16, padding: Spacing.lg, maxHeight: '60%' },
  popupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  popupTitle: { ...Typography.heading3 },
  popupList: { maxHeight: 300 },
  popupItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderLeftWidth: 3, paddingLeft: Spacing.sm, marginBottom: Spacing.xs },
  popupColorDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.sm },
  popupItemInfo: { flex: 1 },
  popupItemName: { ...Typography.bodyMedium, fontWeight: '600' },
  popupItemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  popupItemType: { ...Typography.caption },
  pendingBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  noDataText: { textAlign: 'center', ...Typography.bodyMedium, paddingVertical: Spacing.lg },
  viewPickerContent: { borderRadius: 12, padding: Spacing.sm, minWidth: 180 },
  viewPickerOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: 8, gap: 12 },
  viewPickerText: { flex: 1, ...Typography.bodyMedium, fontWeight: '500' },
});

export { PTOCalendar };