import { Controller, Get, UseGuards, Request, Inject, forwardRef } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

interface JwtPayload {
  email: string;
  sub: string;
  user_metadata?: { 
    first_name?: string; 
    last_name?: string;
    full_name?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  role?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: { user: JwtPayload }) {
    const adminEmails = (this.configService.get<string>('ADMIN_EMAIL') || '')
      .split(',')
      .map(e => e.trim().toLowerCase());
    
    const role = adminEmails.includes(req.user.email?.toLowerCase()) 
      ? UserRole.ADMIN 
      : UserRole.EMPLOYEE;

    const metadata = req.user.user_metadata || {};
    
    let firstName = metadata.first_name || metadata.given_name || '';
    let lastName = metadata.last_name || metadata.family_name || '';

    if (!firstName && metadata.full_name) {
      const parts = metadata.full_name.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    } else if (!firstName && metadata.name) {
      firstName = metadata.name;
    }

    const user = await this.usersService.syncUser({
      id: req.user.sub,
      email: req.user.email,
      role: role,
      firstName: firstName,
      lastName: lastName,
    });

    return user;
  }
}
