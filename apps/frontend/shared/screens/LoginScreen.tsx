import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useTheme, Button, Spacing, Typography, Input } from '@time-sync/ui';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, ActivityIndicator } from 'react-native';

export const LoginScreen = ({ navigation }: any) => {
  const { signInWithGoogle, signInWithPassword, loading: authLoading } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [generalError, setGeneralError] = useState('');

  const loading = authLoading || manualLoading;

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    setGeneralError('');
    return isValid;
  };

  const handleManualLogin = async () => {
    if (!validateForm()) return;
    
    setManualLoading(true);
    setGeneralError('');
    
    const error = await signInWithPassword(email, password);
    
    if (error) {
      setGeneralError('Invalid credentials');
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
            {generalError ? (
            <Text style={{ color: colors.semantic.error, marginBottom: Spacing.md, textAlign: 'center' }}>
              {generalError}
            </Text>
            ) : null}
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              if (generalError) setGeneralError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter Email"
            errorMessage={errors.email}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              if (generalError) setGeneralError('');
            }}
            secureTextEntry
            placeholder="Enter Password"
            errorMessage={errors.password}
          />
          <Button
            title={loading ? "" : "Sign In"}
            onPress={handleManualLogin}
            loading={loading}
            style={{ marginTop: Spacing.sm }}
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading2,
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyMedium,
    textAlign: 'center',
    marginTop: Spacing.xs,
    opacity: 0.8,
  },
  button: {
    height: 52,
  },
  form: {
    marginBottom: Spacing.lg,
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
    marginVertical: Spacing.lg,
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
    zIndex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
});
