import { StyleSheet } from 'react-native';
import { Spacing } from '@time-sync/ui';

export const createStyles = (colors: any, isDark: boolean, avatarColor?: string) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: colors.border,
    borderRadius: 16,
    padding: Spacing.md,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: avatarColor || colors.primary[500],
  },
  avatarText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: colors.textPrimary,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: colors.primary[100],
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.primary[500],
  },
  daysTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: isDark ? 'hsla(142, 70%, 45%, 0.15)' : 'hsl(142, 70%, 95%)',
  },
  daysTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: isDark ? 'hsl(142, 70%, 55%)' : 'hsl(142, 70%, 45%)',
  },
  dateRange: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
    color: colors.textSecondary,
  },
  submitted: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actionsColumn: {
    flexDirection: 'column',
    gap: Spacing.xs,
    width: 100,
    marginLeft: Spacing.lg,
  },
  actionBtn: {
    height: 50,
    minWidth: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rejectBtn: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: colors.semantic.error,
  },
  rejectText: {
    color: colors.semantic.error,
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
