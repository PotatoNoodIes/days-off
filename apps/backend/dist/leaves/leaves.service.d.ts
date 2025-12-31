import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';
export declare class LeavesService {
    private leaveRepo;
    constructor(leaveRepo: Repository<LeaveRequest>);
    createRequest(userId: string, data: Partial<LeaveRequest>): Promise<LeaveRequest>;
    getMyRequests(userId: string): Promise<LeaveRequest[]>;
    getPendingRequests(): Promise<LeaveRequest[]>;
    updateStatus(id: string, status: LeaveStatus, reviewerId: string): Promise<LeaveRequest>;
}
