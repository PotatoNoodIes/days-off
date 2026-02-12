import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '@time-sync/ui';

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.heading2,
    color: colors.textPrimary,
  },
  scrollView: {
    maxHeight: 400,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    borderBottomColor: colors.border,
  },
  userItemSelected: {
    backgroundColor: isDark ? colors.background : colors.primary[100],
  },
  userName: {
    ...Typography.bodyLarge,
    color: colors.textPrimary,
  },
  userEmail: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  balanceInfo: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    ...Typography.small,
    color: colors.textSecondary,
  },
  balanceValue: {
    ...Typography.bodyMedium,
    color: colors.primary[500],
    fontWeight: '700',
  },
  selectionContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: isDark ? colors.background : colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectionText: {
    ...Typography.bodyMedium,
    marginBottom: Spacing.sm,
    color: colors.textPrimary,
  },
  selectionLabelBold: {
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  input: {
    flex: 2,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.textPrimary,
    borderColor: colors.border,
    backgroundColor: isDark ? colors.surface : colors.background,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: Spacing.xl,
  },
});
