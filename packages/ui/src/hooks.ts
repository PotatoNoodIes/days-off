import { useState, useEffect, useCallback } from 'react';
import { leavesApi, adminApi } from '@time-sync/api';

// Leave Requests Hook
export interface LeaveRequest {
  id: string;
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    departmentId?: string;
    department?: {
      id: string;
      name: string;
    };
  };
}

// ... (omitted lines)

export interface UserStats {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentPtoBalance: number;
  role: string;
  departmentId?: string;
  department?: {
    id: string;
    name: string;
  };
}

export const useLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await leavesApi.getMyRequests();
      setRequests(resp.data);
    } catch (e) {
      console.error('Failed to fetch leave requests', e);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, error, refetch: fetchRequests };
};

// Admin Stats Hook
export interface AdminStats {
  pendingRequests: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await adminApi.getStats();
      setStats(resp.data);
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

// Pending Requests Hook (for admin)
export const usePendingRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await leavesApi.getPending();
      setRequests(resp.data);
    } catch (e) {
      console.error('Failed to fetch pending requests', e);
      setError('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, error, refetch: fetchRequests, setRequests };
};

// All Requests Hook (for admin)
export const useAllLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await leavesApi.getAll();
      setRequests(resp.data);
    } catch (e) {
      console.error('Failed to fetch all leave requests', e);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, error, refetch: fetchRequests, setRequests };
};

export interface UserStats {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentPtoBalance: number;
  role: string;
  departmentId?: string;
  department?: {
    id: string;
    name: string;
  };
}

export const useAllUsers = () => {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await adminApi.getAllUsers();
      setUsers(resp.data);
    } catch (e) {
      console.error('Failed to fetch all users', e);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
