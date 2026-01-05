import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leaves/leaves.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    OrgsModule,
    AttendanceModule,
    LeavesModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
