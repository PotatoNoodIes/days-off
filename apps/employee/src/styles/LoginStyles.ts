import { StyleSheet } from 'react-native';
import { Colors, Spacing, Shadows, Shadows as SharedShadows } from '@time-sync/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.background,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral.textPrimary,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: Colors.semantic.error,
  },
  errorText: {
    color: Colors.semantic.error,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.primary[500],
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
