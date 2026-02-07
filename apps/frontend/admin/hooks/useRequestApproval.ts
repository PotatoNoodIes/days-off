import { Alert } from 'react-native';
import { leavesApi } from '@time-sync/api';

export const useRequestApproval = (
  onApproval: (requestId: string) => void
) => {
  const handleApproval = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      await leavesApi.updateStatus(id, action);
      onApproval(id);
    } catch (e) {
      Alert.alert('Error', 'Failed to update request');
    }
  };

  return { handleApproval };
};
