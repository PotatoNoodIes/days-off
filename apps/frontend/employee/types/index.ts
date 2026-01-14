export interface AttendanceStatus {
  isClockedIn: boolean;
  activeEntry?: {
    id: string;
    clockIn: string;
    userId: string;
  };
}

export interface WeeklyStats {
  totalHours: number;
  leaveDaysRemaining: number;
}

export interface LeaveRequestData {
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
}
