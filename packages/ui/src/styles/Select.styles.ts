import { StyleSheet } from 'react-native';
import { Spacing, Typography, Shadows } from '../tokens';

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputContainerError: {
    borderColor: colors.semantic.error,
  },
  inputText: {
    fontSize: 15,
  },
  inputTextSelected: {
    color: colors.textPrimary,
  },
  inputTextPlaceholder: {
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    marginTop: 2,
    color: colors.semantic.error,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
    paddingBottom: 40,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.heading3,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 350,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 4,
    borderBottomColor: colors.border,
  },
  optionItemSelected: {
    backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary[500],
    fontWeight: '700',
  },
});
