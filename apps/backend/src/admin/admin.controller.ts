import { Controller, Get } from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import { LeavesService } from '../leaves/leaves.service';

@Controller('admin')
export class AdminController {
  constructor(
    private attendanceService: AttendanceService,
    private leavesService: LeavesService,
  ) {}

  @Get('stats')
  async getDashboardStats() {
    // Basic stats for MVP
    const pendingLeaves = await this.leavesService.getPendingRequests();
    
    // Mocking some user stats for the weekly overview
    // In a full implementation, we'd query the DB for all users vs clocked-in users
    return {
      attendanceRate: '88%',
      pendingRequests: pendingLeaves.length,
      activeToday: 5,
      recentActivity: [
        { id: 1, text: 'John Doe clocked in (09:02 AM)', type: 'attendance' },
        { id: 2, text: 'Sarah Chen requested Sick Leave', type: 'leave' },
      ],
    };
  }
}
