import { useState } from 'react';
import { Alert } from 'react-native';
import { attendanceApi } from '@time-sync/api';

export const useClockInOut = (status: any, refetch: () => Promise<any>) => {
  const [loading, setLoading] = useState(false);

  const isClockedIn = !!status?.isClockedIn;
  const clockInTime = status?.activeEntry?.clockIn ? new Date(status.activeEntry.clockIn) : null;

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await attendanceApi.clockIn();
      await refetch();
      Alert.alert('Success', 'You are clocked in!');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await attendanceApi.clockOut();
      await refetch();
      Alert.alert('Success', 'You are clocked out.');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleClock = async () => {
    if (isClockedIn) {
      await handleClockOut();
    } else {
      await handleClockIn();
    }
  };

  return {
    isClockedIn,
    clockInTime,
    loading,
    handleClockIn,
    handleClockOut,
    toggleClock,
  };
};
