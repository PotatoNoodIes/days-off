import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Patch, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('departments')
  @Roles(UserRole.ADMIN)
  async getDepartments() {
    return this.usersService.findAllDepartments();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateEmployee(@Param('id', ParseUUIDPipe) id: string, @Body() updateData: UpdateUserDto) {
    return this.usersService.updateEmployee(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.delete(id);
    return { success: true };
  }
}