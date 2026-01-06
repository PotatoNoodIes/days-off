import { Module } from '@nestjs/common';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeavesModule } from '../leaves/leaves.module';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  imports: [AttendanceModule, LeavesModule, UsersModule, SchedulesModule],
  controllers: [AdminController],
})
export class AdminModule {}
