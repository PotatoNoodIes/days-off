import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import { LeavesService } from '../leaves/leaves.service';
import { SchedulesService } from '../schedules/schedules.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual } from 'typeorm';
import { TimeEntry } from '../attendance/entities/time-entry.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { LeaveRequest } from '../leaves/entities/leave-request.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private attendanceService: AttendanceService,
    private leavesService: LeavesService,
    private schedulesService: SchedulesService,
    @InjectRepository(TimeEntry)
    private timeEntryRepo: Repository<TimeEntry>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(LeaveRequest)
    private leaveRequestRepo: Repository<LeaveRequest>,
  ) {}

  @Get('stats')
  async getDashboardStats() {
    const pendingLeaves = await this.leavesService.getPendingRequests();
    
    const activeToday = await this.timeEntryRepo.count({
      where: { clockOut: IsNull() },
    });

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const totalUsers = await this.userRepo.count();
    const activeThisWeek = await this.timeEntryRepo
      .createQueryBuilder('entry')
      .where('entry.clockIn >= :startOfWeek', { startOfWeek })
      .select('COUNT(DISTINCT entry.userId)', 'count')
      .getRawOne();

    const attendanceRate = totalUsers > 0 
      ? `${Math.round((activeThisWeek.count / totalUsers) * 100)}%` 
      : '0%';

    const recentEntries = await this.timeEntryRepo.find({
      relations: ['user'],
      order: { clockIn: 'DESC' },
      take: 5,
    });

    const recentLeaves = await this.leaveRequestRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const recentActivity = [
      ...recentEntries.map((entry, idx) => ({
        id: idx + 1,
        text: `${entry.user.firstName} ${entry.user.lastName} clocked ${entry.clockOut ? 'out' : 'in'} (${new Date(entry.clockIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`,
        type: 'attendance',
      })),
      ...recentLeaves.map((leave, idx) => ({
        id: recentEntries.length + idx + 1,
        text: `${leave.user.firstName} ${leave.user.lastName} requested ${leave.type} Leave`,
        type: 'leave',
      })),
    ]
      .sort((a, b) => b.id - a.id)
      .slice(0, 10);

    return {
      attendanceRate,
      pendingRequests: pendingLeaves.length,
      activeToday,
      totalUsers,
      recentActivity,
    };
  }

  @Get('workforce-status')
  async getWorkforceStatus() {
    const users = await this.userRepo.find({
      select: ['id', 'firstName', 'lastName', 'role', 'email'],
    });

    const statusList = await Promise.all(users.map(async (user) => {
      const activeEntry = await this.timeEntryRepo.findOne({
        where: { userId: user.id, clockOut: IsNull() },
      });

      // Simple calculation for today's hours
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const entriesToday = await this.timeEntryRepo.find({
        where: { userId: user.id, clockIn: MoreThanOrEqual(today) },
      });

      let totalSecondsToday = 0;
      entriesToday.forEach(entry => {
        if (entry.durationSeconds) {
          totalSecondsToday += entry.durationSeconds;
        } else {
          totalSecondsToday += Math.floor((new Date().getTime() - entry.clockIn.getTime()) / 1000);
        }
      });

      return {
        ...user,
        isClockedIn: !!activeEntry,
        clockInTime: activeEntry?.clockIn || null,
        hoursToday: parseFloat((totalSecondsToday / 3600).toFixed(2)),
      };
    }));

    return statusList;
  }

  @Get('schedules')
  async getSchedules(@Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) throw new BadRequestException('Start and end dates required');
    return this.schedulesService.getForDateRange(new Date(start), new Date(end));
  }

  @Patch('time-entries/:id')
  async updateTimeEntry(@Param('id') id: string, @Body() data: any) {
    const entry = await this.timeEntryRepo.findOne({ where: { id } });
    if (!entry) throw new BadRequestException('Entry not found');

    if (data.clockIn) entry.clockIn = new Date(data.clockIn);
    if (data.clockOut) entry.clockOut = new Date(data.clockOut);

    if (entry.clockOut) {
      const diff = entry.clockOut.getTime() - entry.clockIn.getTime();
      entry.durationSeconds = Math.floor(diff / 1000);
    }

    return this.timeEntryRepo.save(entry);
  }

  @Post('time-entries')
  async createTimeEntry(@Body() data: any) {
    if (!data.userId || !data.clockIn) throw new BadRequestException('UserId and ClockIn required');
    
    const entry = new TimeEntry();
    entry.userId = data.userId;
    entry.clockIn = new Date(data.clockIn);
    if (data.clockOut) {
      entry.clockOut = new Date(data.clockOut);
      const diff = entry.clockOut.getTime() - entry.clockIn.getTime();
      entry.durationSeconds = Math.floor(diff / 1000);
    }

    return this.timeEntryRepo.save(entry);
  }
}

