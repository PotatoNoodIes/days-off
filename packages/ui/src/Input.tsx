import React from 'react';
import { StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Input as RNEInput, InputProps as RNEInputProps } from '@rneui/themed';
import { Spacing } from './tokens';
import { useTheme } from './ThemeContext';
import { createStyles } from './styles/Input.styles';
import { useMemo } from 'react';

export interface InputProps extends RNEInputProps, TextInputProps {
  inputWrapperStyle?: ViewStyle;
}

export const FormInput = (props: InputProps) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);

  return (
    <RNEInput
      placeholderTextColor={colors.textSecondary}
      containerStyle={styles.container}
      inputContainerStyle={[
        styles.inputContainer,
        props.errorMessage ? styles.inputContainerError : null,
        props.inputContainerStyle,
        props.inputWrapperStyle,
      ]}
      inputStyle={[
        styles.input,
        props.inputStyle,
      ]}
      labelStyle={[
        styles.label,
        props.labelStyle,
      ]}
      errorStyle={[
        styles.error,
        props.errorStyle,
      ]}
      {...props}
    />
  );
};

// Also export as Input for backward compatibility if needed, 
// but screens should ideally move to FormInput
export const Input = FormInput;

