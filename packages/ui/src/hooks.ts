import { useState, useEffect } from 'react';
import { attendanceApi, leavesApi, adminApi } from '@time-sync/api';

// Attendance Status Hook
export interface AttendanceStatus {
  isClockedIn: boolean;
  activeEntry?: {
    id: string;
    clockIn: string;
    userId: string;
  };
  weeklyHours?: number;
}

export const useAttendanceStatus = () => {
  const [status, setStatus] = useState<AttendanceStatus>({ isClockedIn: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await attendanceApi.getStatus();
      setStatus(resp.data);
    } catch (e) {
      console.error('Failed to fetch attendance status', e);
      setError('Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return { status, loading, error, refetch: fetchStatus };
};

// Leave Requests Hook
export interface LeaveRequest {
  id: string;
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export const useLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
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
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, error, refetch: fetchRequests };
};

// Admin Stats Hook
export interface AdminStats {
  attendanceRate: string;
  pendingRequests: number;
  activeToday: number;
  totalUsers?: number;
  recentActivity: {
    id: number;
    text: string;
    type: string;
  }[];
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
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
  };

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

  const fetchRequests = async () => {
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
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, error, refetch: fetchRequests, setRequests };
};
