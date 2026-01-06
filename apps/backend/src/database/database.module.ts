import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Organization } from '../orgs/entities/organization.entity';
import { TimeEntry } from '../attendance/entities/time-entry.entity';
import { LeaveRequest } from '../leaves/entities/leave-request.entity';
import { Schedule } from '../schedules/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('DB CONFIG >>>', {
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          user: configService.get('POSTGRES_USER'),
          db: configService.get('POSTGRES_DB'),
        });

        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: Number(configService.get('POSTGRES_PORT')),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          entities: [User, Organization, TimeEntry, LeaveRequest, Schedule],
          synchronize: true,
        };
      }
    }),
  ],
})
export class DatabaseModule {}
