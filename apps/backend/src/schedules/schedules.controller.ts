import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async getSchedules(@Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) throw new BadRequestException('Start and end dates required');
    return this.schedulesService.getForDateRange(new Date(start), new Date(end));
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createSchedule(@Body() data: any) {
    return this.schedulesService.create(data);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updateSchedule(@Param('id') id: string, @Body() data: any) {
    return this.schedulesService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteSchedule(@Param('id') id: string) {
    return this.schedulesService.delete(id);
  }
}
