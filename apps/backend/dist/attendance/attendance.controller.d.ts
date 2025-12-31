import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    clockIn(body: {
        userId: string;
        location?: any;
    }): Promise<import("./entities/time-entry.entity").TimeEntry>;
    clockOut(body: {
        userId: string;
        location?: any;
    }): Promise<import("./entities/time-entry.entity").TimeEntry>;
    getStatus(userId: string): Promise<{
        isClockedIn: boolean;
        activeEntry: import("./entities/time-entry.entity").TimeEntry | null;
    }>;
    getHistory(userId: string): Promise<import("./entities/time-entry.entity").TimeEntry[]>;
}
