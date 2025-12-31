import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest])],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [TypeOrmModule, LeavesService],
})
export class LeavesModule {}
