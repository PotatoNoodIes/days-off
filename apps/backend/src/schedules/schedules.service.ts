import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
  ) {}

  async getForDateRange(start: Date, end: Date) {
    return this.scheduleRepo.find({
      where: {
        startTime: Between(start, end),
      },
      relations: ['user'],
      order: { startTime: 'ASC' },
    });
  }

  async create(data: Partial<Schedule>) {
    const schedule = this.scheduleRepo.create(data);
    return this.scheduleRepo.save(schedule);
  }
}
