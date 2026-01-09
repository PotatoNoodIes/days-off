import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useAuth,
  useTheme,
  Typography,
  Spacing,
  Button,
  Input,
} from '@time-sync/ui';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginScreen = () => {
  const { login, loading } = useAuth();
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Invalid email';

    if (!password) next.password = 'Password is required';
    else if (password.length < 6)
      next.password = 'Minimum 6 characters';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert(
        'Login failed',
        err?.response?.data?.message || 'Please try again.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <View style={styles.spacer} />
        
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.header}>
            <Ionicons
              name="timer-outline"
              size={72}
              color={colors.primary[500]}
            />
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              TimeSync
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Attendance & Workforce Management
            </Text>
          </View>

          <Input
            label="Email Address"
            placeholder="Enter your work email"
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 50, animated: true });
              }, 100);
            }}
            leftIcon={
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textSecondary}
              />
            }
          />

          <View style={{ marginBottom: Spacing.lg }}>
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              error={errors.password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({ y: 150, animated: true });
                }, 100);
              }}
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ height: 56 }}
          />

          <TouchableOpacity style={styles.forgot}>
            <Text
              style={{
                color: colors.primary[500],
                ...Typography.bodyMedium,
                fontWeight: '600',
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    minHeight: SCREEN_HEIGHT + 100,
  },
  spacer: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.15,
  },
  card: {
    padding: Spacing.xl,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    opacity: 0.8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -11 }],
  },
  forgot: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  bottomSpacer: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.4,
  },
});