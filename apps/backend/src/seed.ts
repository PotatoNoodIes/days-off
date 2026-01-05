import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User, UserRole } from './users/entities/user.entity';
import { Organization } from './orgs/entities/organization.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userRepo = app.get(getRepositoryToken(User));
  const orgRepo = app.get(getRepositoryToken(Organization));

  console.log('Seeding data...');

  // Create Org
  let org = await orgRepo.findOne({ where: { name: 'TimeSync Corp' } });
  if (!org) {
    org = orgRepo.create({ name: 'TimeSync Corp', status: 'active' });
    await orgRepo.save(org);
    console.log('Created Org: TimeSync Corp');
  }

  const defaultPassword = await bcrypt.hash('password123', 10);

  // Create Employee
  let employee = await userRepo.findOne({ where: { email: 'employee@timesync.com' } });
  if (!employee) {
    employee = userRepo.create({
      email: 'employee@timesync.com',
      password: defaultPassword,
      firebaseUid: 'mock-uid-employee',
      role: UserRole.EMPLOYEE,
      firstName: 'John',
      lastName: 'Doe',
      organization: org,
    });
    await userRepo.save(employee);
    console.log('Created Employee: John Doe');
  }

  // Create Admin
  let admin = await userRepo.findOne({ where: { email: 'admin@timesync.com' } });
  if (!admin) {
    admin = userRepo.create({
      email: 'admin@timesync.com',
      password: defaultPassword,
      firebaseUid: 'mock-uid-admin',
      role: UserRole.ADMIN,
      firstName: 'Jane',
      lastName: 'Smith',
      organization: org,
    });
    await userRepo.save(admin);
    console.log('Created Admin: Jane Smith');
  }

  await app.close();
}
bootstrap();
