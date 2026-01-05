import { useState } from 'react';
import { Alert } from 'react-native';
import { leavesApi } from '@time-sync/api';
import { LeaveRequestData } from '../types';

export const useLeaveRequest = (onSuccess?: () => void) => {
  const [leaveType, setLeaveType] = useState('Vacation');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString());
  const [loading, setLoading] = useState(false);

  const submitLeaveRequest = async () => {
    if (!reason) {
      Alert.alert('Error', 'Please provide a reason');
      return;
    }

    setLoading(true);
    try {
      await leavesApi.create({
        type: leaveType,
        reason,
        startDate,
        endDate,
      });
      Alert.alert('Success', 'Leave request submitted!');
      setReason('');
      onSuccess?.();
    } catch (e) {
      Alert.alert('Error', 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return {
    leaveType,
    setLeaveType,
    reason,
    setReason,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    submitLeaveRequest,
  };
};
