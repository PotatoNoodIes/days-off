import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { Spacing, Typography, Shadows } from './tokens';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputWrapperStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorMessage?: string;
  errorStyle?: TextStyle;
}

export const Select = ({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Select an option',
  containerStyle,
  inputWrapperStyle,
  labelStyle,
  errorMessage,
  errorStyle,
}: SelectProps) => {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }, labelStyle]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.inputContainer,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
          errorMessage ? { borderColor: colors.semantic.error } : null,
          inputWrapperStyle,
        ]}
      >
        <Text
          style={[
            styles.inputText,
            { color: selectedOption ? colors.textPrimary : colors.textSecondary },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {errorMessage && (
        <Text style={[styles.error, { color: colors.semantic.error }, errorStyle]}>
          {errorMessage}
        </Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[Typography.heading3, { color: colors.textPrimary }]}>
                {label || placeholder}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.border },
                    value === option.value && { backgroundColor: isDark ? colors.primary[900] : colors.primary[100] }
                  ]}
                  onPress={() => {
                    onValueChange(option.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.textPrimary },
                      value === option.value && { color: colors.primary[500], fontWeight: '700' },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
  },
  error: {
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
    paddingBottom: 40,
    maxHeight: '80%',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 350,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 16,
  },
});
