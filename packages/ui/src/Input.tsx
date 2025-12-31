import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Spacing, Typography } from './tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={Colors.neutral.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.neutral.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    ...Typography.bodyLarge,
    color: Colors.neutral.textPrimary,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: 8,
    padding: Spacing.md,
    backgroundColor: Colors.neutral.surface,
  },
  inputError: {
    borderColor: Colors.semantic.error,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.semantic.error,
    marginTop: Spacing.xs,
  },
});
