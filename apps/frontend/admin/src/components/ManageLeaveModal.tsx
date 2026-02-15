import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { Typography, useTheme, UserStats, Button } from '@time-sync/ui';
import { createStyles } from '../styles/components/ManageLeaveModal.styles';
import { useMemo } from 'react';
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
  const styles = useMemo(() => createStyles(colors, !!isDark), [colors, isDark]);
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
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manage Leave Balances</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {users.filter(u => u.role === 'EMPLOYEE').map(u => (
              <TouchableOpacity 
                key={u.id}
                onPress={() => {
                  if (u.email === currentUserEmail) {
                     Alert.alert("Permission Denied", "You cannot modify your own leave balance.");
                     return;
                  }
                  setSelectedUser(u);
                  setNewBalance(u.currentPtoBalance.toString());
                }}
                style={[
                  styles.userItem, 
                  selectedUser?.id === u.id && styles.userItemSelected
                ]}
              >
                <View>
                  <Text style={styles.userName}>{u.firstName} {u.lastName}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                </View>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceLabel}>Current</Text>
                  <Text style={styles.balanceValue}>{u.currentPtoBalance}d</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedUser && (
            <View style={styles.selectionContainer}>
              <Text style={styles.selectionText}>
                Set Annual Leave for <Text style={styles.selectionLabelBold}>{selectedUser.firstName}</Text>
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
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
            <Text style={styles.emptyText}>
              Select an employee to configure their balance
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};


