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
  StyleSheet,
} from 'react-native';
import { useAuth, Colors, Spacing, Shadows } from '@time-sync/ui';

import { Ionicons } from '@expo/vector-icons';

export const AdminLoginScreen = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Unauthorized access. Please check your admin credentials.';
      Alert.alert('Security Alert', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="shield-checkmark" size={32} color="#fff" />
            </View>
            <Text style={styles.title}>Admin Portal</Text>
            <Text style={styles.subtitle}>Secure access for administrators only</Text>
        </View>

        <View style={styles.form}>
            <View style={styles.inputContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="mail-outline" size={14} color="#aaa" style={{ marginRight: 6 }} />
                  <Text style={styles.label}>Admin Email</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="admin@timesync.com"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="lock-closed-outline" size={14} color="#aaa" style={{ marginRight: 6 }} />
                  <Text style={styles.label}>Security Key</Text>
                </View>
                <View style={{ position: 'relative' }}>
                  <TextInput
                      style={[styles.input, { paddingRight: 50 }]}
                      placeholder="••••••••"
                      placeholderTextColor="#666"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                  />
                  <TouchableOpacity 
                    style={{ position: 'absolute', right: 15, top: 12 }}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={24} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, loading ? styles.buttonDisabled : null]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="finger-print-outline" size={20} color="#000" style={{ marginRight: 8 }} />
                      <Text style={styles.buttonText}>Authenticate</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Authorized Access Only. All attempts are logged.</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Dark background for admin auth
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#333',
    ...Shadows.lg,
  },
  header: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
  },
  logoCircle: {
      width: 64,
      height: 64,
      backgroundColor: Colors.primary[500],
      borderRadius: 32,
      marginBottom: Spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      ...Shadows.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },
  form: {
      gap: Spacing.lg,
  },
  inputContainer: {
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#262626',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: '#fff', // High contrast for admin
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  footerText: {
      textAlign: 'center',
      color: '#555',
      fontSize: 10,
      marginTop: Spacing.xl,
  }
});
