import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Department } from '../users/entities/department.entity';
import { Organization } from '../orgs/entities/organization.entity';
import { LeaveRequest } from '../leaves/entities/leave-request.entity';
import { InitialSchema1769381026908 } from '../migrations/1769381026908-InitialSchema';
import { CreateDepartmentsTable1769382026908 } from '../migrations/1769382026908-CreateDepartmentsTable';

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
            rejectUnauthorized: false,
          },
          entities: [User, Department, Organization, LeaveRequest],
          migrations: [InitialSchema1769381026908, CreateDepartmentsTable1769382026908],
          migrationsRun: true,
          synchronize: false,
          logging: true,
          extra: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }
        };
      }
    }),
  ],
})
export class DatabaseModule {}
