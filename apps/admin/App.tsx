import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '@time-sync/ui';
import { ActivityIndicator, View } from 'react-native';
import { AdminLoginScreen } from './src/screens/LoginScreen';
import { AdminDashboardScreen } from './src/screens/DashboardScreen';
import { WorkforceStatusScreen } from './src/screens/WorkforceStatusScreen';
import { SchedulesScreen } from './src/screens/SchedulesScreen';
import { TimeAdjustmentScreen } from './src/screens/TimeAdjustmentScreen';
import { AddEditScheduleScreen } from './src/screens/AddEditScheduleScreen';

const Stack = createStackNavigator();

function Navigation() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Role-based protection: Admin app only allows ADMIN role
  const isAuthorized = isAuthenticated && user?.role === 'ADMIN';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthorized ? (
        <Stack.Screen name="Login" component={AdminLoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="WorkforceStatus" component={WorkforceStatusScreen} />
          <Stack.Screen name="Schedules" component={SchedulesScreen} />
          <Stack.Screen name="TimeAdjustment" component={TimeAdjustmentScreen} />
          <Stack.Screen name="AddEditSchedule" component={AddEditScheduleScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
