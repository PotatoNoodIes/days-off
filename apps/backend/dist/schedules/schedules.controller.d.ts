import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private schedulesService;
    constructor(schedulesService: SchedulesService);
    getSchedules(start: string, end: string): Promise<import("./entities/schedule.entity").Schedule[]>;
    createSchedule(data: any): Promise<import("./entities/schedule.entity").Schedule>;
    updateSchedule(id: string, data: any): Promise<import("./entities/schedule.entity").Schedule | null>;
    deleteSchedule(id: string): Promise<import("typeorm").DeleteResult>;
}
