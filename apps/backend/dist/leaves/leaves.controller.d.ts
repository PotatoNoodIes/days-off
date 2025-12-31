import { LeavesService } from './leaves.service';
import { LeaveStatus } from './entities/leave-request.entity';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    create(body: any): Promise<import("./entities/leave-request.entity").LeaveRequest>;
    getMyRequests(userId: string): Promise<import("./entities/leave-request.entity").LeaveRequest[]>;
    getPending(): Promise<import("./entities/leave-request.entity").LeaveRequest[]>;
    updateStatus(id: string, body: {
        status: LeaveStatus;
        reviewerId: string;
    }): Promise<import("./entities/leave-request.entity").LeaveRequest>;
}
