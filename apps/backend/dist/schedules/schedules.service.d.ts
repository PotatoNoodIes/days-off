import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
export declare class SchedulesService {
    private scheduleRepo;
    constructor(scheduleRepo: Repository<Schedule>);
    getForDateRange(start: Date, end: Date): Promise<Schedule[]>;
    create(data: Partial<Schedule>): Promise<Schedule>;
    update(id: string, data: Partial<Schedule>): Promise<Schedule | null>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
