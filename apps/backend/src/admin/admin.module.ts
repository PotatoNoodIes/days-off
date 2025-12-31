import { Module } from '@nestjs/common';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeavesModule } from '../leaves/leaves.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [AttendanceModule, LeavesModule],
  controllers: [AdminController],
})
export class AdminModule {}
