import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <ActivityIndicator size="large" color="#fff" />
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
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

