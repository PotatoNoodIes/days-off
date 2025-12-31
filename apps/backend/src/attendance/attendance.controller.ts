import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

// Mocking User ID for MVP Phase until Auth Guard is fully active
// In real app, we extract userId from @Request() req.user

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(@Body() body: { userId: string; location?: any }) {
    return this.attendanceService.clockIn(body.userId, body.location);
  }

  @Post('clock-out')
  async clockOut(@Body() body: { userId: string; location?: any }) {
    return this.attendanceService.clockOut(body.userId, body.location);
  }

  @Get('status/:userId')
  async getStatus(@Param('userId') userId: string) {
    return this.attendanceService.getStatus(userId);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.attendanceService.getHistory(userId);
  }
}
