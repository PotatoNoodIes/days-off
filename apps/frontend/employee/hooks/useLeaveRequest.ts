import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { leavesApi } from '@time-sync/api';
import { LeaveRequestData } from '../types';
import { useAuth } from '@time-sync/ui';

export const useLeaveRequest = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState<string>('');
  const [reason, setReason] = useState('');
  const [existingRequests, setExistingRequests] = useState<any[]>([]);
  
  const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const [startDate, _setStartDate] = useState(getStartOfDay(new Date()));
  const [endDate, _setEndDate] = useState(getStartOfDay(new Date(Date.now() + 86400000)));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await leavesApi.getMyRequests();
      setExistingRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch request history:', error);
    }
  };

  const setStartDate = (date: Date) => _setStartDate(getStartOfDay(date));
  const setEndDate = (date: Date) => _setEndDate(getStartOfDay(date));

  const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const hasOverlap = () => {
    return existingRequests.some(req => {
      if (req.status === 'REJECTED' || req.status === 'CANCELLED') return false;

      const reqStart = parseLocalDate(req.startDate);
      const reqEnd = parseLocalDate(req.endDate);
      
      return (startDate <= reqEnd && endDate >= reqStart);
    });
  };

  const formatDateToLocalISO = (date: Date) => {
    const d = getStartOfDay(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const submitLeaveRequest = async () => {
    if (!leaveType) {
      Alert.alert('Error', 'Please select a leave type');
      return;
    }

    if (!reason) {
      Alert.alert('Error', 'Please provide a reason');
      return;
    }

    if (hasOverlap()) {
      Alert.alert('Duplicate Request', 'The selected dates overlap with one of your existing requests.');
      return;
    }

    if (leaveType === 'VACATION') {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const currentBalance = Number(user?.currentPtoBalance || 0);

      if (requestedDays > currentBalance) {
        Alert.alert(
          'Insufficient Balance', 
          `You are requesting ${requestedDays} days, but only have ${currentBalance} days available.`
        );
        return;
      }
    }

    setLoading(true);
    try {
      const startStr = formatDateToLocalISO(startDate);
      const endStr = formatDateToLocalISO(endDate);

      await leavesApi.create({
        type: leaveType.toUpperCase(),
        reason,
        startDate: startStr,
        endDate: endStr,
      });
      Alert.alert('Success', 'Leave request submitted!');
      setReason('');
      setLeaveType('');
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
    hasOverlap,
  };
};
