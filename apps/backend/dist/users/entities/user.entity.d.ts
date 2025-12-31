import { Organization } from '../../orgs/entities/organization.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}
export declare class User {
    id: string;
    email: string;
    firebaseUid: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    organization: Organization;
    orgId: string;
    createdAt: Date;
    updatedAt: Date;
}
