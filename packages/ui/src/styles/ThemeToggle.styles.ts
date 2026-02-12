import { StyleSheet } from 'react-native';

export const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: isDark ? colors.surface : colors.primary[100],
    borderColor: colors.border,
  },
  icon: {
    color: isDark ? "#FFD700" : colors.primary[500],
  },
});
