import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '@time-sync/ui';
import { ActivityIndicator, View } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LeaveRequestScreen } from './src/screens/LeaveRequestScreen';

const Stack = createStackNavigator();

function Navigation() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Role-based protection: Employee app only allows EMPLOYEE role
  const isAuthorized = isAuthenticated && user?.role === 'EMPLOYEE';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthorized ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
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
