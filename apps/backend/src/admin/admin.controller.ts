import { Controller, Get, UseGuards } from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import { LeavesService } from '../leaves/leaves.service';
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
    
    // Get active users today (currently clocked in)
    const activeToday = await this.timeEntryRepo.count({
      where: { clockOut: IsNull() },
    });

    // Calculate attendance rate (users with at least one entry this week)
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

    // Get recent activity (last 10 time entries and leave requests)
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
      recentActivity,
    };
  }
}

