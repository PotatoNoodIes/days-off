import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
        };
    }>;
    register(registerDto: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
        };
    }>;
}
