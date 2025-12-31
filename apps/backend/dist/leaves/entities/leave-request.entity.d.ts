import { User } from '../../users/entities/user.entity';
export declare enum LeaveType {
    VACATION = "VACATION",
    SICK = "SICK",
    UNPAID = "UNPAID"
}
export declare enum LeaveStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class LeaveRequest {
    id: string;
    user: User;
    userId: string;
    type: LeaveType;
    startDate: Date;
    endDate: Date;
    status: LeaveStatus;
    reason: string;
    reviewer: User;
    reviewerId: string;
    createdAt: Date;
    updatedAt: Date;
}
