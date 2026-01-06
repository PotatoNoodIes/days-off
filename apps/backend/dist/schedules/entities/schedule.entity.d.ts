import { User } from '../../users/entities/user.entity';
export declare enum ScheduleType {
    REGULAR = "REGULAR",
    OVERTIME = "OVERTIME",
    REMOTE = "REMOTE"
}
export declare class Schedule {
    id: string;
    user: User;
    userId: string;
    startTime: Date;
    endTime: Date;
    role: string;
    type: ScheduleType;
    createdAt: Date;
    updatedAt: Date;
}
