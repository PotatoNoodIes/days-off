import { AttendanceService } from '../attendance/attendance.service';
import { LeavesService } from '../leaves/leaves.service';
import { Repository } from 'typeorm';
import { TimeEntry } from '../attendance/entities/time-entry.entity';
import { User } from '../users/entities/user.entity';
import { LeaveRequest } from '../leaves/entities/leave-request.entity';
export declare class AdminController {
    private attendanceService;
    private leavesService;
    private timeEntryRepo;
    private userRepo;
    private leaveRequestRepo;
    constructor(attendanceService: AttendanceService, leavesService: LeavesService, timeEntryRepo: Repository<TimeEntry>, userRepo: Repository<User>, leaveRequestRepo: Repository<LeaveRequest>);
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
