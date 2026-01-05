import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(@Request() req, @Body() body: { location?: any }) {
    return this.attendanceService.clockIn(req.user.userId, body.location);
  }

  @Post('clock-out')
  async clockOut(@Request() req, @Body() body: { location?: any }) {
    return this.attendanceService.clockOut(req.user.userId, body.location);
  }

  @Get('status')
  async getStatus(@Request() req) {
    return this.attendanceService.getStatus(req.user.userId);
  }

  @Get('history')
  async getHistory(@Request() req) {
    return this.attendanceService.getHistory(req.user.userId);
  }

  @Get('status/:userId')
  async getStatusForUser(@Param('userId') userId: string) {
    return this.attendanceService.getStatus(userId);
  }
}
