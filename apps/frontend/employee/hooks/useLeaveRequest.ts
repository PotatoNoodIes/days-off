import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { leavesApi } from '@time-sync/api';
import { LeaveRequestData } from '../types';

export const useLeaveRequest = (onSuccess?: () => void) => {
  const [leaveType, setLeaveType] = useState('Vacation');
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
      const reqStart = parseLocalDate(req.startDate);
      const reqEnd = parseLocalDate(req.endDate);
      
      // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
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
    if (!reason) {
      Alert.alert('Error', 'Please provide a reason');
      return;
    }

    if (hasOverlap()) {
      Alert.alert('Duplicate Request', 'The selected dates overlap with one of your existing requests.');
      return;
    }

    setLoading(true);
    try {
      await leavesApi.create({
        type: leaveType.toUpperCase(),
        reason,
        startDate: formatDateToLocalISO(startDate),
        endDate: formatDateToLocalISO(endDate),
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
    hasOverlap,
  };
};
