import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    clockIn(req: any, body: {
        location?: any;
    }): Promise<import("./entities/time-entry.entity").TimeEntry>;
    clockOut(req: any, body: {
        location?: any;
    }): Promise<import("./entities/time-entry.entity").TimeEntry>;
    getStatus(req: any): Promise<{
        isClockedIn: boolean;
        activeEntry: import("./entities/time-entry.entity").TimeEntry | null;
        weeklyHours: number;
    }>;
    getHistory(req: any): Promise<import("./entities/time-entry.entity").TimeEntry[]>;
    getStatusForUser(userId: string): Promise<{
        isClockedIn: boolean;
        activeEntry: import("./entities/time-entry.entity").TimeEntry | null;
        weeklyHours: number;
    }>;
}
