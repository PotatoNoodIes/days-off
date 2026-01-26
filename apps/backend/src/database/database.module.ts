import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Organization } from '../orgs/entities/organization.entity';
import { LeaveRequest } from '../leaves/entities/leave-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('SUPABASE_DATABASE_URL');
        
        console.log('DB CONFIG >>> Connecting to Supabase');

        return {
          type: 'postgres',
          url: url,
          ssl: {
            rejectUnauthorized: false, // Required for Supabase
          },
          entities: [User, Organization, LeaveRequest],
          synchronize: false,
          logging: true,
        };
      }
    }),
  ],
})
export class DatabaseModule {}
