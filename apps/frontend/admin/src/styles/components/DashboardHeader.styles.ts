import { StyleSheet } from 'react-native';
import { Spacing, Typography } from '@time-sync/ui';

export const createStyles = (colors: any, _isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  menuButton: {
    padding: 4,
    marginLeft: -4,
  },
  dateText: {
    ...Typography.bodyLarge,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
