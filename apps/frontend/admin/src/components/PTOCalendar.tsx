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
import { createStyles } from '../styles/components/PTOCalendar.styles';
import {
  useTheme,
  useAllLeaveRequests,
  useAllUsers,
  Spacing,
  Typography,
  LeaveRequest,
  parseLocalDate,
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

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  const now = new Date();
  const [anchorDate, setAnchorDate] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate()));

  const handlePrev = () => {
    setAnchorDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'monthly') {
        d.setMonth(d.getMonth() - 1);
      } else if (viewMode === 'weekly') {
        d.setDate(d.getDate() - 7);
      } else {
        d.setDate(d.getDate() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setAnchorDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'monthly') {
        d.setMonth(d.getMonth() + 1);
      } else if (viewMode === 'weekly') {
        d.setDate(d.getDate() + 7);
      } else {
        d.setDate(d.getDate() + 1);
      }
      return d;
    });
  };

  const resetToToday = () => {
    setAnchorDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  const filteredRequests = useMemo(() => {
    return allRequests.filter((req) => {
      if (req.status !== 'APPROVED') return false;
      if (filterEmployeeId && req.userId !== filterEmployeeId) return false;
      if (filterDepartment && req.user?.department?.name !== filterDepartment) return false;
      return true;
    });
  }, [allRequests, filterEmployeeId, filterDepartment]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const isDateInRange = (date: Date, startDateStr: string, endDateStr: string) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = parseLocalDate(startDateStr);
    const end = parseLocalDate(endDateStr);
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
    const refDate = anchorDate;
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
    const isMonthly = viewMode === 'monthly';
    const userName = isMonthly
      ? (request.user?.firstName || 'Unknown')
      : (`${request.user?.firstName} ${request.user?.lastName}`.trim() || 'Unknown');

    return (
      <View
        key={request.id}
        style={[styles.ptoSquare, { backgroundColor: request.color }, isCompact && styles.ptoSquareCompact]}
      >
        <Text
          style={[
            styles.ptoSquareText,
            { color: request.textColor },
            !isMonthly && styles.ptoSquareTextLarge
          ]}
          numberOfLines={1}
        >
          {userName}
        </Text>
      </View>
    );
  };

  const renderDayCell = (day: number | null, isCurrentMonth: boolean = true) => {
    if (!day) return <View key={`empty-${Math.random()}`} style={styles.dayCell} />;

    const date = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), day);
    const ptoData = getPTOForDate(date);
    const isToday = day === now.getDate() && anchorDate.getMonth() === now.getMonth() && anchorDate.getFullYear() === now.getFullYear();

    return (
      <TouchableOpacity
        key={`day-${day}`}
        style={[
          styles.dayCell,
          isToday && styles.dayCellToday,
          selectedDate?.getDate() === day && styles.dayCellSelected,
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <View style={[styles.dayNumberContainer, selectedDate?.getDate() === day && styles.dayNumberContainerSelected]}>
          <Text
            style={[
              styles.dayNumber,
              isCurrentMonth ? styles.dayNumberCurrent : styles.dayNumberOther,
              isToday && styles.dayNumberToday,
              selectedDate?.getDate() === day && styles.dayNumberSelected,
            ]}
          >
            {day}
          </Text>
        </View>
        <View style={styles.ptoContainer}>
          {ptoData.requests.slice(0, 3).map((req) => renderPTOSquare(req, true))}
          {ptoData.requests.length > 3 && (
            <View style={styles.moreIndicatorContainer}>
               <Text style={styles.moreIndicator}>
                +{ptoData.requests.length - 3}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMonthlyView = () => {
    const daysInMonth = getDaysInMonth(anchorDate.getFullYear(), anchorDate.getMonth());
    const firstDay = getFirstDayOfMonth(anchorDate.getFullYear(), anchorDate.getMonth());
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
        <View style={styles.weekDaysRow}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.weekDayLabel}>{day}</Text>
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
              style={[styles.weeklyDayRow, isToday && styles.weeklyDayRowToday]}
              onPress={() => setSelectedDate(date)}
            >
              <View style={styles.weeklyDayHeader}>
                <View style={[styles.weeklyBadge, isToday ? styles.weeklyBadgeToday : styles.weeklyBadgeNormal]}>
                  <Text style={[styles.weeklyDayNum, isToday ? styles.weeklyDayNumToday : styles.weeklyDayNumNormal]}>{date.getDate()}</Text>
                </View>
                <Text style={[styles.weeklyDayLabel, isToday ? styles.weeklyDayLabelToday : styles.weeklyDayLabelNormal]}>{dayNames[date.getDay()]}</Text>
              </View>
              <View style={styles.weeklyContent}>
                {ptoData.requests.length > 0 ? (
                  <View style={styles.weeklySquaresContainer}>
                    {ptoData.requests.map((req) => renderPTOSquare(req, false))}
                  </View>
                ) : (
                  <Text style={styles.weeklyEmptyText}>No PTO scheduled</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderDailyView = () => {
    const displayDate = selectedDate || anchorDate;
    const ptoData = getPTOForDate(displayDate);

    return (
      <View style={styles.dailyView}>
        <Text style={styles.dailyDateTitle}>
          {displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <ScrollView style={styles.dailyPTOList}>
          {ptoData.requests.length > 0 ? (
            ptoData.requests.map((req) => (
              <View key={req.id} style={[styles.dailyPTOCard, { borderLeftColor: req.color }]}>
                <View style={styles.dailyPTOInfo}>
                  <Text style={styles.dailyPTOName}>{req.user?.firstName} {req.user?.lastName}</Text>
                  <View style={styles.dailyPTODetails}>
                    <View style={[styles.leaveTypeBadge, req.status === 'PENDING' ? styles.leaveTypeBadgePending : styles.leaveTypeBadgeApproved]}>
                      <Text style={[styles.leaveTypeText, req.status === 'PENDING' ? styles.leaveTypeTextPending : styles.leaveTypeTextApproved]}>{req.type}</Text>
                    </View>
                    {req.status === 'PENDING' && <Text style={styles.pendingLabel}>Pending</Text>}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noPTOContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.noPTOText}>No PTO scheduled for today</Text>
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
          <View style={styles.popupContent} onStartShouldSetResponder={() => true}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>
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
                      <Text style={styles.popupItemName}>{req.user?.firstName} {req.user?.lastName}</Text>
                      <View style={styles.popupItemMeta}>
                        <Text style={styles.popupItemType}>{req.type}</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No PTO on this date</Text>
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
        <View style={styles.viewPickerContent} onStartShouldSetResponder={() => true}>
          {(['monthly', 'weekly', 'daily'] as CalendarView[]).map((view) => (
            <TouchableOpacity
              key={view}
              style={[styles.viewPickerOption, viewMode === view && styles.viewPickerOptionSelected]}
              onPress={() => { setViewMode(view); setShowViewPicker(false); }}
            >
              <Ionicons name={view === 'monthly' ? 'calendar' : view === 'weekly' ? 'calendar-outline' : 'today'} size={20} color={viewMode === view ? colors.primary[500] : colors.textSecondary} />
              <Text style={[styles.viewPickerText, viewMode === view ? styles.viewPickerTextSelected : styles.viewPickerTextNormal]}>{view.charAt(0).toUpperCase() + view.slice(1)}</Text>
              {viewMode === view && <Ionicons name="checkmark" size={20} color={colors.primary[500]} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getHeaderText = () => {
    return `${monthNames[anchorDate.getMonth()]} ${anchorDate.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity style={styles.headerLeft} onPress={resetToToday}>
          <Text style={styles.monthYearText} numberOfLines={1}>{getHeaderText()}</Text>
        </TouchableOpacity>
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={handlePrev} style={styles.navBtn}><Ionicons name="chevron-back" size={20} color={colors.textSecondary} /></TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.navBtn}><Ionicons name="chevron-forward" size={20} color={colors.textSecondary} /></TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(true)}>
            <Ionicons name="funnel-outline" size={22} color={colors.textSecondary} />
            {(filterEmployeeId || filterDepartment) && <View style={styles.activeDot} />}
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

export { PTOCalendar };
