import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth, Colors, Typography, Spacing } from '@time-sync/ui';
import { styles } from '../styles/LoginStyles';

import { Ionicons } from '@expo/vector-icons';

export const LoginScreen = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    try {
      await login(email, password);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={{ alignItems: 'center', marginBottom: Spacing.lg }}>
          <Ionicons name="time" size={60} color={Colors.primary[500]} />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your employee portal</Text>

        <View style={styles.inputGroup}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
             <Ionicons name="mail-outline" size={16} color={Colors.neutral.textSecondary} style={{ marginRight: 6 }} />
             <Text style={styles.label}>Email Address</Text>
          </View>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="email@example.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
             <Ionicons name="lock-closed-outline" size={16} color={Colors.neutral.textSecondary} style={{ marginRight: 6 }} />
             <Text style={styles.label}>Password</Text>
          </View>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[styles.input, { paddingRight: 50 }, errors.password ? styles.inputError : null]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
            />
            <TouchableOpacity 
              style={{ position: 'absolute', right: 15, top: 15 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color={Colors.neutral.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : null]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
