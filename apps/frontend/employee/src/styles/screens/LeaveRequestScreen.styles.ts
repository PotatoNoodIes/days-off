import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '@time-sync/ui';

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.heading1,
    color: colors.textPrimary,
  },
  label: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeOptionActive: {
    backgroundColor: colors.primary[500],
  },
  typeOptionInactive: {
    backgroundColor: 'transparent',
  },
  typeText: {
    fontSize: 13,
  },
  typeTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  typeTextInactive: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  durationRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  durationColumn: {
    flex: 1,
  },
  caption: {
    ...Typography.caption,
    marginBottom: 4,
    color: colors.textSecondary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  dateButtonText: {
    marginLeft: 8,
    color: colors.textPrimary,
  },
  summaryRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 6,
    color: colors.textSecondary,
  },
  summaryDays: {
    fontWeight: '700',
    color: colors.primary[500],
  },
  warningBanner: {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)',
  },
  warningText: {
    color: colors.semantic.error,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  reasonInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: colors.primary[500],
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    color: '#fff',
  },
});
