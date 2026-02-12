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
  headerTitle: {
    ...Typography.heading3,
    color: colors.textPrimary,
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
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
  employeeCard: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary[500],
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    ...Typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  employeeEmail: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
    backgroundColor: colors.border,
  },
  employeeDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceValuePTO: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[500],
  },
  balanceValueTimeOff: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.semantic.warning,
  },
  balanceValueLeave: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.semantic.success,
  },
  balanceLabel: {
    fontSize: 11,
    marginTop: 4,
    color: colors.textSecondary,
  },
  cardFooter: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});
