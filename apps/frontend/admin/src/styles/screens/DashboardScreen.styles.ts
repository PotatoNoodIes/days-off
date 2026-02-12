import { StyleSheet, Dimensions } from 'react-native';
import { Spacing, Typography, Shadows } from '@time-sync/ui';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  calendarContainer: {
    flex: 1,
    marginTop: -Spacing.xl,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 2,
    borderTopColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 30,
    zIndex: 1000,
    width: '100%',
  },
  sheetHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  pendingSectionHeader: {
    marginBottom: Spacing.sm,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading3,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchInputWrapper: {
    height: 48,
    borderRadius: 16,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
  requestsList: {
    paddingBottom: 40,
  },
  scrollViewContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...Typography.heading3,
    marginTop: 16,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
    color: colors.textSecondary,
  },
});
