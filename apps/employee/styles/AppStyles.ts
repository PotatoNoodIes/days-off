import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Shadows } from '@time-sync/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    ...Typography.heading1,
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.heading1,
    color: Colors.neutral.textPrimary,
  },
  dateText: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textSecondary,
  },
  clockCard: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.semantic.success,
    marginRight: 8,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.neutral.textSecondary,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    marginVertical: Spacing.xs,
  },
  clockSubtext: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textSecondary,
    marginBottom: Spacing.xl,
  },
  clockButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  clockButtonIn: {
    backgroundColor: Colors.primary[500],
    ...Shadows.md,
  },
  clockButtonOut: {
    backgroundColor: Colors.neutral.background,
    borderWidth: 1.5,
    borderColor: Colors.semantic.error,
  },
  clockButtonText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: '#fff',
  },
  clockButtonTextOut: {
    color: Colors.semantic.error,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.neutral.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    ...Shadows.sm,
  },
  statLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Colors.neutral.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    ...Typography.heading2,
    color: Colors.neutral.textPrimary,
  },
  sectionHeader: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  activityList: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.border,
    padding: 2,
    borderRadius: 10,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.neutral.surface,
    ...Shadows.sm,
  },
  tabText: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.neutral.textSecondary,
  },
  activeTabText: {
    color: Colors.primary[500],
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  activityItem: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'column',
  },
  activityItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  activityItemText: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textPrimary,
  },
});
