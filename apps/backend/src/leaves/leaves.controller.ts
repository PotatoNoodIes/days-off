import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeaveStatus } from './entities/leave-request.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.leavesService.createRequest(req.user.userId, body);
  }

  @Get('me')
  async getMyRequests(@Request() req) {
    return this.leavesService.getMyRequests(req.user.userId);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('pending')
  async getPending() {
    return this.leavesService.getPendingRequests();
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { status: LeaveStatus },
  ) {
    return this.leavesService.updateStatus(id, body.status, req.user.userId);
  }
}
