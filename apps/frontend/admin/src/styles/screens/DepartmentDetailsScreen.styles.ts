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
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading3,
    color: colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  editingContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary[500],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  value: {
    ...Typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: Spacing.md,
  },
  employeeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: '700',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    ...Typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  employeeEmail: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
