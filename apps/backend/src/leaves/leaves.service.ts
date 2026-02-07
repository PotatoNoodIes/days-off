import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus, LeaveType } from './entities/leave-request.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createRequest(userId: string, data: Partial<LeaveRequest>) {
    const request = this.leaveRepo.create({
      ...data,
      userId,
      status: LeaveStatus.PENDING,
    });
    return this.leaveRepo.save(request);
  }

  async getMyRequests(userId: string) {
    return this.leaveRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingRequests() {
    // Exclude SICK days from pending list
    return this.leaveRepo.createQueryBuilder('leave')
      .leftJoinAndSelect('leave.user', 'user')
      .where('leave.status = :status', { status: LeaveStatus.PENDING })
      .andWhere('leave.type != :type', { type: LeaveType.SICK })
      .orderBy('leave.createdAt', 'DESC') // Newest first
      .getMany();
  }

  async getAllRequests() {
    return this.leaveRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: LeaveStatus, reviewerId: string) {
    const request = await this.leaveRepo.findOne({ 
      where: { id },
      relations: ['user'] 
    });
    if (!request) throw new BadRequestException('Request not found');
    
    // Only deduct balance if transitioning TO Approved and wasn't already Approved
    if (status === LeaveStatus.APPROVED && request.status !== LeaveStatus.APPROVED) {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (request.type === LeaveType.UNPAID) {
        // Do not deduct balance for unpaid leave
      } else if (request.user.leaveBalance < diffDays) {
        throw new BadRequestException('Insufficient leave balance');
      }

      if (request.type !== LeaveType.UNPAID) {
        await this.userRepo.update(request.userId, {
          leaveBalance: request.user.leaveBalance - diffDays,
        });
      }
    }
    // Note: If we ever support reversing an approval, we'd add back to the balance here.
    // Given the prompt "Approved values are not persisted correctly", this fix ensures 
    // the balance is updated in the DB upon approval.

    request.status = status;
    request.reviewerId = reviewerId;
    return this.leaveRepo.save(request);
  }
}
