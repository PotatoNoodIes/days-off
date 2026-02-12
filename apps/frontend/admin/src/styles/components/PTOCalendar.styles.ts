import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '@time-sync/ui';

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.surface,
  },
  calendarHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: Spacing.md, 
    paddingTop: Spacing.lg, 
    paddingBottom: Spacing.md, 
    flexWrap: 'nowrap' 
  },
  headerLeft: { 
    flexShrink: 1, 
    paddingVertical: 4, 
    paddingHorizontal: 4, 
    borderRadius: 8 
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  monthYearText: { 
    ...Typography.heading2, 
    fontSize: 20, 
    fontWeight: '900', 
    letterSpacing: -1,
    color: colors.textPrimary,
  },
  navButtons: { 
    flexDirection: 'row', 
    gap: 8, 
    alignItems: 'center', 
    marginLeft: 4, 
    minWidth: 72 
  },
  navBtn: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.05)' 
  },
  iconBtn: { 
    position: 'relative', 
    padding: 6, 
    backgroundColor: 'rgba(0,0,0,0.03)', 
    borderRadius: 12 
  },
  activeDot: { 
    position: 'absolute', 
    top: 4, 
    right: 4, 
    width: 6, 
    height: 6, 
    borderRadius: 3,
    backgroundColor: colors.primary[500],
  },
  monthGrid: { 
    width: '100%', 
    paddingBottom: Spacing.lg 
  },
  weekDaysRow: { 
    flexDirection: 'row', 
    paddingBottom: 4, 
    borderBottomWidth: 0.5, 
    marginBottom: 8, 
    paddingHorizontal: 16, 
    opacity: 0.5,
    borderBottomColor: colors.border,
  },
  weekDayLabel: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 11, 
    fontWeight: '800', 
    textTransform: 'uppercase', 
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },
  weekRow: { 
    flexDirection: 'row' 
  },
  dayCell: { 
    flex: 1, 
    minHeight: 109, 
    padding: 4, 
    borderRadius: 16, 
    alignItems: 'center', 
    margin: 2, 
    backgroundColor: 'rgba(0,0,0,0.015)', 
    borderWidth: 0 
  },
  dayCellToday: {
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  },
  dayCellSelected: {
    backgroundColor: colors.primary[500] + '15',
    borderColor: colors.primary[500],
    borderWidth: 1,
    borderRadius: 14,
  },
  dayNumberContainer: { 
    width: 24, 
    height: 24, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 2 
  },
  dayNumberContainerSelected: {
    backgroundColor: colors.primary[500], 
    borderRadius: 12
  },
  dayNumber: { 
    fontSize: 13, 
    fontWeight: '700', 
    letterSpacing: -0.5,
  },
  dayNumberCurrent: {
    color: colors.textPrimary,
  },
  dayNumberOther: {
    color: colors.textSecondary,
  },
  dayNumberToday: {
    color: colors.primary[500], 
    fontWeight: '900',
  },
  dayNumberSelected: {
    color: '#fff', 
    fontWeight: '900',
  },
  ptoContainer: { 
    flex: 1, 
    width: '100%', 
    gap: 2 
  },
  ptoSquare: { 
    paddingHorizontal: 4, 
    paddingVertical: 2, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 1, 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2 
  },
  ptoSquareCompact: { 
    paddingHorizontal: 2, 
    paddingVertical: 1 
  },
  ptoSquareText: { 
    fontSize: 10, 
    fontWeight: '800', 
    letterSpacing: -0.1 
  },
  ptoSquareTextLarge: {
    fontSize: 13, 
    fontWeight: '700',
  },
  moreIndicatorContainer: { 
    marginTop: 2, 
    alignSelf: 'center' 
  },
  moreIndicator: { 
    fontSize: 9, 
    fontWeight: '700', 
    opacity: 0.6,
    color: colors.textSecondary,
  },
  weeklyContainer: { 
    flex: 1 
  },
  weeklyDayRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 14, 
    paddingHorizontal: 4, 
    borderBottomWidth: 1,
    backgroundColor: colors.surface, 
    borderBottomColor: colors.border,
  },
  weeklyDayRowToday: {
    backgroundColor: isDark ? 'rgba(255, 102, 204, 0.05)' : 'rgba(255, 102, 204, 0.03)',
  },
  weeklyDayHeader: { 
    width: 100, 
    alignItems: 'center', 
    gap: 4 
  },
  weeklyBadge: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  weeklyBadgeToday: {
    backgroundColor: '#FF66CC',
  },
  weeklyBadgeNormal: {
    backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
  },
  weeklyDayNum: { 
    fontSize: 16, 
    fontWeight: '800' 
  },
  weeklyDayNumToday: {
    color: '#fff',
  },
  weeklyDayNumNormal: {
    color: isDark ? colors.primary[400] : colors.primary[500],
  },
  weeklyDayLabel: { 
    fontSize: 11, 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
  },
  weeklyDayLabelToday: {
    color: colors.textPrimary,
  },
  weeklyDayLabelNormal: {
    color: colors.textSecondary,
  },
  weeklyContent: { 
    flex: 1, 
    paddingLeft: Spacing.md 
  },
  weeklySquaresContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 6 
  },
  weeklyEmptyText: { 
    fontSize: 13, 
    fontStyle: 'italic', 
    opacity: 0.6,
    color: colors.textSecondary,
  },
  dailyView: { 
    flex: 1, 
    paddingHorizontal: Spacing.lg 
  },
  dailyDateTitle: { 
    ...Typography.heading2, 
    marginBottom: Spacing.md,
    color: colors.textPrimary,
  },
  dailyPTOList: { 
    flex: 1 
  },
  dailyPTOCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: Spacing.md, 
    borderRadius: 12, 
    marginBottom: Spacing.sm, 
    borderLeftWidth: 4,
    backgroundColor: colors.surface,
  },
  dailyPTOInfo: { 
    flex: 1 
  },
  dailyPTOName: { 
    ...Typography.bodyLarge, 
    fontWeight: '600', 
    marginBottom: 4,
    color: colors.textPrimary,
  },
  dailyPTODetails: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  leaveTypeBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  leaveTypeBadgePending: {
    backgroundColor: isDark ? colors.semantic.warning + '30' : colors.semantic.warning + '20',
  },
  leaveTypeBadgeApproved: {
    backgroundColor: colors.primary[100],
  },
  leaveTypeText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  leaveTypeTextPending: {
    color: colors.semantic.warning,
  },
  leaveTypeTextApproved: {
    color: colors.primary[500],
  },
  pendingLabel: { 
    fontSize: 12, 
    fontWeight: '500',
    color: colors.semantic.warning,
  },
  noPTOContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: Spacing.xl 
  },
  noPTOText: { 
    marginTop: Spacing.sm, 
    ...Typography.bodyMedium,
    color: colors.textSecondary,
  },
  popupOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: Spacing.xl 
  },
  popupContent: { 
    width: '100%', 
    maxWidth: 400, 
    borderRadius: 16, 
    padding: Spacing.lg, 
    maxHeight: '60%',
    backgroundColor: colors.surface,
  },
  popupHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: Spacing.md 
  },
  popupTitle: { 
    ...Typography.heading3,
    color: colors.textPrimary,
  },
  popupList: { 
    maxHeight: 300 
  },
  popupItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: Spacing.sm, 
    borderLeftWidth: 3, 
    paddingLeft: Spacing.sm, 
    marginBottom: Spacing.xs 
  },
  popupColorDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: Spacing.sm 
  },
  popupItemInfo: { 
    flex: 1 
  },
  popupItemName: { 
    ...Typography.bodyMedium, 
    fontWeight: '600',
    color: colors.textPrimary,
  },
  popupItemMeta: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  popupItemType: { 
    ...Typography.caption,
    color: colors.textSecondary,
  },
  pendingBadge: { 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  noDataText: { 
    textAlign: 'center', 
    ...Typography.bodyMedium, 
    paddingVertical: Spacing.lg,
    color: colors.textSecondary,
  },
  viewPickerContent: { 
    borderRadius: 12, 
    padding: Spacing.sm, 
    minWidth: 180,
    backgroundColor: colors.surface,
  },
  viewPickerOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: Spacing.sm, 
    paddingHorizontal: Spacing.md, 
    borderRadius: 8, 
    gap: 12 
  },
  viewPickerOptionSelected: {
    backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
  },
  viewPickerText: { 
    flex: 1, 
    ...Typography.bodyMedium, 
    fontWeight: '500' 
  },
  viewPickerTextSelected: {
    color: colors.primary[500],
  },
  viewPickerTextNormal: {
    color: colors.textPrimary,
  },
});
