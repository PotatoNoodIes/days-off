import React from 'react';
import { StyleSheet, TextInputProps } from 'react-native';
import { Input as RNEInput, InputProps as RNEInputProps } from '@rneui/themed';
import { Spacing } from './tokens';
import { useTheme } from './ThemeContext';

export interface InputProps extends RNEInputProps, TextInputProps {}

export const FormInput = (props: InputProps) => {
  const { colors } = useTheme();

  return (
    <RNEInput
      placeholderTextColor={colors.textSecondary}
      containerStyle={styles.container}
      inputContainerStyle={[
        styles.inputContainer,
        { 
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        props.errorMessage ? { borderColor: colors.semantic.error, borderWidth: 1 } : null,
        props.inputContainerStyle,
      ]}
      inputStyle={[
        styles.input,
        { color: colors.textPrimary },
        props.inputStyle,
      ]}
      labelStyle={[
        styles.label,
        { color: colors.textSecondary },
        props.labelStyle,
      ]}
      errorStyle={[
        styles.error,
        { color: colors.semantic.error },
        props.errorStyle,
      ]}
      {...props}
    />
  );
};

// Also export as Input for backward compatibility if needed, 
// but screens should ideally move to FormInput
export const Input = FormInput;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  input: {
    fontSize: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: Spacing.xs,
  },
  error: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 0,
  }
});
