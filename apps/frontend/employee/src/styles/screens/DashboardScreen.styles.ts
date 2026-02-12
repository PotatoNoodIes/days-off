import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '@time-sync/ui';

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.heading1,
    color: colors.textPrimary,
  },
  dateText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoutButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  balanceCard: {
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    elevation: 2,
    backgroundColor: colors.surface,
  },
  statLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    color: colors.textSecondary,
  },
  statValue: {
    ...Typography.heading2,
    color: colors.textPrimary,
    fontSize: 42,
    lineHeight: 52,
  },
  requestButton: {
    borderRadius: 18,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: colors.primary[500],
  },
  requestButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestButtonIcon: {
    marginRight: 8,
  },
  requestButtonText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: "#fff",
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading2,
    color: colors.textPrimary,
  },
  activityList: {
    borderRadius: 20,
    padding: Spacing.md,
    minHeight: 120,
    marginBottom: Spacing.xl,
    backgroundColor: colors.surface,
  },
  loadingIndicator: {
    marginVertical: Spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
  },
  activityItem: {
    paddingVertical: 14,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  activityItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityItemType: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  activityItemDates: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
  },
  activityItemDays: {
    ...Typography.bodyMedium,
    color: colors.primary[500],
    fontWeight: '700',
  },
  reasonText: {
    ...Typography.caption,
    fontStyle: 'italic',
    marginTop: 4,
    color: colors.textSecondary,
  },
});
