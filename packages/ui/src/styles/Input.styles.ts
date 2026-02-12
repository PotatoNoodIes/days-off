import { StyleSheet } from 'react-native';
import { Spacing } from '../tokens';

export const createStyles = (colors: any, _isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 56,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputContainerError: {
    borderColor: colors.semantic.error,
    borderWidth: 1,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  label: {
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: Spacing.xs,
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 0,
    color: colors.semantic.error,
  }
});
