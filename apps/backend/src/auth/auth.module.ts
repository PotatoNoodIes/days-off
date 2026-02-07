import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [SupabaseStrategy, RolesGuard],
  exports: [SupabaseStrategy, PassportModule, RolesGuard],
})
export class AuthModule {}
