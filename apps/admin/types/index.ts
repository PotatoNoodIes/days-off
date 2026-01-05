export interface DashboardStats {
  attendanceRate: string;
  pendingRequests: number;
  activeToday: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  text: string;
  type: 'attendance' | 'leave';
}

export interface LeaveRequest {
  id: string;
  user: { 
    firstName: string; 
    lastName: string; 
  };
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}
