import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Spacing, Typography } from '@time-sync/ui';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    maxWidth: 200,
  },
  filterButtonText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
  },
  filterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    minHeight: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
    paddingBottom: 60,
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    ...Typography.heading2,
    color: colors.textPrimary,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  employeeFilterSection: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  filterLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    color: colors.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
    borderColor: colors.primary[500],
  },
  chipInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.primary[500],
  },
  chipTextInactive: {
    color: colors.textPrimary,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  resultsCount: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 0,
    marginBottom: Spacing.sm,
  },
  searchInputWrapper: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    paddingHorizontal: 12,
  },
  employeeList: {
    flex: 1,
  },
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  employeeRowActive: {
    backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
  },
  employeeName: {
    fontWeight: '500',
    fontSize: 15,
    color: colors.textPrimary,
  },
  employeeDept: {
    fontSize: 12,
    marginTop: 2,
    color: colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  clearButtonText: {
    color: colors.semantic.error,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.primary[500],
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
