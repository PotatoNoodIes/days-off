import { Controller, Get, Patch, Body, Param, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { LeavesService } from '../leaves/leaves.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { LeaveRequest } from '../leaves/entities/leave-request.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private leavesService: LeavesService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(LeaveRequest)
    private leaveRequestRepo: Repository<LeaveRequest>,
  ) {}

  @Get('stats')
  async getDashboardStats() {
    const pendingLeaves = await this.leavesService.getPendingRequests();
    
    const recentLeaves = await this.leaveRequestRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      pendingRequests: pendingLeaves.length,
      recentActivity: recentLeaves.map(leave => ({
        id: leave.id,
        text: `${leave.user.firstName} ${leave.user.lastName} requested ${leave.type} Leave`,
        type: 'leave',
      })),
    };
  }

  @Get('users')
  async getAllUsers() {
    return this.userRepo.find({
      select: ['id', 'firstName', 'lastName', 'email', 'leaveBalance', 'role', 'department'],
      order: { firstName: 'ASC' },
    });
  }

  @Patch('users/:id/leave-balance')
  async updateLeaveBalance(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { leaveBalance: number },
  ) {
    if (req.user.userId === id) {
      throw new BadRequestException('You cannot modify your own leave balance');
    }

    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found');
    
    user.leaveBalance = Math.floor(body.leaveBalance);
    return this.userRepo.save(user);
  }
}

