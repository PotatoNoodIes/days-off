import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual } from 'typeorm';
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

    const weeklyHours = await this.calculateWeeklyHours(userId);

    return {
      isClockedIn: !!activeEntry,
      activeEntry,
      weeklyHours,
    };
  }

  private async calculateWeeklyHours(userId: string): Promise<number> {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const entries = await this.timeEntryRepo.find({
      where: {
        userId,
        clockIn: MoreThanOrEqual(startOfWeek),
      },
    });

    let totalSeconds = 0;
    entries.forEach(entry => {
      if (entry.durationSeconds) {
        totalSeconds += entry.durationSeconds;
      } else if (!entry.clockOut) {
        // For currently active session, calculate up to now
        const diff = new Date().getTime() - entry.clockIn.getTime();
        totalSeconds += Math.floor(diff / 1000);
      }
    });

    return parseFloat((totalSeconds / 3600).toFixed(2));
  }

  async getHistory(userId: string) {
    return this.timeEntryRepo.find({
      where: { userId },
      order: { clockIn: 'DESC' },
      take: 20,
    });
  }
}
