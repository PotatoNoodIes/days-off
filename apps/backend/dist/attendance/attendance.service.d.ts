import { Repository } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
export declare class AttendanceService {
    private timeEntryRepo;
    constructor(timeEntryRepo: Repository<TimeEntry>);
    clockIn(userId: string, location?: any): Promise<TimeEntry>;
    clockOut(userId: string, location?: any): Promise<TimeEntry>;
    getStatus(userId: string): Promise<{
        isClockedIn: boolean;
        activeEntry: TimeEntry | null;
    }>;
    getHistory(userId: string): Promise<TimeEntry[]>;
}
