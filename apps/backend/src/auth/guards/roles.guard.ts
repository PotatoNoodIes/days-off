import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user: jwtUser } = context.switchToHttp().getRequest();
    if (!jwtUser) return false;

    const adminEmails = (this.configService.get<string>('ADMIN_EMAIL') || '').split(',').map(e => e.trim().toLowerCase());
    
    if (adminEmails.includes(jwtUser.email?.toLowerCase())) {
        if (!requiredRoles || requiredRoles.includes(UserRole.ADMIN)) {
            return true;
        }
    }

    if (!requiredRoles) {
      return true;
    }

    const user = await this.usersService.findById(jwtUser.sub);
    if (!user) return false;

    return requiredRoles.some((role) => user.role === role);
  }
}
