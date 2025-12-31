import { AttendanceService } from '../attendance/attendance.service';
import { LeavesService } from '../leaves/leaves.service';
export declare class AdminController {
    private attendanceService;
    private leavesService;
    constructor(attendanceService: AttendanceService, leavesService: LeavesService);
    getDashboardStats(): Promise<{
        attendanceRate: string;
        pendingRequests: number;
        activeToday: number;
        recentActivity: {
            id: number;
            text: string;
            type: string;
        }[];
    }>;
}
