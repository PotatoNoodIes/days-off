import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { User } from '../users/entities/user.entity';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, User]),
    AuthModule,
    UsersModule,
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [TypeOrmModule, LeavesService],
})
export class LeavesModule {}
