import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Organization } from './orgs/entities/organization.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const orgRepo = app.get(getRepositoryToken(Organization));

  console.log('Seeding data...');

  // Create Org
  let org = await orgRepo.findOne({ where: { name: 'TimeSync Corp' } });
  if (!org) {
    org = orgRepo.create({ name: 'TimeSync Corp', status: 'active' });
    await orgRepo.save(org);
    console.log('Created Org: TimeSync Corp');
  }

  await app.close();
}
bootstrap();
