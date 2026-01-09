import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth, ThemeProvider, useTheme } from '@time-sync/ui';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoginScreen } from './src/screens/LoginScreen';
import { AdminDashboardScreen } from './src/screens/DashboardScreen';
import { EmployeeDashboardScreen } from './src/screens/EmployeeDashboardScreen';
import { WorkforceStatusScreen } from './src/screens/WorkforceStatusScreen';
import { SchedulesScreen } from './src/screens/SchedulesScreen';
import { TimeAdjustmentScreen } from './src/screens/TimeAdjustmentScreen';
import { AddEditScheduleScreen } from './src/screens/AddEditScheduleScreen';
import { LeaveRequestScreen } from './src/screens/LeaveRequestScreen';

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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : user?.role === 'ADMIN' ? (
        <>
          <Stack.Screen name="Dashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="WorkforceStatus" component={WorkforceStatusScreen} />
          <Stack.Screen name="Schedules" component={SchedulesScreen} />
          <Stack.Screen name="TimeAdjustment" component={TimeAdjustmentScreen} />
          <Stack.Screen name="AddEditSchedule" component={AddEditScheduleScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={EmployeeDashboardScreen} />
          <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
          <Stack.Screen name="Schedules" component={SchedulesScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  // We need a wrapper component to consume useTheme inside App before AuthProvider
  const ThemeAwareNavigation = () => {
    const { colors, isDark } = useTheme();
    
    // DefaultTheme definition for React Navigation
    // We can't import DefaultTheme here easily without importing it, so let's import it
    const MyTheme = {
      dark: isDark,
      colors: {
        primary: colors.primary[500],
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.semantic.error,
      },
    };

    return (
         <NavigationContainer theme={MyTheme as any}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Navigation />
         </NavigationContainer>
    )
  }

  return (
    <AuthProvider>
       <ThemeProvider>
          <ThemeAwareNavigation />
       </ThemeProvider>
    </AuthProvider>
  );
}

