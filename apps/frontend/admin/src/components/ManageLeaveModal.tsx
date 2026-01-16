import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { Typography, Spacing, useTheme, UserStats, Button } from '@time-sync/ui';
import { Ionicons } from '@expo/vector-icons';
import { adminApi } from '@time-sync/api';

interface ManageLeaveModalProps {
  visible: boolean;
  onClose: () => void;
  users: UserStats[]; // We might need to adjust this type if UserStats doesn't have all fields, but based on Dashboard usage it seems ok.
  refetchUsers: () => void;
  currentUserEmail?: string;
}

export const ManageLeaveModal = ({ visible, onClose, users, refetchUsers, currentUserEmail }: ManageLeaveModalProps) => {
  const { colors, isDark } = useTheme();
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);
  const [newBalance, setNewBalance] = useState('');

  const handleUpdateBalance = async () => {
    if (!selectedUser || !newBalance) return;

    Alert.alert(
      "Are you sure?",
      "This will update the user's leave balance.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: async () => {
            try {
              await adminApi.updateLeaveBalance(selectedUser.id, parseFloat(newBalance));
              Alert.alert("Success", "Leave balance updated");
              onClose();
              setSelectedUser(null);
              setNewBalance('');
              refetchUsers();
            } catch (e) {
              Alert.alert("Error", "Failed to update balance");
            }
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[Typography.heading2, { color: colors.textPrimary }]}>Manage Leave Balances</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 400 }}>
            {users.filter(u => u.role === 'EMPLOYEE').map(u => (
              <TouchableOpacity 
                key={u.id}
                onPress={() => {
                  if (u.email === currentUserEmail) {
                     Alert.alert("Permission Denied", "You cannot modify your own leave balance.");
                     return;
                  }
                  setSelectedUser(u);
                  setNewBalance(u.leaveBalance.toString());
                }}
                style={[
                  styles.userItem, 
                  { borderBottomColor: colors.border },
                  selectedUser?.id === u.id && { backgroundColor: isDark ? colors.background : colors.primary[100] }
                ]}
              >
                <View>
                  <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>{u.firstName} {u.lastName}</Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>{u.email}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[Typography.small, { color: colors.textSecondary }]}>Current</Text>
                  <Text style={[Typography.bodyMedium, { color: colors.primary[500], fontWeight: '700' }]}>{u.leaveBalance}d</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedUser && (
            <View style={{ marginTop: Spacing.lg, padding: Spacing.md, backgroundColor: isDark ? colors.background : colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
              <Text style={[Typography.bodyMedium, { marginBottom: Spacing.sm, color: colors.textPrimary }]}>
                Set Annual Leave for <Text style={{ fontWeight: '700' }}>{selectedUser.firstName}</Text>
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: isDark ? colors.surface : colors.background }]}
                  value={newBalance}
                  onChangeText={setNewBalance}
                  keyboardType="numeric"
                  placeholder="Days (e.g. 25)"
                  placeholderTextColor={colors.textSecondary}
                />
                <Button 
                  title="Save" 
                  onPress={handleUpdateBalance} 
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}
          
          {!selectedUser && (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: Spacing.xl }}>
              Select an employee to configure their balance
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
  },
  input: {
    flex: 2,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  }
});
