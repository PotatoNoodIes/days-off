import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeaveStatus } from './entities/leave-request.entity';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  async create(@Body() body: any) {
    return this.leavesService.createRequest(body.userId, body);
  }

  @Get('me/:userId')
  async getMyRequests(@Param('userId') userId: string) {
    return this.leavesService.getMyRequests(userId);
  }

  @Get('pending')
  async getPending() {
    return this.leavesService.getPendingRequests();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: LeaveStatus; reviewerId: string },
  ) {
    return this.leavesService.updateStatus(id, body.status, body.reviewerId);
  }
}
