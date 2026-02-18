import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '@time-sync/ui';

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...Typography.heading3,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    ...Typography.heading2,
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    ...Typography.heading3,
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 8,
  },
  departmentCard: {
    flex: 1,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  deptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deptInfo: {
    flex: 1,
  },
  deptName: {
    ...Typography.heading3,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
    backgroundColor: colors.border,
  },
  deptFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  employeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  employeeCountText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
  },
  departmentCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  deleteButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.semantic.errorLight,
  },
});
