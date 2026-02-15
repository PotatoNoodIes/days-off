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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  section: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: colors.textPrimary,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.semantic.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  roleSelector: {
    gap: 10,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  roleOptionSelected: {
    backgroundColor: colors.surface,
    borderColor: colors.primary[500],
  },
  roleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  roleTextSelected: {
    color: colors.primary[500],
    fontWeight: '700',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  dateButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
