import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Req() req) {
    return this.usersService.findAllByOrg(req.user.orgId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(@Body() userData: any, @Req() req) {
    return this.usersService.create({
      ...userData,
      orgId: req.user.orgId,
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { success: true };
  }
}