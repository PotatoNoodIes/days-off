"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const user_entity_1 = require("./users/entities/user.entity");
const organization_entity_1 = require("./orgs/entities/organization.entity");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
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
    const defaultPassword = await bcrypt.hash('password123', 10);
    let employee = await userRepo.findOne({ where: { email: 'employee@timesync.com' } });
    if (!employee) {
        employee = userRepo.create({
            email: 'employee@timesync.com',
            password: defaultPassword,
            firebaseUid: 'mock-uid-employee',
            role: user_entity_1.UserRole.EMPLOYEE,
            firstName: 'John',
            lastName: 'Doe',
            organization: org,
        });
        await userRepo.save(employee);
        console.log('Created Employee: John Doe');
    }
    let admin = await userRepo.findOne({ where: { email: 'admin@timesync.com' } });
    if (!admin) {
        admin = userRepo.create({
            email: 'admin@timesync.com',
            password: defaultPassword,
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