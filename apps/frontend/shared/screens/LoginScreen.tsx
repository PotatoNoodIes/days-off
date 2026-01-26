import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useTheme, Button, Spacing, Typography } from '@time-sync/ui';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export const LoginScreen = ({ navigation }: any) => {
  const { signInWithGoogle, signInWithPassword, loading: authLoading } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  const loading = authLoading || manualLoading;

  const handleManualLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setManualLoading(true);
    try {
      await signInWithPassword(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="timer-outline" size={80} color={colors.primary[500]} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>TimeSync</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manage your time off efficiently
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface, marginTop: Spacing.sm }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
          />
          <Button
            title="Sign In"
            onPress={handleManualLogin}
            loading={manualLoading}
            style={{ marginTop: Spacing.md }}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary, backgroundColor: colors.background }]}>OR</Text>
        </View>

        <Button
          title="Sign in with Google"
          onPress={signInWithGoogle}
          loading={authLoading}
          variant="google"
          style={styles.button}
        />
        
        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[Typography.bodyMedium, { color: colors.textSecondary }]}>
            Don't have an account? <Text style={{ color: colors.primary[500], fontWeight: '600' }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.heading1,
    marginTop: Spacing.md,
  },
  subtitle: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    marginTop: Spacing.sm,
    opacity: 0.8,
  },
  button: {
    height: 56,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xl,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
});
