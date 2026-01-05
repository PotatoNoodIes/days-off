import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
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
