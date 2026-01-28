import { Module } from '@nestjs/common';
import { LeavesModule } from '../leaves/leaves.module';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LeavesModule, UsersModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
