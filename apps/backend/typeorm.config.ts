import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Department } from './src/users/entities/department.entity';
import { LeaveRequest } from './src/leaves/entities/leave-request.entity';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.SUPABASE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Department, LeaveRequest],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
});
