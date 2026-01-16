import { Module } from '@nestjs/common';
import { LeavesModule } from '../leaves/leaves.module';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [LeavesModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
