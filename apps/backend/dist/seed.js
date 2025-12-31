"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const user_entity_1 = require("./users/entities/user.entity");
const organization_entity_1 = require("./orgs/entities/organization.entity");
const typeorm_1 = require("@nestjs/typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userRepo = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    const orgRepo = app.get((0, typeorm_1.getRepositoryToken)(organization_entity_1.Organization));
    console.log('Seeding data...');
    let org = await orgRepo.findOne({ where: { name: 'TimeSync Corp' } });
    if (!org) {
        org = orgRepo.create({ name: 'TimeSync Corp', status: 'active' });
        await orgRepo.save(org);
        console.log('Created Org: TimeSync Corp');
    }
    let employee = await userRepo.findOne({ where: { email: 'employee@timesync.com' } });
    if (!employee) {
        employee = userRepo.create({
            email: 'employee@timesync.com',
            firebaseUid: 'mock-uid-employee',
            role: user_entity_1.UserRole.EMPLOYEE,
            firstName: 'John',
            lastName: 'Doe',
            organization: org,
        });
        await userRepo.save(employee);
        console.log('Created Employee: John Doe (ID: ' + employee.id + ')');
    }
    else {
        console.log('Employee exists: ' + employee.id);
    }
    let admin = await userRepo.findOne({ where: { email: 'admin@timesync.com' } });
    if (!admin) {
        admin = userRepo.create({
            email: 'admin@timesync.com',
            firebaseUid: 'mock-uid-admin',
            role: user_entity_1.UserRole.ADMIN,
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
//# sourceMappingURL=seed.js.map