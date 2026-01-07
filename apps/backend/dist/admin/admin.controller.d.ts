import { AttendanceService } from '../attendance/attendance.service';
import { LeavesService } from '../leaves/leaves.service';
import { SchedulesService } from '../schedules/schedules.service';
import { Repository } from 'typeorm';
import { TimeEntry } from '../attendance/entities/time-entry.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { LeaveRequest } from '../leaves/entities/leave-request.entity';
export declare class AdminController {
    private attendanceService;
    private leavesService;
    private schedulesService;
    private timeEntryRepo;
    private userRepo;
    private leaveRequestRepo;
    constructor(attendanceService: AttendanceService, leavesService: LeavesService, schedulesService: SchedulesService, timeEntryRepo: Repository<TimeEntry>, userRepo: Repository<User>, leaveRequestRepo: Repository<LeaveRequest>);
    getDashboardStats(): Promise<{
        attendanceRate: string;
        pendingRequests: number;
        activeToday: number;
        totalUsers: number;
        recentActivity: {
            id: number;
            text: string;
            type: string;
        }[];
    }>;
    getWorkforceStatus(): Promise<{
        isClockedIn: boolean;
        clockInTime: Date | null;
        hoursToday: number;
        id: string;
        email: string;
        password: string;
        firebaseUid: string;
        role: UserRole;
        firstName: string;
        lastName: string;
        organization: import("../orgs/entities/organization.entity").Organization;
        orgId: string;
        leaveBalance: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateTimeEntry(id: string, data: any): Promise<TimeEntry>;
    createTimeEntry(data: any): Promise<TimeEntry>;
}
