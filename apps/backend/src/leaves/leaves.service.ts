import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRepo: Repository<LeaveRequest>,
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
    return this.leaveRepo.find({
      where: { status: LeaveStatus.PENDING },
      relations: ['user'], // Ensure user object is loaded
      order: { createdAt: 'ASC' },
    });
  }

  async updateStatus(id: string, status: LeaveStatus, reviewerId: string) {
    const request = await this.leaveRepo.findOneBy({ id });
    if (!request) throw new BadRequestException('Request not found');
    
    request.status = status;
    request.reviewerId = reviewerId;
    return this.leaveRepo.save(request);
  }
}
