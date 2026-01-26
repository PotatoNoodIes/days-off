import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useTheme, Button, Spacing, Typography } from '@time-sync/ui';

export const RegisterScreen = ({ navigation }: any) => {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, { first_name: firstName, last_name: lastName });
      // Redirect happens automatically via AuthContext session change
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[Typography.heading1, { color: colors.textPrimary, marginBottom: Spacing.md }]}>Create Account</Text>
        
        <View style={styles.form}>
          <Text style={[Typography.bodyMedium, { color: colors.textSecondary, marginBottom: 4 }]}>First Name</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[Typography.bodyMedium, { color: colors.textSecondary, marginBottom: 4, marginTop: Spacing.md }]}>Last Name</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[Typography.bodyMedium, { color: colors.textSecondary, marginBottom: 4, marginTop: Spacing.md }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="john.doe@example.com"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[Typography.bodyMedium, { color: colors.textSecondary, marginBottom: 4, marginTop: Spacing.md }]}>Password</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
          />

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: Spacing.xl }}
          />

          <Button
            title="Back to Login"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ marginTop: Spacing.sm }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  form: {
    marginTop: Spacing.lg,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
});
