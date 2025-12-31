import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepo: Repository<TimeEntry>,
  ) {}

  async clockIn(userId: string, location?: any) {
    // Check if already clocked in
    const activeEntry = await this.timeEntryRepo.findOne({
      where: { userId, clockOut: IsNull() },
    });

    if (activeEntry) {
      throw new BadRequestException('You are already clocked in.');
    }

    const entry = this.timeEntryRepo.create({
      userId,
      clockIn: new Date(),
      location_in: location,
    });

    return this.timeEntryRepo.save(entry);
  }

  async clockOut(userId: string, location?: any) {
    const activeEntry = await this.timeEntryRepo.findOne({
      where: { userId, clockOut: IsNull() },
    });

    if (!activeEntry) {
      throw new BadRequestException('You are not clocked in.');
    }

    activeEntry.clockOut = new Date();
    activeEntry.location_out = location;
    
    // Calculate duration in seconds
    const diff = activeEntry.clockOut.getTime() - activeEntry.clockIn.getTime();
    activeEntry.durationSeconds = Math.floor(diff / 1000);

    return this.timeEntryRepo.save(activeEntry);
  }

  async getStatus(userId: string) {
    const activeEntry = await this.timeEntryRepo.findOne({
      where: { userId, clockOut: IsNull() },
    });

    return {
      isClockedIn: !!activeEntry,
      activeEntry,
    };
  }

  async getHistory(userId: string) {
    return this.timeEntryRepo.find({
      where: { userId },
      order: { clockIn: 'DESC' },
      take: 20,
    });
  }
}
