import { User } from '../../users/entities/user.entity';
export declare class TimeEntry {
    id: string;
    user: User;
    userId: string;
    clockIn: Date;
    clockOut: Date;
    durationSeconds: number;
    location_in: any;
    location_out: any;
    createdAt: Date;
}
