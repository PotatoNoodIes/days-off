import { LeavesService } from './leaves.service';
import { LeaveStatus } from './entities/leave-request.entity';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    create(req: any, body: any): Promise<import("./entities/leave-request.entity").LeaveRequest>;
    getMyRequests(req: any): Promise<import("./entities/leave-request.entity").LeaveRequest[]>;
    getPending(): Promise<import("./entities/leave-request.entity").LeaveRequest[]>;
    updateStatus(req: any, id: string, body: {
        status: LeaveStatus;
    }): Promise<import("./entities/leave-request.entity").LeaveRequest>;
}
