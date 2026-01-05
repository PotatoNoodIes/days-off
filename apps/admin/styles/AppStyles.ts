import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Shadows } from '@time-sync/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
    paddingTop: 60,
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Premium dark background for admin login
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  loginTitle: {
    ...Typography.heading1,
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  loginCard: {
    padding: Spacing.xl,
    borderRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.border,
    padding: 4,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.neutral.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.neutral.textSecondary,
  },
  activeTabText: {
    color: Colors.primary[500],
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: 16,
    backgroundColor: Colors.neutral.surface,
    ...Shadows.sm,
  },
  statValue: {
    ...Typography.heading2,
    color: Colors.primary[500],
  },
  statLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Colors.neutral.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading3,
    color: Colors.neutral.textPrimary,
  },
  avatarRow: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  activityItem: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textPrimary,
  },
  requestCard: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.primary[500],
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  requestDates: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.neutral.textSecondary,
  },
  requestReason: {
    ...Typography.bodyMedium,
    color: Colors.neutral.textPrimary,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    ...Typography.bodyLarge,
    color: Colors.neutral.textPrimary,
    fontWeight: '600',
  },
});
