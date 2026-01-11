import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, ThemeProvider, useAuth, useTheme } from '@time-sync/ui';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {LoginScreen} from '../shared/screens/LoginScreen'
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LeaveRequestScreen } from './src/screens/LeaveRequestScreen';
import { SchedulesScreen } from '../shared/screens/SchedulesScreen'
import { DashboardScreen as AdminDashboardScreen } from '../admin/src/screens/DashboardScreen';
import { TeamStatusScreen } from '../admin/src/screens/TeamStatusScreen';
import { TimeAdjustmentScreen } from '../admin/src/screens/TimeAdjustmentScreen';
import { AddEditScheduleScreen } from '../admin/src/screens/AddEditScheduleScreen';

const Stack = createStackNavigator();

function Navigation() {
  const { isAuthenticated, loading, user } = useAuth();
  const { colors, isDark } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={{
      ...DefaultTheme,
      dark: isDark,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary[500],
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.semantic.error,
      }
    }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user?.role === 'ADMIN' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="TeamStatus" component={TeamStatusScreen} />
            <Stack.Screen name="Schedules" component={SchedulesScreen} />
            <Stack.Screen name="TimeAdjustment" component={TimeAdjustmentScreen} />
            <Stack.Screen name="AddEditSchedule" component={AddEditScheduleScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
            <Stack.Screen name="Schedules" component={SchedulesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </AuthProvider>
  );
}
