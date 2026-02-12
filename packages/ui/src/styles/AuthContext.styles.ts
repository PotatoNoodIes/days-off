import { StyleSheet } from 'react-native';

export const createStyles = (colors: any, _isDark: boolean) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
